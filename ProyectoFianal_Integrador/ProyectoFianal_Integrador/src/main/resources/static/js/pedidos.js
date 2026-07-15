// ========== VARIABLES GLOBALES ==========
let estadoFiltroActual = 'todos';
let pedidoIdActual = null;

// ========== CONFIGURACIÓN DE ESTADOS ==========
const ESTADOS_CONFIG = {
    'pendiente': { texto: 'PENDIENTE', color: '#FFA500' },
    'en_proceso': { texto: 'EN PROCESO', color: '#FFD700' },
    'en_camino': { texto: 'EN CAMINO', color: '#1E90FF' },
    'completado': { texto: 'COMPLETADO', color: '#28A745' },
    'cancelado': { texto: 'CANCELADO', color: '#DC3545' }
};

// ========== OBTENER COLOR DEL ESTADO ==========
function getColorEstado(estado) {
    const key = estado?.toLowerCase() || '';
    return ESTADOS_CONFIG[key]?.color || '#6C757D';
}

// ========== OBTENER TEXTO DEL ESTADO ==========
function getTextoEstado(estado) {
    const key = estado?.toLowerCase() || '';
    return ESTADOS_CONFIG[key]?.texto || estado?.toUpperCase() || 'DESCONOCIDO';
}

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

// ========== FILTRAR POR ESTADO ==========
function filtrarPorEstado(estado, boton) {
    console.log("🔍 Filtrando por:", estado);
    
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    if (boton) boton.classList.add('active');
    
    estadoFiltroActual = estado.toLowerCase();
    
    const table = document.getElementById('tablaPedidos');
    if (!table) return;
    
    const rows = table.getElementsByTagName('tr');
    let encontrados = 0;
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.querySelector('td[colspan]')) continue;
        
        const celdas = row.getElementsByTagName('td');
        let estadoCelda = '';
        for (let j = 0; j < celdas.length; j++) {
            const texto = celdas[j]?.textContent?.toLowerCase()?.trim() || '';
            if (texto.includes('pendiente') || texto.includes('en_proceso') || 
                texto.includes('en_camino') || texto.includes('completado') || 
                texto.includes('cancelado')) {
                estadoCelda = texto;
                break;
            }
        }
        
        if (estado === 'todos') {
            row.style.display = '';
            encontrados++;
        } else {
            const estadoFiltro = estado.toLowerCase();
            if (estadoCelda.includes(estadoFiltro)) {
                row.style.display = '';
                encontrados++;
            } else {
                row.style.display = 'none';
            }
        }
    }
    
    console.log(`✅ Mostrados: ${encontrados} pedidos`);
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
        
        const celdas = row.getElementsByTagName('td');
        const cliente = celdas[1]?.textContent?.toUpperCase() || '';
        const telefono = celdas[2]?.textContent?.toUpperCase() || '';
        const direccion = celdas[3]?.textContent?.toUpperCase() || '';
        
        // Obtener estado de la celda 7
        let estado = celdas[7]?.textContent?.toLowerCase()?.trim() || '';
        // Extraer solo el estado (sin el badge)
        for (const key of Object.keys(ESTADOS_CONFIG)) {
            if (estado.includes(key)) {
                estado = key;
                break;
            }
        }

        const coincideBusqueda = filter === '' || 
            cliente.includes(filter) || 
            telefono.includes(filter) || 
            direccion.includes(filter);
        
        const coincideEstado = estadoFiltroActual === 'todos' || 
            estado.includes(estadoFiltroActual);

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

// ========== ABRIR MODAL DE ESTADO ==========
function abrirModalEstado(boton) {
    console.log("🖊️ Abriendo modal de estado");
    
    pedidoIdActual = boton.getAttribute('data-id');
    const estadoActual = boton.getAttribute('data-estado')?.toLowerCase() || '';
    
    console.log("📦 ID:", pedidoIdActual, "Estado actual:", estadoActual);
    
    const container = document.getElementById('botonesEstados');
    if (!container) {
        console.error("❌ Contenedor 'botonesEstados' no encontrado");
        alert('Error: No se encontró el contenedor de estados.\nAsegúrate de tener: <div id="botonesEstados"></div>');
        return;
    }
    container.innerHTML = '';
    
    const estados = [
        { valor: 'pendiente', texto: 'Pendiente', color: '#FFA500' },
        { valor: 'en_proceso', texto: 'En proceso', color: '#FFD700' },
        { valor: 'en_camino', texto: 'En camino', color: '#1E90FF' },
        { valor: 'completado', texto: 'Completado', color: '#28A745' },
        { valor: 'cancelado', texto: 'Cancelado', color: '#DC3545' }
    ];
    
    estados.forEach(estado => {
        const esActivo = estado.valor === estadoActual;
        const btn = document.createElement('button');
        btn.className = `btn-estado-modal ${esActivo ? 'activo' : ''}`;
        btn.setAttribute('data-valor', estado.valor);
        btn.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 12px 16px;
            border: 2px solid ${esActivo ? '#28a745' : '#e9ecef'};
            border-radius: 8px;
            background: ${esActivo ? '#f0fff4' : 'white'};
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 8px;
            font-size: 14px;
        `;
        btn.innerHTML = `
            <span>
                <span style="display:inline-block; width:16px; height:16px; border-radius:50%; background-color:${estado.color}; margin-right:12px;"></span>
                <span>${estado.texto}</span>
            </span>
            <span style="color:#28a745; font-weight:bold; font-size:18px;">${esActivo ? '✓' : ''}</span>
        `;
        btn.onmouseover = function() {
            this.style.borderColor = '#28a745';
            this.style.background = '#f8f9fa';
        };
        btn.onmouseout = function() {
            this.style.borderColor = esActivo ? '#28a745' : '#e9ecef';
            this.style.background = esActivo ? '#f0fff4' : 'white';
        };
        btn.onclick = function() { seleccionarEstado(this); };
        container.appendChild(btn);
    });
    
    const modalElement = document.getElementById('modalCambiarEstado');
    if (!modalElement) {
        console.error("❌ Modal 'modalCambiarEstado' no encontrado");
        alert('Error: No se encontró el modal.\nAsegúrate de tener el modal con id="modalCambiarEstado"');
        return;
    }
    
    modalElement.style.display = 'flex';
    console.log("✅ Modal abierto");
}

// ========== CERRAR MODAL ==========
function cerrarModalEstado() {
    const modal = document.getElementById('modalCambiarEstado');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== SELECCIONAR ESTADO ==========
function seleccionarEstado(boton) {
    const nuevoEstado = boton.getAttribute('data-valor');
    const nuevoEstadoMinuscula = nuevoEstado.toLowerCase();
    
    console.log("📦 Estado seleccionado:", nuevoEstadoMinuscula);
    console.log("📦 ID del pedido:", pedidoIdActual);
    
    // Cerrar modal
    cerrarModalEstado();
    
    // Preparar datos
    const formData = new URLSearchParams();
    formData.append('id', pedidoIdActual);
    formData.append('estado', nuevoEstadoMinuscula);
    
    console.log("📤 Enviando:", formData.toString());
    
    // 🔥 URL del backend (AJUSTAR SEGÚN TU CASO)
    const url = '/admin/pedido-cambiar-estado';
    console.log("📤 URL:", url);
    
    // Mostrar loading
    Swal.fire({
        title: '⏳ Actualizando...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    })
    .then(response => {
        console.log("📥 Status HTTP:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("📥 Respuesta:", data);
        Swal.close();
        if (data.success) {
            Swal.fire({
                title: '✅ Éxito',
                text: 'Estado actualizado correctamente',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                title: '❌ Error',
                text: data.message || 'Error al cambiar el estado',
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        }
    })
    .catch((error) => {
        console.error("❌ Error:", error);
        Swal.close();
        Swal.fire({
            title: '❌ Error de conexión',
            text: `No se pudo conectar con el servidor.\nURL: ${url}\nError: ${error.message}`,
            icon: 'error',
            confirmButtonColor: '#dc3545'
        });
    });
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando pedidos.js");
    
    // Configurar botones de editar estado
    document.querySelectorAll('.btn-editar-estado').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            abrirModalEstado(this);
        });
    });
    
    // Configurar buscador
    const buscador = document.getElementById('buscadorPedidos');
    if (buscador) {
        buscador.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                aplicarFiltros();
            }
        });
    }
    
    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modalCambiarEstado');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModalEstado();
            }
        });
    }
    
    console.log("✅ Inicialización completada");
});

// ========== CERRAR MODAL CON ESC ==========
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalEstado();
    }
});