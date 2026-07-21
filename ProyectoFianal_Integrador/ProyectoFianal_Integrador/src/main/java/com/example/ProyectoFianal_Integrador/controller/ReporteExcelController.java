package com.example.ProyectoFianal_Integrador.controller;

import com.example.ProyectoFianal_Integrador.entity.Pedido;
import com.example.ProyectoFianal_Integrador.entity.Producto;
import com.example.ProyectoFianal_Integrador.entity.Usuario;
import com.example.ProyectoFianal_Integrador.repository.PedidoRepository;
import com.example.ProyectoFianal_Integrador.repository.ProductoRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/admin/exportar")
public class ReporteExcelController {

    private static final Logger logger = LoggerFactory.getLogger(ReporteExcelController.class);

    private final ProductoRepository productoRepository;
    private final PedidoRepository pedidoRepository;

    public ReporteExcelController(ProductoRepository productoRepository, PedidoRepository pedidoRepository) {
        this.productoRepository = productoRepository;
        this.pedidoRepository = pedidoRepository;
    }

    // 📌 1. EXPORTAR PRODUCTOS A EXCEL
    @GetMapping("/productos")
    public void exportarProductos(HttpSession session, HttpServletResponse response) throws IOException {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"ADMIN".equals(usuario.getRol())) {
            response.sendRedirect("/login");
            return;
        }

        logger.info("📊 Generando reporte Excel de Productos para el administrador: {}", usuario.getNombre());

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=Catalogo_Productos_DonVictor.xlsx");

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Productos");

        // Estilos Profesionales (Color Naranja Corporativo para la Pollería)
        CellStyle headerStyle = crearEstiloCabecera(workbook);
        CellStyle dataStyle = crearEstiloDatos(workbook);
        CellStyle currencyStyle = crearEstiloMoneda(workbook);

        // Encabezados
        Row headerRow = sheet.createRow(0);
        String[] columnas = {"ID", "Nombre", "Categoría", "Precio (S/)", "Descripción"};
        for (int i = 0; i < columnas.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columnas[i]);
            cell.setCellStyle(headerStyle);
        }

        // Llenado de Datos
        List<Producto> productos = productoRepository.findAll();
        int rowNum = 1;
        for (Producto prod : productos) {
            Row row = sheet.createRow(rowNum++);
            
            Cell cell0 = row.createCell(0);
            cell0.setCellValue(prod.getId() != null ? prod.getId() : 0);
            cell0.setCellStyle(dataStyle);

            Cell cell1 = row.createCell(1);
            cell1.setCellValue(prod.getNombre() != null ? prod.getNombre() : "");
            cell1.setCellStyle(dataStyle);

            Cell cell2 = row.createCell(2);
            cell2.setCellValue(prod.getCategoria() != null ? prod.getCategoria() : "General");
            cell2.setCellStyle(dataStyle);

            Cell cell3 = row.createCell(3);
            cell3.setCellValue(prod.getPrecio() != null ? prod.getPrecio() : 0.0);
            cell3.setCellStyle(currencyStyle);

            Cell cell4 = row.createCell(4);
            cell4.setCellValue(prod.getDescripcion() != null ? prod.getDescripcion() : "");
            cell4.setCellStyle(dataStyle);
        }

        // Autoajustar tamaño de columnas
        for (int i = 0; i < columnas.length; i++) {
            sheet.autoSizeColumn(i);
        }

        workbook.write(response.getOutputStream());
        workbook.close();
    }

    // 📌 2. EXPORTAR ÓRDENES/PEDIDOS A EXCEL
    @GetMapping("/ordenes")
    public void exportarOrdenes(HttpSession session, HttpServletResponse response) throws IOException {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null || !"ADMIN".equals(usuario.getRol())) {
            response.sendRedirect("/login");
            return;
        }

        logger.info("📊 Generando reporte Excel de Órdenes para el administrador: {}", usuario.getNombre());

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=Reporte_Ordenes_DonVictor.xlsx");

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Órdenes de Compra");

        CellStyle headerStyle = crearEstiloCabecera(workbook);
        CellStyle dataStyle = crearEstiloDatos(workbook);
        CellStyle currencyStyle = crearEstiloMoneda(workbook);

        // Encabezados
        Row headerRow = sheet.createRow(0);
        String[] columnas = {"N° Orden", "Cliente", "Teléfono", "Dirección", "Método Pago", "Total (S/)", "Estado"};
        for (int i = 0; i < columnas.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(columnas[i]);
            cell.setCellStyle(headerStyle);
        }

        // Llenado de Datos
        List<Pedido> pedidos = pedidoRepository.findAll();
        int rowNum = 1;
        for (Pedido ped : pedidos) {
            Row row = sheet.createRow(rowNum++);

            Cell cell0 = row.createCell(0);
            cell0.setCellValue(ped.getId() != null ? ped.getId() : 0);
            cell0.setCellStyle(dataStyle);

            Cell cell1 = row.createCell(1);
            cell1.setCellValue(ped.getNombreCliente() != null ? ped.getNombreCliente() : "Cliente Anónimo");
            cell1.setCellStyle(dataStyle);

            Cell cell2 = row.createCell(2);
            cell2.setCellValue(ped.getTelefonoCliente() != null ? ped.getTelefonoCliente() : "-");
            cell2.setCellStyle(dataStyle);

            Cell cell3 = row.createCell(3);
            cell3.setCellValue(ped.getDireccionEntrega() != null ? ped.getDireccionEntrega() : "-");
            cell3.setCellStyle(dataStyle);

            Cell cell4 = row.createCell(4);
            cell4.setCellValue(ped.getMetodoPago() != null ? ped.getMetodoPago() : "Efectivo");
            cell4.setCellStyle(dataStyle);

            Cell cell5 = row.createCell(5);
            cell5.setCellValue(ped.getTotal() != null ? ped.getTotal() : 0.0);
            cell5.setCellStyle(currencyStyle);

            Cell cell6 = row.createCell(6);
            cell6.setCellValue(ped.getEstado() != null ? ped.getEstado() : "PENDIENTE");
            cell6.setCellStyle(dataStyle);
        }

        for (int i = 0; i < columnas.length; i++) {
            sheet.autoSizeColumn(i);
        }

        workbook.write(response.getOutputStream());
        workbook.close();
    }

    // 🎨 MÉTODOS AUXILIARES DE DISEÑO PROFESIONAL
    private CellStyle crearEstiloCabecera(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);

        // Fondo Naranja Oscuro (Tema Pollería)
        style.setFillForegroundColor(IndexedColors.DARK_RED.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle crearEstiloDatos(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle crearEstiloMoneda(Workbook workbook) {
        CellStyle style = crearEstiloDatos(workbook);
        DataFormat format = workbook.createDataFormat();
        style.setDataFormat(format.getFormat("\"S/\" #,##0.00"));
        style.setAlignment(HorizontalAlignment.RIGHT);
        return style;
    }
}