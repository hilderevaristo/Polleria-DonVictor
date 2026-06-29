  function editarProducto(id) {
            window.location.href = '/admin/productos/editar/' + id;
        }

        function eliminarProducto(id) {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                fetch('/admin/productos/eliminar/' + id, {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('✅ Producto eliminado correctamente');
                        location.reload();
                    } else {
                        alert('❌ Error: ' + data.message);
                    }
                })
                .catch(error => alert('❌ Error al eliminar'));
            }
        }

        function verProducto(id) {
            alert('Ver producto ID: ' + id);
        }