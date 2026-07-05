function editarProducto(id) {
    window.location.href = '/admin/productos/editar/' + id;
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        fetch('/admin/productos/eliminar/' + id, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('✅ Producto eliminado correctamente');
                    location.reload();
                } else {
                    alert('❌ Error: ' + data.message);
                }
            })
            .catch(() => alert('❌ Error al eliminar'));
    }
}

function verProducto(id) {
    alert('Ver producto ID: ' + id);
}

// ========== TOGGLE SIDEBAR ==========
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// ========== ENVÍO DEL FORMULARIO CON SWEETALERT ==========
  document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('formNuevoProducto');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                Swal.fire({
                    title: '¿Crear producto?',
                    text: '¿Estás seguro de crear este nuevo producto?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#dc3545',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sí, crear',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const formData = new FormData(form);
                        
                        fetch('/admin/productos/guardar', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                Swal.fire({
                                    icon: 'success',
                                    title: '✅ ¡Creado!',
                                    text: data.message,
                                    timer: 1500,
                                    timerProgressBar: true,
                                    showConfirmButton: false
                                }).then(() => {
                                    location.reload();
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: '❌ Error',
                                    text: data.message,
                                    confirmButtonColor: '#dc3545'
                                });
                            }
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                title: '❌ Error',
                                text: 'Error al crear el producto',
                                confirmButtonColor: '#dc3545'
                            });
                        });
                    }
                });
            });
        }
    });
