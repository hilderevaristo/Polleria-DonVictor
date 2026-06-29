   function editarProducto(id) {
            alert('Editar producto ID: ' + id);
            // window.location.href = '/admin/productos/editar/' + id;
        }

        function eliminarProducto(id) {
            if (confirm('¿Estás seguro de eliminar este producto?')) {
                alert('Eliminar producto ID: ' + id);
                // fetch('/admin/productos/eliminar/' + id, { method: 'DELETE' })
                //     .then(response => location.reload());
            }
        }

        function verProducto(id) {
            alert('Ver producto ID: ' + id);
            // window.location.href = '/admin/productos/ver/' + id;
        }