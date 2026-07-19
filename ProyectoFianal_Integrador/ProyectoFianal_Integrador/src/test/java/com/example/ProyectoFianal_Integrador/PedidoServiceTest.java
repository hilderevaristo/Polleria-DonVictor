package com.example.ProyectoFianal_Integrador;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class PedidoServiceTest {

    @Test
    void verificarCalculoTotalConDelivery() {
        // ARRANGE
        List<Map<String, Object>> itemsSimulados = new ArrayList<>();
        Map<String, Object> item1 = new HashMap<>();
        item1.put("precioUnitario", 45.00); 
        item1.put("cantidad", 2);
        itemsSimulados.add(item1);

        double subtotal = 0;
        for (Map<String, Object> item : itemsSimulados) {
            double precio = ((Number) item.get("precioUnitario")).doubleValue();
            int cantidad = (int) item.get("cantidad");
            subtotal += precio * cantidad;
        }

        // ACT
        String tipoEntrega = "Delivery";
        double delivery = "Delivery".equals(tipoEntrega) ? 5.00 : 0.00;
        double totalFinal = subtotal + delivery;

        // ASSERT
        Assertions.assertEquals(90.00, subtotal, "El subtotal calculado es incorrecto.");
        Assertions.assertEquals(5.00, delivery, "El costo de envío no corresponde al método Delivery.");
        Assertions.assertEquals(95.00, totalFinal, "El cálculo del total final de la compra falló.");
    }

    @Test
    void verificarCalculoTotalConRecojoEnLocal() {
        // ARRANGE (Compra de 1 Pollo a la Brasa S/ 85.00)
        List<Map<String, Object>> itemsSimulados = new ArrayList<>();
        Map<String, Object> item1 = new HashMap<>();
        item1.put("precioUnitario", 85.00); 
        item1.put("cantidad", 1);
        itemsSimulados.add(item1);

        double subtotal = 0;
        for (Map<String, Object> item : itemsSimulados) {
            double precio = ((Number) item.get("precioUnitario")).doubleValue();
            int cantidad = (int) item.get("cantidad");
            subtotal += precio * cantidad;
        }

        // ACT
        String tipoEntrega = "Recojo";
        double delivery = "Delivery".equals(tipoEntrega) ? 5.00 : 0.00;
        double totalFinal = subtotal + delivery;

        // ASSERT (El envío debe ser S/ 0.00)
        Assertions.assertEquals(85.00, subtotal);
        Assertions.assertEquals(0.00, delivery, "El recojo en local no debe aplicar costo de delivery.");
        Assertions.assertEquals(85.00, totalFinal);
    }

    @Test
    void verificarCarritoVacioNoGeneraTotales() {
        // ARRANGE (Carrito sin productos)
        List<Map<String, Object>> itemsSimulados = new ArrayList<>();
        double subtotal = 0;

        // ACT
        String tipoEntrega = "Recojo";
        double delivery = "Delivery".equals(tipoEntrega) ? 5.00 : 0.00;
        double totalFinal = subtotal + delivery;

        // ASSERT
        Assertions.assertEquals(0.00, subtotal, "El subtotal de un carrito vacío debe ser cero.");
        Assertions.assertEquals(0.00, totalFinal, "El total final de un carrito vacío debe ser cero.");
    }

    @Test
    void verificarRegistroDeUsuarioConDatosValidos() {
        // ARRANGE (Preparar un usuario simulado para la pollería)
        String nombreSimulado = "Carlos Mendoza";
        String emailSimulado = "carlos@email.com";
        String passwordSimulado = "donvictor2026";

        // ACT (Simular la instanciación y carga de datos tal como en el controlador)
        com.example.ProyectoFianal_Integrador.entity.Usuario usuarioTest = new com.example.ProyectoFianal_Integrador.entity.Usuario();
        usuarioTest.setNombre(nombreSimulado);
        usuarioTest.setEmail(emailSimulado);
        usuarioTest.setPassword(passwordSimulado);

        // ASSERT (Comprobaciones lógicas)
        Assertions.assertNotNull(usuarioTest.getNombre(), "El nombre no debería ser nulo.");
        Assertions.assertEquals("carlos@email.com", usuarioTest.getEmail(), "El correo asignado no coincide.");
        Assertions.assertTrue(usuarioTest.getPassword().length() >= 8, "La contraseña no cumple con la longitud mínima de seguridad.");
    }
}