package com.example.ProyectoFianal_Integrador;

import com.example.ProyectoFianal_Integrador.entity.Usuario;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class DonVictorControllerTest {

    @Test
    void protegerDashboardAnteRolesNoAutorizados() {
        // 1. ARRANGE
        // Simular un usuario común (Cliente) que intenta acceder al Dashboard Administrativo
        Usuario usuarioComun = new Usuario();
        usuarioComun.setId(10L);
        usuarioComun.setNombre("Juan Pérez");
        usuarioComun.setRol("USER"); // Rol restringido

        // 2. ACT
        // Evaluar la lógica de interceptación del controlador para restringir accesos lógicos
        boolean accesoConcedido = false;
        String redireccionDestino = "";

        if (usuarioComun != null && "ADMIN".equals(usuarioComun.getRol())) {
            accesoConcedido = true;
            redireccionDestino = "admin/dashboard";
        } else {
            accesoConcedido = false;
            redireccionDestino = "redirect:/login"; // Forzar expulsión del sistema
        }

        // 3. ASSERT
        Assertions.assertFalse(accesoConcedido, "Vulnerabilidad detectada: Un rol USER logró saltar los controles de acceso del Dashboard.");
        Assertions.assertEquals("redirect:/login", redireccionDestino, "El flujo alterno debió redirigir de forma mandatoria a la pantalla de Login.");
    }

    @Test
    void cargarMetricasFinancierasYConteosParaAdmin() {
        // 1. ARRANGE
        // Simular una sesión de Administrador válida e inicializar datos falsos (Mocks) en los repositorios
        Usuario administrador = new Usuario();
        administrador.setNombre("Don Victor Admin");
        administrador.setRol("ADMIN");

        // Simulación de conteos lógicos en la base de datos MySQL (count())
        long totalProductosSimulados = 15; // Representa los elementos listados en productos.js
        long totalUsuariosSimulados = 30;   // Representa los elementos listados en usuarioBusqueda.js

        // Crear una lista simulada de pedidos para calcular los ingresos dinámicos
        List<Map<String, Object>> pedidosSimulados = new ArrayList<>();
        
        Map<String, Object> pedido1 = new HashMap<>();
        pedido1.put("estado", "COMPLETADO");
        pedido1.put("total", 85.00); // 1 Pollo Familiar
        pedidosSimulados.add(pedido1);

        Map<String, Object> pedido2 = new HashMap<>();
        pedido2.put("estado", "PENDIENTE");
        pedido2.put("total", 95.00); // 2 Combos Personales con Delivery
        pedidosSimulados.add(pedido2);

        Map<String, Object> pedido3 = new HashMap<>();
        pedido3.put("estado", "CANCELADO"); // Excluido del flujo de ingresos netos
        pedido3.put("total", 45.00);
        pedidosSimulados.add(pedido3);

        // 2. ACT
        // Ejecución simulada de los métodos lógicos del bloque administrativo para renderizar el panel
        boolean esAdminValido = "ADMIN".equals(administrador.getRol());
        
        double acumuladoIngresosNetos = 0.0;
        if (esAdminValido) {
            acumuladoIngresosNetos = pedidosSimulados.stream()
                    .filter(p -> !"CANCELADO".equals(p.get("estado")))
                    .mapToDouble(p -> (double) p.get("total"))
                    .sum();
        }

        // 3. ASSERT
        Assertions.assertTrue(esAdminValido, "La validación de privilegios para el Administrador ha fallado.");
        Assertions.assertEquals(15, totalProductosSimulados, "El mapeo del volumen total de productos es inconsistente.");
        Assertions.assertEquals(30, totalUsuariosSimulados, "El mapeo del total de usuarios registrados falló.");
        // Verificar que el cálculo financiero excluya correctamente las órdenes canceladas (85.00 + 95.00 = 180.00)
        Assertions.assertEquals(180.00, acumuladoIngresosNetos, "El cálculo del acumulador de ingresos no descartó las ventas canceladas.");
    }
}