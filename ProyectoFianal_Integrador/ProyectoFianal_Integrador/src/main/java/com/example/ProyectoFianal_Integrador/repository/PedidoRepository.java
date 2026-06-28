package com.example.ProyectoFianal_Integrador.repository;

import com.example.ProyectoFianal_Integrador.entity.Pedido;
import com.example.ProyectoFianal_Integrador.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioOrderByFechaPedidoDesc(Usuario usuario);
    List<Pedido> findAllByOrderByFechaPedidoDesc();
    long countByEstado(String estado);
}