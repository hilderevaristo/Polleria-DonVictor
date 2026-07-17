package com.example.ProyectoFianal_Integrador.controller;

import com.example.ProyectoFianal_Integrador.dto.PedidoRequest;
import com.example.ProyectoFianal_Integrador.dto.ItemRequest;
import com.example.ProyectoFianal_Integrador.entity.Pedido;
import com.example.ProyectoFianal_Integrador.entity.DetallePedido;
import com.example.ProyectoFianal_Integrador.entity.Producto;
import com.example.ProyectoFianal_Integrador.repository.PedidoRepository;
import com.example.ProyectoFianal_Integrador.repository.DetallePedidoRepository;
import com.example.ProyectoFianal_Integrador.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//IMPORTACIONES AGREGADAS PARA MONITOREO
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoApiController {

    private static final Logger logger = LoggerFactory.getLogger(PedidoApiController.class);

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @PostMapping("/guardar")
    public ResponseEntity<?> guardarPedido(@RequestBody PedidoRequest request) {
        logger.info("🔌 API Recibida: Petición POST externa para registrar un pedido para el cliente: {}", request.getNombreCliente());
        try {
            // 1. Crear e instanciar el Pedido Maestro
            Pedido pedido = new Pedido();
            
            pedido.setNombreCliente(request.getNombreCliente());
            pedido.setTelefonoCliente(request.getTelefonoCliente());
            pedido.setDireccionEntrega(request.getDireccionCliente());
            pedido.setMetodoPago(request.getMetodoPago());
            pedido.setFechaPedido(LocalDateTime.now());
            pedido.setEstado("PENDIENTE");

            // Calcular el subtotal acumulado
            double acumuladoSubtotal = 0.0;
            for (ItemRequest item : request.getItems()) {
                acumuladoSubtotal += item.getPrecioUnitario() * item.getCantidad();
            }
            
            // Asignación de montos obligatorios 
            double costoDelivery = request.getDireccionCliente().equals("Recojo en el local") ? 0.0 : 5.0;
            
            pedido.setSubtotal(acumuladoSubtotal);
            pedido.setDelivery(costoDelivery);
            pedido.setTotal(acumuladoSubtotal + costoDelivery);

            // Guardamos el pedido maestro en MySQL (Genera el ID automáticamente)
            Pedido pedidoGuardado = pedidoRepository.save(pedido);

            // 2. Recorrer y guardar cada Detalle del Pedido vinculado al maestro
            for (ItemRequest item : request.getItems()) {
                DetallePedido detalle = new DetallePedido();
                detalle.setPedido(pedidoGuardado);
                
                Producto producto = productoRepository.findById(item.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                detalle.setProducto(producto);
                
                detalle.setCantidad(item.getCantidad());
                detalle.setPrecioUnitario(item.getPrecioUnitario());

                detallePedidoRepository.save(detalle);
            }

            logger.info("✅ API Success: Pedido API registrado con éxito. ID Asignado: {}", pedidoGuardado.getId());
            return ResponseEntity.ok().build(); 

        } catch (Exception e) {
            // Log de error crítico para auditoría
            logger.error("❌ API Error: Error interno al intentar guardar pedido vía API: {}", e.getMessage());
            return ResponseEntity.status(500).body("Error interno al procesar la compra");
        }
    }
}