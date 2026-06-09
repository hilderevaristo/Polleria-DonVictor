// JavaScript para animación del botón Ingresar
document.addEventListener('DOMContentLoaded', function() {

    const formLogin = document.getElementById('formLogin');
    const btnIngresar = document.getElementById('btnIngresar');
    const btnTexto = document.getElementById('btnTexto');
    const btnSpinner = document.getElementById('btnSpinner');

    if (formLogin) {
        formLogin.addEventListener('submit', function(event) {
            // Validar que los campos no estén vacíos
            const email = document.querySelector('input[name="email"]').value;
            const password = document.querySelector('input[name="password"]').value;

            if (!email || !password) {
                event.preventDefault();
                alert('Por favor completa todos los campos');
                return false;
            }

            // Activar animación en el botón
            btnIngresar.classList.add('cargando');
            btnTexto.innerHTML = 'Ingresando';
            btnSpinner.style.display = 'inline-block';

            // Agregar puntos suspensivos animados con intervalo
            let puntos = 0;
            const intervalo = setInterval(() => {
                puntos = (puntos + 1) % 4;
                const textoBase = 'Ingresando';
                const puntosTexto = '.'.repeat(puntos);
                btnTexto.innerHTML = `${textoBase}${puntosTexto}`;
            }, 500);

            // Guardar el intervalo para detenerlo si el formulario falla (opcional)
            formLogin.setAttribute('data-intervalo', intervalo);

            // El formulario se envía automáticamente
            return true;
        });
    }

    // Botón "¿Olvidaste tu contraseña?"
    const btnOlvidePass = document.getElementById('btnOlvidePass');
    if (btnOlvidePass) {
        btnOlvidePass.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📧 Envía un correo a soporte@donvictor.com para recuperar tu contraseña');
        });
    }
});