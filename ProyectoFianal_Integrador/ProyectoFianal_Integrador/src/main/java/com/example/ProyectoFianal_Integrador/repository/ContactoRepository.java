package com.example.ProyectoFianal_Integrador.repository;

import com.example.ProyectoFianal_Integrador.entity.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ContactoRepository extends JpaRepository<Contacto, Long> {
}