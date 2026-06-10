package com.example.ProyectoFianal_Integrador.repository;

import com.example.ProyectoFianal_Integrador.entity.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
}