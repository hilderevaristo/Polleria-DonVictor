
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
