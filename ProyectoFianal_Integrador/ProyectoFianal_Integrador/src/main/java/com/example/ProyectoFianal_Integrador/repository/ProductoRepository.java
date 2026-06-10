package com.example.ProyectoFianal_Integrador.repository;

import com.example.ProyectoFianal_Integrador.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}