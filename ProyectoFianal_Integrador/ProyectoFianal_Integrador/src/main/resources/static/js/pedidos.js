
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
// ========== ABRIR MODAL CON DETALLE DEL PEDIDO ==========
function abrirModal(pedidoId) {
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalPedido'));
    modal.show();

    // Cargar contenido
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-danger" role="status"></div>
            <p class="mt-2">Cargando...</p>
        </div>
    `;

    // Hacer fetch al controlador
    fetch('/admin/pedido-detalle/' + pedidoId)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                modalBody.innerHTML = generarHTMLPedido(data.pedido);
            } else {
                modalBody.innerHTML = `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i> ${data.message}
                    </div>
                `;
            }
        })
        .catch(error => {
            modalBody.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i> Error al cargar el pedido
                </div>
            `;
        });
}

// ========== GENERAR HTML DEL PEDIDO ==========
function generarHTMLPedido(pedido) {
    let html = `
        <div class="row mb-3">
            <div class="col-md-6">
                <p><strong><i class="fas fa-user text-danger me-2"></i>Cliente:</strong> ${pedido.nombreCliente}</p>
                <p><strong><i class="fas fa-phone text-danger me-2"></i>Teléfono:</strong> ${pedido.telefonoCliente}</p>
                <p><strong><i class="fas fa-envelope text-danger me-2"></i>Email:</strong> ${pedido.usuarioEmail || 'Sin cuenta'}</p>
            </div>
            <div class="col-md-6">
                <p><strong><i class="fas fa-map-marker-alt text-danger me-2"></i>Dirección:</strong> ${pedido.direccionEntrega}</p>
                <p><strong><i class="fas fa-credit-card text-danger me-2"></i>Método pago:</strong> ${pedido.metodoPago}</p>
                <p><strong><i class="fas fa-calendar text-danger me-2"></i>Fecha:</strong> ${pedido.fechaPedido}</p>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Producto</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-end">Precio unit.</th>
                        <th class="text-end">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;

    pedido.detalles.forEach(detalle => {
        html += `
            <tr>
                <td>${detalle.productoNombre}</td>
                <td class="text-center">${detalle.cantidad}</td>
                <td class="text-end">S/ ${detalle.precioUnitario}</td>
                <td class="text-end">S/ ${detalle.subtotal}</td>
            </tr>
        `;
    });

    html += `
            <tr class="table-success fw-bold">
                <td colspan="3" class="text-end">TOTAL:</td>
                <td class="text-end">S/ ${pedido.total}</td>
            </tr>
        </tbody>
    </table>
</div>

<hr>

<div class="row mt-3">
    <div class="col-12">
        <label class="fw-bold"><i class="fas fa-exchange-alt text-danger me-2"></i>Cambiar estado:</label>
        <div class="d-flex flex-wrap gap-2 mt-2">
            ${generarBotonesEstado(pedido.id, pedido.estado)}
        </div>
    </div>
</div>
    `;

    return html;
}

// ========== GENERAR BOTONES DE ESTADO ==========
function generarBotonesEstado(pedidoId, estadoActual) {
    const estados = [
        { valor: 'PENDIENTE', texto: '🟡 Pendiente', color: 'warning' },
        { valor: 'CONFIRMADO', texto: '🟢 Confirmado', color: 'success' },
        { valor: 'EN_PREPARACION', texto: '🔵 En preparación', color: 'info' },
        { valor: 'LISTO', texto: '🟠 Listo', color: 'warning' },
        { valor: 'EN_CAMINO', texto: '🟣 En camino', color: 'secondary' },
        { valor: 'COMPLETADO', texto: '✅ Completado', color: 'success' },
        { valor: 'CANCELADO', texto: '❌ Cancelado', color: 'danger' }
    ];

    let botones = '';
    estados.forEach(estado => {
        const activo = estado.valor === estadoActual ? 'btn-primary' : 'btn-outline-secondary';
        botones += `
            <button class="btn btn-sm ${activo}" 
                    onclick="cambiarEstado(${pedidoId}, '${estado.valor}')">
                ${estado.texto}
            </button>
        `;
    });
    return botones;
}

// ========== CAMBIAR ESTADO DEL PEDIDO ==========
function cambiarEstado(pedidoId, nuevoEstado) {
    if (!confirm('¿Estás seguro de cambiar el estado a ' + nuevoEstado + '?')) {
        return;
    }

    fetch('/admin/pedido-cambiar-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pedidoId, estado: nuevoEstado })
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
        alert('❌ Error al cambiar el estado');
    });
}