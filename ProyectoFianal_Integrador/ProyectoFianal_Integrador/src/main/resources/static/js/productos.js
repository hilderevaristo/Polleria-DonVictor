/*function editarProducto(id) {
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
    */

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
      // ========== EDITAR PRODUCTO (ABRE MODAL) ==========
      // ========== EDITAR PRODUCTO ==========
    function editarProducto(boton) {
    const id = boton.getAttribute('data-id');
    console.log("📦 Editando producto ID:", id);
    
    if (!id) {
        Swal.fire({
            icon: 'error',
            title: '❌ Error',
            text: 'No se pudo obtener el ID del producto',
            confirmButtonColor: '#dc3545'
        });
        return;
    }
    
    // ✅ OBTENER DATOS DEL PRODUCTO
    fetch('/admin/productos/obtener/' + id)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const producto = data.producto;
                
                // Llenar el formulario del modal
                document.getElementById('edit-id').value = producto.id;
                document.getElementById('edit-nombre').value = producto.nombre;
                document.getElementById('edit-descripcion').value = producto.descripcion || '';
                document.getElementById('edit-precio').value = producto.precio;
                document.getElementById('edit-categoria').value = producto.categoria;
                document.getElementById('edit-imagenUrl').value = producto.imagenUrl || '';
                
                // Abrir modal
                const modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'));
                modal.show();
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
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: '❌ Error',
                text: 'Error al cargar el producto',
                confirmButtonColor: '#dc3545'
            });
        });
}

    // ========== ELIMINAR PRODUCTO ==========
    function eliminarProducto(id) {
        Swal.fire({
            title: '¿Eliminar producto?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/admin/productos/eliminar/' + id, {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '✅ Eliminado',
                            text: data.message,
                            timer: 1500,
                            timerProgressBar: true,
                            showConfirmButton: false
                        }).then(() => location.reload());
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: '❌ Error',
                            text: data.message,
                            confirmButtonColor: '#dc3545'
                        });
                    }
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: '❌ Error',
                        text: 'Error al eliminar el producto',
                        confirmButtonColor: '#dc3545'
                    });
                });
            }
        });
    }
