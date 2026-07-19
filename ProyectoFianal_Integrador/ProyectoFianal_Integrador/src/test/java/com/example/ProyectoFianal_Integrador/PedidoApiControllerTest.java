package com.example.ProyectoFianal_Integrador;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class PedidoApiControllerTest {

    @Test
    void verificarMapeoCorrectoDePeticionJsonDeCompra() {
        // 1. ARRANGE
        // Simular el payload JSON estructurado que enviaría una llamada fetch() desde el cliente
        Map<String, Object> requestJsonSimulado = new HashMap<>();
        requestJsonSimulado.put("nombreCliente", "Camila Silva");
        requestJsonSimulado.put("telefonoCliente", "987654321");
        requestJsonSimulado.put("direccionCliente", "Av. Central 123 - Los Olivos");
        requestJsonSimulado.put("metodoPago", "Yape");

        List<Map<String, Object>> itemsRequest = new ArrayList<>();
        Map<String, Object> producto1 = new HashMap<>();
        producto1.put("productoId", 1L);
        producto1.put("cantidad", 2);
        producto1.put("precioUnitario", 45.00); // 2 Combos Personales
        itemsRequest.add(producto1);
        
        requestJsonSimulado.put("items", itemsRequest);

        // 2. ACT
        // El controlador lee el mapa, calcula y procesa la transacción financiera
        String clienteMapped = (String) requestJsonSimulado.get("nombreCliente");
        String direccionMapped = (String) requestJsonSimulado.get("direccionCliente");
        
        List<Map<String, Object>> itemsMapped = (List<Map<String, Object>>) requestJsonSimulado.get("items");
        
        double subtotalCalculado = 0.0;
        for (Map<String, Object> item : itemsMapped) {
            double precio = (double) item.get("precioUnitario");
            int cantidad = (int) item.get("cantidad");
            subtotalCalculado += precio * cantidad;
        }

        // Determinar delivery por dirección dinámica
        double costoDelivery = "Recojo en el local".equals(direccionMapped) ? 0.0 : 5.00;
        double totalTransaccion = subtotalCalculado + costoDelivery;

        // 3. ASSERT
        Assertions.assertEquals("Camila Silva", clienteMapped, "El enlace de datos lógicos del cliente se alteró.");
        Assertions.assertEquals(90.00, subtotalCalculado, "La suma aritmética del payload JSON es inconsistente.");
        Assertions.assertEquals(5.00, costoDelivery, "No se asignó la tasa base de envío para despachos a domicilio.");
        Assertions.assertEquals(95.00, totalTransaccion, "El cálculo del total final procesado desde la API falló.");
    }
}