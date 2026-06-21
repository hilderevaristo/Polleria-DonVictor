package com.example.ProyectoFianal_Integrador.controller;

import com.example.ProyectoFianal_Integrador.entity.Contacto;
import com.example.ProyectoFianal_Integrador.entity.Usuario;
import com.example.ProyectoFianal_Integrador.repository.ContactoRepository;
import com.example.ProyectoFianal_Integrador.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDateTime;

@Controller
public class DonVictorController {

    private final UsuarioRepository usuarioRepository;
    private final ContactoRepository contactoRepository;
    private final PasswordEncoder passwordEncoder;

    public DonVictorController(UsuarioRepository usuarioRepository,
            ContactoRepository contactoRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.contactoRepository = contactoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/")
    public String index(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            model.addAttribute("usuarioNombre", usuario.getNombre());
            model.addAttribute("usuarioRol", usuario.getRol());
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
        nuevoUsuario.setPassword(passwordEncoder.encode(password));
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

        System.out.println("Email recibido: " + email);
        System.out.println("Password recibido: " + password);

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        if (usuario == null) {
            System.out.println("❌ Usuario no encontrado");
            model.addAttribute("error", "Correo o contraseña incorrectos");
            return "login";
        }

        System.out.println("✅ Usuario encontrado: " + usuario.getNombre());

        // Si usas encriptación:
        if (passwordEncoder.matches(password, usuario.getPassword())) {
            session.setAttribute("usuario", usuario);
            if ("ADMIN".equals(usuario.getRol())) {
                return "redirect:/admin/dashboard";
            }
            return "redirect:/";
        }

        model.addAttribute("error", "Correo o contraseña incorrectos");
        return "login";
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

        // Datos de ejemplo para el dashboard
        model.addAttribute("totalProductos", 12);
        model.addAttribute("totalUsuarios", 8);
        model.addAttribute("totalOrdenes", 12);
        model.addAttribute("totalIngresos", 1294.00);
        model.addAttribute("adminNombre", usuario.getNombre());

        return "admin/dashboard";
    }
}