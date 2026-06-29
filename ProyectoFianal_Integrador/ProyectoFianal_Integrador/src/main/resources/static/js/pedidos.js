
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