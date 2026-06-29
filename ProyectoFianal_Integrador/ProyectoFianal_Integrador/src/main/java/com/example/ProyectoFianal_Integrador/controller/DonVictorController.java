package com.example.ProyectoFianal_Integrador.controller;

import com.example.ProyectoFianal_Integrador.entity.Contacto;
import com.example.ProyectoFianal_Integrador.entity.DetallePedido;
import com.example.ProyectoFianal_Integrador.entity.ItemCarrito;
import com.example.ProyectoFianal_Integrador.entity.Pedido;
import com.example.ProyectoFianal_Integrador.entity.Producto;
import com.example.ProyectoFianal_Integrador.entity.Usuario;
import com.example.ProyectoFianal_Integrador.repository.ContactoRepository;
import com.example.ProyectoFianal_Integrador.repository.DetallePedidoRepository;
import com.example.ProyectoFianal_Integrador.repository.ProductoRepository;
import com.example.ProyectoFianal_Integrador.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.transaction.annotation.Transactional;

import com.example.ProyectoFianal_Integrador.repository.PedidoRepository;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List; // ← Agregar al inicio
import java.util.Map;



@Controller
public class DonVictorController {

    private final DetallePedidoRepository detallePedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ContactoRepository contactoRepository;
    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;

    public DonVictorController(UsuarioRepository usuarioRepository,
            ContactoRepository contactoRepository,
            ProductoRepository productoRepository,
            PedidoRepository pedidoRepository, DetallePedidoRepository detallePedidoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.contactoRepository = contactoRepository;
        this.productoRepository = productoRepository;
        this.pedidoRepository = pedidoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
    }

    /*
     * @GetMapping("/")
     * public String index(HttpSession session, Model model) {
     * 
     * model.addAttribute("productos", productoRepository.findAll());
     * 
     * Usuario usuario = (Usuario) session.getAttribute("usuario");
     * 
     * if (usuario != null) {
     * model.addAttribute("usuarioNombre", usuario.getNombre());
     * model.addAttribute("usuarioRol", usuario.getRol());
     * }
     * 
     * return "index";
     * }
     */
    @GetMapping("/")
    public String index(HttpSession session, Model model) {

        try {
            model.addAttribute("productos", productoRepository.findAll());
            System.out.println("Productos: " + productoRepository.findAll().size());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/registro")
    public String registro() {
        return "registro";
    }

    @PostMapping("/procesarRegistro")
    public String procesarRegistro(@RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String telefono,
            @RequestParam String password,
            Model model) {

        if (usuarioRepository.existsByEmail(email)) {
            model.addAttribute("error", "El correo ya está registrado");
            return "registro";
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(nombre);
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setTelefono(telefono);
        nuevoUsuario.setPassword(password); // ✅ SIN ENCRIPTAR
        nuevoUsuario.setRol("USER");
        nuevoUsuario.setFechaRegistro(LocalDateTime.now());

        usuarioRepository.save(nuevoUsuario);

        return "redirect:/login?registroExitoso=true";
    }

    @PostMapping("/procesarLogin")
    public String procesarLogin(@RequestParam String email,
            @RequestParam String password,
            HttpSession session,
            Model model) {

        System.out.println("=== LOGIN ===");
        System.out.println("Email: " + email);
        System.out.println("Password: " + password);

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        if (usuario == null) {
            System.out.println("❌ Usuario NO existe");
            model.addAttribute("error", "Correo o contraseña incorrectos");
            return "login";
        }

        System.out.println("✅ Usuario: " + usuario.getNombre());
        System.out.println("Rol: " + usuario.getRol());
        System.out.println("Password en BD: " + usuario.getPassword());

        // ✅ COMPARACIÓN DIRECTA (sin encriptación)
        if (usuario.getPassword().equals(password)) {
            System.out.println("✅ Contraseña correcta");
            session.setAttribute("usuario", usuario);

            if ("ADMIN".equals(usuario.getRol())) {
                System.out.println("🔐 Admin → dashboard");
                return "redirect:/admin/dashboard";
            }
            System.out.println("🏠 Usuario → index");
            return "redirect:/";
        } else {
            System.out.println("❌ Contraseña incorrecta");
            model.addAttribute("error", "Correo o contraseña incorrectos");
            return "login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    @PostMapping("/procesarContacto")
    public String procesarContacto(@RequestParam String nombre,
            @RequestParam String email,
            @RequestParam(required = false) String telefono,
            @RequestParam String mensaje,
            RedirectAttributes redirectAttributes) {

        Contacto contacto = new Contacto();
        contacto.setNombre(nombre);
        contacto.setEmail(email);
        contacto.setTelefono(telefono);
        contacto.setMensaje(mensaje);

        contactoRepository.save(contacto);

        redirectAttributes.addAttribute("exito", true);
        return "redirect:/#contactos";
    }
    // ========== ADMIN PANEL ==========

    @GetMapping("/admin/dashboard")
    public String adminDashboard(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null || !"ADMIN".equals(usuario.getRol())) {
            return "redirect:/login";
        }

        model.addAttribute("totalProductos", 12);
        model.addAttribute("totalUsuarios", usuarioRepository.count());
        model.addAttribute("totalOrdenes", 12);
        model.addAttribute("totalIngresos", 1294.00);
        model.addAttribute("adminNombre", usuario.getNombre());
        model.addAttribute("pagina", "dashboard");

        return "admin/dashboard";
    }

    // ========== ADMIN USUARIOS ==========
    @GetMapping("/admin/usuarios")
    public String adminUsuarios(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        // Verificar que el usuario está logueado y es ADMIN
        if (usuario == null) {
            return "redirect:/login";
        }

        if (!"ADMIN".equals(usuario.getRol())) {
            return "redirect:/";
        }

        try {
            // Obtener todos los usuarios EXCEPTO el admin actual
            List<Usuario> listaUsuarios = usuarioRepository.findAll();
            listaUsuarios.removeIf(u -> u.getEmail().equals(usuario.getEmail()));

            // Enviar datos a la vista
            model.addAttribute("listaUsuarios", listaUsuarios);
            model.addAttribute("totalUsuarios", listaUsuarios.size());

        } catch (Exception e) {
            System.out.println("❌ Error al obtener usuarios: " + e.getMessage());
            model.addAttribute("listaUsuarios", new ArrayList<>());
            model.addAttribute("totalUsuarios", 0);
        }

        model.addAttribute("adminNombre", usuario.getNombre());
        model.addAttribute("pagina", "usuarios");

        return "admin/usuarios";
    }

    @GetMapping("/admin/productos")
    public String adminProductos(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario == null || !"ADMIN".equals(usuario.getRol())) {
            return "redirect:/login";
        }

        model.addAttribute("adminNombre", usuario.getNombre());
        model.addAttribute("pagina", "productos");

        return "admin/productos";
    }

    @PostMapping("/admin/eliminarUsuario")
    public String eliminarUsuario(@RequestParam Long id,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Usuario admin = (Usuario) session.getAttribute("usuario");

        if (admin == null || !"ADMIN".equals(admin.getRol())) {
            return "redirect:/login";
        }

        // Buscar el usuario a eliminar
        Usuario usuarioAEliminar = usuarioRepository.findById(id).orElse(null);

        // Verificar que el usuario existe y no es el admin actual
        if (usuarioAEliminar != null && !usuarioAEliminar.getEmail().equals(admin.getEmail())) {
            usuarioRepository.delete(usuarioAEliminar);
            redirectAttributes.addFlashAttribute("mensajeExito", "Usuario eliminado correctamente");
        } else {
            redirectAttributes.addFlashAttribute("mensajeError", "No puedes eliminar al administrador principal");
        }

        return "redirect:/admin/usuarios";
    }

    // ========== PANEL PEDIDOS ==========
/* 
  @GetMapping("/admin/pedidos")
public String adminPedidos(HttpSession session, Model model) {
    try {
        System.out.println("=== ADMIN PEDIDOS ===");
        
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        
        if (usuario == null || !"ADMIN".equals(usuario.getRol())) {
            System.out.println("❌ Usuario no autorizado");
            return "redirect:/login";
        }
        
        System.out.println("✅ Usuario autorizado: " + usuario.getNombre());
        
        // Obtener todas las órdenes
        List<Pedido> listaPedidos = pedidoRepository.findAllByOrderByFechaPedidoDesc();
        System.out.println("📦 Pedidos encontrados: " + listaPedidos.size());
        
        // Formatear fechas
        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
        List<String> fechasFormateadas = new ArrayList<>();
        for (Pedido p : listaPedidos) {
            if (p.getFechaPedido() != null) {
                fechasFormateadas.add(sdf.format(p.getFechaPedido()));
            } else {
                fechasFormateadas.add("Sin fecha");
            }
        }
        
        // Estadísticas
        long totalPedidos = listaPedidos.size();
        long completados = pedidoRepository.countByEstado("CONFIRMADO");
        long pendientes = pedidoRepository.countByEstado("PENDIENTE");
        double ingresos = listaPedidos.stream().mapToDouble(Pedido::getTotal).sum();
        
        model.addAttribute("listaPedidos", listaPedidos);
        model.addAttribute("fechasFormateadas", fechasFormateadas);
        model.addAttribute("totalPedidos", totalPedidos);
        model.addAttribute("completados", completados);
        model.addAttribute("pendientes", pendientes);
        model.addAttribute("ingresos", ingresos);
        model.addAttribute("adminNombre", usuario.getNombre());
        model.addAttribute("pagina", "pedidos");
        
        System.out.println("✅ Modelo cargado correctamente");
        return "admin/pedidos";
        
    } catch (Exception e) {
        System.out.println("❌ ERROR: " + e.getMessage());
        e.printStackTrace();
        return "redirect:/admin/dashboard";
    }
}
*/
/* */
@GetMapping("/admin/pedidos")
public String adminPedidos(HttpSession session, Model model) {
    Usuario usuario = (Usuario) session.getAttribute("usuario");
    
    if (usuario == null || !"ADMIN".equals(usuario.getRol())) {
        return "redirect:/login";
    }
    
    try {
        List<Pedido> listaPedidos = pedidoRepository.findAll();
        
        long totalPedidos = listaPedidos.size();
        long completados = listaPedidos.stream().filter(p -> "CONFIRMADO".equals(p.getEstado())).count();
        long pendientes = listaPedidos.stream().filter(p -> "PENDIENTE".equals(p.getEstado())).count();
        double ingresos = listaPedidos.stream().mapToDouble(Pedido::getTotal).sum();
        
        model.addAttribute("listaPedidos", listaPedidos);
        model.addAttribute("totalPedidos", totalPedidos);
        model.addAttribute("completados", completados);
        model.addAttribute("pendientes", pendientes);
        model.addAttribute("ingresos", ingresos);
        model.addAttribute("adminNombre", usuario.getNombre());
        model.addAttribute("pagina", "pedidos");
        
    } catch (Exception e) {
        System.out.println("❌ ERROR: " + e.getMessage());
        e.printStackTrace();
        model.addAttribute("listaPedidos", new ArrayList<>());
        model.addAttribute("totalPedidos", 0);
        model.addAttribute("completados", 0);
        model.addAttribute("pendientes", 0);
        model.addAttribute("ingresos", 0.0);
        model.addAttribute("adminNombre", usuario.getNombre());
        model.addAttribute("pagina", "pedidos");
    }
    
    return "admin/pedidos";
}


@PostMapping(value = "/procesarPedido", consumes = "application/json")
@ResponseBody
public Map<String, Object> procesarPedido(@RequestBody Map<String, Object> pedidoData,
                                          HttpSession session) {
    
    Map<String, Object> response = new HashMap<>();
    
    try {
        String nombreCliente = (String) pedidoData.get("nombreCliente");
        String telefonoCliente = (String) pedidoData.get("telefonoCliente");
        String direccionCliente = (String) pedidoData.get("direccionCliente");
        String metodoPago = (String) pedidoData.get("metodoPago");
        String tipoEntrega = (String) pedidoData.get("tipoEntrega");
        
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        
        // Crear pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setNombreCliente(nombreCliente);
        pedido.setTelefonoCliente(telefonoCliente);
        pedido.setDireccionEntrega(direccionCliente);
        pedido.setMetodoPago(metodoPago);
        pedido.setEstado("PENDIENTE");
        pedido.setFechaPedido(LocalDateTime.now());
        
        // Calcular totales
        List<Map<String, Object>> items = (List<Map<String, Object>>) pedidoData.get("items");
        double subtotal = 0;
        for (Map<String, Object> item : items) {
            double precio = ((Number) item.get("precioUnitario")).doubleValue();
            int cantidad = (int) item.get("cantidad");
            subtotal += precio * cantidad;
        }
        
        double delivery = "Delivery".equals(tipoEntrega) ? 5.00 : 0.00;
        double total = subtotal + delivery;
        
        pedido.setSubtotal(subtotal);
        pedido.setDelivery(delivery);
        pedido.setTotal(total);
        
        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        
        // Guardar detalles
        for (Map<String, Object> item : items) {
            Long productoId = ((Number) item.get("productoId")).longValue();
            int cantidad = (int) item.get("cantidad");
            double precio = ((Number) item.get("precioUnitario")).doubleValue();
            
            Producto producto = productoRepository.findById(productoId).orElse(null);
            if (producto != null) {
                DetallePedido detalle = new DetallePedido();
                detalle.setPedido(pedidoGuardado);
                detalle.setProducto(producto);
                detalle.setCantidad(cantidad);
                detalle.setPrecioUnitario(precio);
                detalle.setSubtotal(precio * cantidad);
                detallePedidoRepository.save(detalle);
            }
        }
        
        session.removeAttribute("carrito");
        
        response.put("success", true);
        response.put("message", "Pedido confirmado con éxito");
        
    } catch (Exception e) {
        e.printStackTrace();
        response.put("success", false);
        response.put("message", e.getMessage());
    }
    
    return response;
}

}
