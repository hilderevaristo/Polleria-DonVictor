// ========== CAMBIAR ICONO DEL DETALLE ==========
function cambiarIcono(element, id) {
    const icon = document.getElementById('icono-' + id);
    if (icon) {
        if (icon.classList.contains('fa-chevron-down')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
}

// ========== VARIABLES GLOBALES ==========
let estadoFiltroActual = 'todos';
let pedidoIdActual = null;

// ========== FILTRAR POR ESTADO ==========
function filtrarPorEstado(estado, boton) {
    estadoFiltroActual = estado;
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('active'));
    if (boton) boton.classList.add('active');
    aplicarFiltros();
}

// ========== FILTRAR POR BÚSQUEDA ==========
function filtrarPedidos() {
    aplicarFiltros();
}

// ========== APLICAR FILTROS ==========
function aplicarFiltros() {
    const input = document.getElementById('buscadorPedidos');
    const filter = input ? input.value.toUpperCase().trim() : '';
    const table = document.getElementById('tablaPedidos');
    if (!table) return;
    
    const rows = table.getElementsByTagName('tr');
    let encontrados = 0;

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.querySelector('td[colspan]')) {
            const prevRow = rows[i - 1];
            if (prevRow && prevRow.style.display !== 'none') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
            continue;
        }
        
        const cliente = row.getElementsByTagName('td')[1]?.textContent?.toUpperCase() || '';
        const telefono = row.getElementsByTagName('td')[2]?.textContent?.toUpperCase() || '';
        const direccion = row.getElementsByTagName('td')[3]?.textContent?.toUpperCase() || '';
        const estado = row.getElementsByTagName('td')[7]?.textContent?.toUpperCase() || '';

        const coincideBusqueda = filter === '' || cliente.includes(filter) || telefono.includes(filter) || direccion.includes(filter);
        const coincideEstado = estadoFiltroActual === 'todos' || estado.includes(estadoFiltroActual.toUpperCase());

        if (coincideBusqueda && coincideEstado) {
            row.style.display = '';
            encontrados++;
        } else {
            row.style.display = 'none';
        }
    }

    let mensajeNoResultados = document.getElementById('mensajeNoResultados');
    if (filter.length > 0 && encontrados === 0) {
        if (!mensajeNoResultados) {
            mensajeNoResultados = document.createElement('tr');
            mensajeNoResultados.id = 'mensajeNoResultados';
            mensajeNoResultados.innerHTML = `
                <td colspan="10" class="text-center py-4" style="background-color: #f8f9fa;">
                    <i class="fas fa-search fa-2x text-muted mb-2" style="display: block;"></i>
                    <p class="text-muted mb-0">
                        <strong>🔍 No se encontraron pedidos para "<span id="textoBuscado">${input.value}</span>"</strong>
                    </p>
                </td>
            `;
            table.appendChild(mensajeNoResultados);
        } else {
            mensajeNoResultados.style.display = '';
            const textoBuscado = document.getElementById('textoBuscado');
            if (textoBuscado) textoBuscado.textContent = input.value;
        }
    } else {
        if (mensajeNoResultados) mensajeNoResultados.style.display = 'none';
    }
}

// ========== OBTENER COLOR DEL ESTADO ==========
function getColorEstado(estado) {
    const colores = {
        'PENDIENTE': '#ffc107',
        'EN_PROCESO': '#0dcaf0',
        'EN_CAMINO': '#6c757d',
        'COMPLETADO': '#28a745',
        'CANCELADO': '#dc3545',
        'CONFIRMADO': '#28a745'
    };
    return colores[estado] || '#6c757d';
}

// ========== ABRIR MODAL DE ESTADO ==========
function abrirModalEstado(boton) {
    console.log("🖊️ Abriendo modal de estado");
    
    pedidoIdActual = boton.getAttribute('data-id');
    const estadoActual = boton.getAttribute('data-estado');
    
    console.log("ID:", pedidoIdActual, "Estado actual:", estadoActual);
    
    const estados = [
        { valor: 'PENDIENTE', texto: 'Pendiente', color: '#ffc107' },
        { valor: 'EN_PROCESO', texto: 'En proceso', color: '#0dcaf0' },
        { valor: 'EN_CAMINO', texto: 'En camino', color: '#6c757d' },
        { valor: 'COMPLETADO', texto: 'Completado', color: '#28a745' },
        { valor: 'CANCELADO', texto: 'Cancelado', color: '#dc3545' }
    ];
    
    const container = document.getElementById('botonesEstados');
    if (!container) {
        alert('Error: No se encontró el contenedor de estados');
        return;
    }
    container.innerHTML = '';
    
    estados.forEach(estado => {
        const esActivo = estado.valor === estadoActual;
        const btn = document.createElement('button');
        btn.className = `btn-estado-modal ${esActivo ? 'activo' : ''}`;
        btn.setAttribute('data-valor', estado.valor);
        btn.innerHTML = `
            <span>
                <span class="estado-color" style="background-color: ${estado.color};"></span>
                <span class="estado-nombre">${estado.texto}</span>
            </span>
            <span class="estado-check">${esActivo ? '✓' : ''}</span>
        `;
        btn.onclick = function() { seleccionarEstado(this); };
        container.appendChild(btn);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('modalCambiarEstado'));
    modal.show();
}

// ========== SELECCIONAR ESTADO ==========
function seleccionarEstado(boton) {
    const nuevoEstado = boton.getAttribute('data-valor');
    const textoEstado = boton.querySelector('.estado-nombre').textContent;
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCambiarEstado'));
    if (modal) modal.hide();
    
    const formData = new URLSearchParams();
    formData.append('id', pedidoIdActual);
    formData.append('estado', nuevoEstado);
    
    fetch('/admin/pedido-cambiar-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload(); // Solo recarga, sin mensaje
        } else {
            Swal.fire({
                title: '❌ Error',
                text: data.message,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        }
    })
    .catch(() => {
        Swal.fire({
            title: '❌ Error',
            text: 'Error al cambiar el estado',
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    });
}
// ========== INICIALIZAR BOTONES AL CARGAR ==========
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botones de editar estado
    document.querySelectorAll('.btn-editar-estado').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            abrirModalEstado(this);
        });
    });
});

