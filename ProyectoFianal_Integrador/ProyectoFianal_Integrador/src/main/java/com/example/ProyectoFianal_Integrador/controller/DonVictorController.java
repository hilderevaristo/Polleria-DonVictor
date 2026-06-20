package com.example.ProyectoFianal_Integrador.controller;

import com.example.ProyectoFianal_Integrador.entity.Producto;
import com.example.ProyectoFianal_Integrador.repository.ProductoRepository;
import java.util.List;
import com.example.ProyectoFianal_Integrador.entity.Contacto;
import com.example.ProyectoFianal_Integrador.entity.Usuario;
import com.example.ProyectoFianal_Integrador.repository.ContactoRepository;
import com.google.common.base.CharMatcher;
import org.apache.commons.lang3.StringUtils;
import com.example.ProyectoFianal_Integrador.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ContactoRepository contactoRepository;
    
    @Autowired
    private ProductoRepository productoRepository;

    // --- DE TU COMPAÑERO: Herramienta de seguridad ---
    @Autowired
    private PasswordEncoder passwordEncoder; 

    @GetMapping("/")
    public String index(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            model.addAttribute("usuarioNombre", usuario.getNombre());
        }

        List<Producto> listaProductos = productoRepository.findAll();
        model.addAttribute("productos", listaProductos);
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

        // --- TUYO: Limpieza de datos ---
        String nombreLimpio = StringUtils.capitalize(StringUtils.normalizeSpace(nombre));
        String telefonoLimpio = CharMatcher.inRange('0', '9').retainFrom(telefono);

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setNombre(nombreLimpio);
        nuevoUsuario.setEmail(email);
        nuevoUsuario.setTelefono(telefonoLimpio); 
        
        // --- DE TU COMPAÑERO: Encriptar contraseña ---
        nuevoUsuario.setPassword(passwordEncoder.encode(password));
        nuevoUsuario.setFechaRegistro(LocalDateTime.now());

        usuarioRepository.save(nuevoUsuario);

        return "redirect:/login?registroExitoso=true";
    }

    @PostMapping("/procesarLogin")
    public String procesarLogin(@RequestParam String email,
            @RequestParam String password,
            HttpSession session,
            Model model) {

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        // --- DE TU COMPAÑERO: Verificar contraseña encriptada ---
        if (usuario != null && passwordEncoder.matches(password, usuario.getPassword())) {
            session.setAttribute("usuario", usuario);
            return "redirect:/";
        } else {
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

        // --- TUYO: Limpieza de nombre ---
        String nombreLimpio = StringUtils.capitalize(StringUtils.normalizeSpace(nombre));
        contacto.setNombre(nombreLimpio);
        contacto.setEmail(email);
        contacto.setMensaje(mensaje);
        
        // --- TUYO: Limpieza de teléfono ---
        if (telefono != null && !telefono.trim().isEmpty()) {
            String telefonoLimpio = CharMatcher.inRange('0', '9').retainFrom(telefono);
            contacto.setTelefono(telefonoLimpio);
        } else {
            contacto.setTelefono(null);
        }
        contactoRepository.save(contacto);

        redirectAttributes.addAttribute("exito", true);
        return "redirect:/#contactos"; 
    }

    @GetMapping("/productos")
    public String productos(Model model) {
        List<Producto> listaProductos = productoRepository.findAll();
        model.addAttribute("productos", listaProductos);
        return "productos";
    }

    @GetMapping("/promociones")
    public String promociones() {
        return "promociones";
    }

    @GetMapping("/nosotros")
    public String nosotros() {
        return "nosotros";
    }

    @GetMapping("/contactos")
    public String contactos() {
        return "contactos";
    }
}