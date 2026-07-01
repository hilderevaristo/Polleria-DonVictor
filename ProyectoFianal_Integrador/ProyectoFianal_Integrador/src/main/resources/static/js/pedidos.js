
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
        function filtrarPedidos() {
            const input = document.getElementById('buscadorPedidos');
            if (!input) return;
            const filter = input.value.toUpperCase();
            const table = document.getElementById('tablaPedidos');
            if (!table) return;
            const rows = table.getElementsByTagName('tr');

            for (let i = 1; i < rows.length; i++) {
                const cliente = rows[i].getElementsByTagName('td')[1]?.textContent?.toUpperCase() || '';
                if (cliente.indexOf(filter) > -1) {
                    rows[i].style.display = '';
                } else {
                    rows[i].style.display = 'none';
                }
            }
        }

        // ========== FILTRAR POR ESTADO ==========
// ========== VARIABLE DE ESTADO ==========
let estadoFiltroActual = 'todos';

// ========== FILTRAR POR ESTADO ==========
function filtrarPorEstado(estado, boton) {
    estadoFiltroActual = estado;
    
    // Quitar clase 'active' de todos los botones
    document.querySelectorAll('.card-body .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Agregar clase 'active' al botón clickeado
    if (boton) {
        boton.classList.add('active');
    }
    
    aplicarFiltros();
}

// ========== FILTRAR POR BÚSQUEDA ==========
function filtrarPedidos() {
    aplicarFiltros();
}

// ========== APLICAR FILTROS ==========
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
        
        // Saltar filas de detalle
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

    // ✅ MOSTRAR MENSAJE SI NO HAY RESULTADOS
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
            if (textoBuscado) {
                textoBuscado.textContent = input.value;
            }
        }
    } else {
        if (mensajeNoResultados) {
            mensajeNoResultados.style.display = 'none';
        }
    }
}

function editarEstado(pedidoId, estadoActual) {
    console.log("🖊️ Editando pedido:", pedidoId, "Estado actual:", estadoActual);
    
    const nuevoEstado = prompt(
        'Selecciona el nuevo estado del pedido:\n\n' +
        '1. Pendiente\n' +
        '2. Confirmado\n' +
        '3. En preparación\n' +
        '4. Listo\n' +
        '5. En camino\n' +
        '6. Completado\n' +
        '7. Cancelado\n\n' +
        'Escribe el número (1-7):'
    );
    
    if (nuevoEstado === null || nuevoEstado === '') return;
    
    const estados = {
        '1': 'PENDIENTE',
        '2': 'CONFIRMADO',
        '3': 'EN_PREPARACION',
        '4': 'LISTO',
        '5': 'EN_CAMINO',
        '6': 'COMPLETADO',
        '7': 'CANCELADO'
    };
    
    const estadoSeleccionado = estados[nuevoEstado];
    if (!estadoSeleccionado) {
        alert('❌ Opción inválida. Elige un número del 1 al 7.');
        return;
    }
    
    if (!confirm(`¿Cambiar estado a "${estadoSeleccionado}"?`)) return;
    
    // Enviar al servidor
    const formData = new URLSearchParams();
    formData.append('id', pedidoId);
    formData.append('estado', estadoSeleccionado);
    
    fetch('/admin/pedido-cambiar-estado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Estado actualizado correctamente');
            location.reload();
        } else {
            alert('❌ Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('❌ Error al cambiar el estado: ' + error.message);
    });
}


// ========== CONFIGURAR BOTONES DE EDICIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-editar-estado').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // ✅ Detener propagación del evento
            e.stopPropagation();
            
            const id = this.getAttribute('data-id');
            const estado = this.getAttribute('data-estado');
            editarEstado(id, estado);
        });
    });
});