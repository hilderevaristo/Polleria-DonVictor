package com.example.ProyectoFianal_Integrador.dto;

import java.util.List;

public class PedidoRequest {
    private String nombreCliente;
    private String telefonoCliente;
    private String direccionCliente;
    private String metodoPago;
    private List<ItemRequest> items;

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
    public String getTelefonoCliente() { return telefonoCliente; }
    public void setTelefonoCliente(String telefonoCliente) { this.telefonoCliente = telefonoCliente; }
    public String getDireccionCliente() { return direccionCliente; }
    public void setDireccionCliente(String direccionCliente) { this.direccionCliente = direccionCliente; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public List<ItemRequest> getItems() { return items; }
    public void setItems(List<ItemRequest> items) { this.items = items; }
}
