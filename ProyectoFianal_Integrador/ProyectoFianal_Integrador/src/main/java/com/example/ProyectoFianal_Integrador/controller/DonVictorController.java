package com.example.ProyectoFianal_Integrador.controller;

import com.example.ProyectoFianal_Integrador.entity.Contacto;
import com.example.ProyectoFianal_Integrador.entity.Usuario;
import com.example.ProyectoFianal_Integrador.repository.ContactoRepository;
import com.example.ProyectoFianal_Integrador.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
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
    private ContactoRepository contactoRepository;  // ← NUEVO: repositorio de contactos

    @GetMapping("/")
    public String index(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            model.addAttribute("usuarioNombre", usuario.getNombre());
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
        nuevoUsuario.setPassword(password);
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
        
        if (usuario != null && usuario.getPassword().equals(password)) {
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
    
    // ========== NUEVO: PROCESAR CONTACTO ==========
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
        // fechaEnvio se asigna automáticamente en el constructor de Contacto
        
        contactoRepository.save(contacto);
        
        redirectAttributes.addAttribute("exito", true);
        return "redirect:/#contactos";  // Vuelve a la sección contactos
    }
    
    // ========== MÉTODOS PARA PÁGINAS (si aún los usas) ==========
    @GetMapping("/productos")
    public String productos() { return "productos"; }
    
    @GetMapping("/promociones")
    public String promociones() { return "promociones"; }
    
    @GetMapping("/nosotros")
    public String nosotros() { return "nosotros"; }
    
    @GetMapping("/contactos")
    public String contactos() { return "contactos"; }
}