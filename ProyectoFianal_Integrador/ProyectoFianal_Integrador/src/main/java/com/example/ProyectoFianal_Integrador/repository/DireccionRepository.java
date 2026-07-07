package com.example.ProyectoFianal_Integrador.repository;

import com.example.ProyectoFianal_Integrador.entity.Direccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    
    // Método personalizado para buscar todas las direcciones de un usuario específico
    List<Direccion> findByUsuarioId(Long usuarioId);
}