let carrito = [];

function agregarAlCarrito(id, nombre, precio, img) {
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ id: id, nombre: nombre, precio: parseFloat(precio), img: img, cantidad: 1 });
    }

    actualizarCarrito();
    animarCarritoBoton();
    abrirCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const badge = document.getElementById('carrito-cantidad');
    const footer = document.querySelector('.carrito-footer');

    lista.innerHTML = ''; 
    let subtotal = 0;
    let totalItems = 0;

    if (carrito.length === 0) {
        lista.innerHTML = `<div class="text-center text-muted mt-5">Tu carrito está vacío</div>`;
        badge.innerText = '0';
        footer.style.display = 'none';
        cerrarCarrito();
    } else {
        footer.style.display = 'block';

        carrito.forEach((p, index) => {
            subtotal += p.precio * p.cantidad;
            totalItems += p.cantidad;

            lista.innerHTML += `
                <div class="d-flex align-items-center mb-3 p-2 border rounded">
                    <img src="${p.img}" alt="${p.nombre}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div class="flex-grow-1 ms-3">
                        <h6 class="mb-0 fw-bold">${p.nombre}</h6>
                        <span class="text-danger fw-bold">S/ ${p.precio.toFixed(2)}</span>
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="cambiarCant(${index}, -1)">-</button>
                            <span class="btn btn-light disabled px-3">${p.cantidad}</span>
                            <button class="btn btn-outline-secondary" onclick="cambiarCant(${index}, 1)">+</button>
                        </div>
                        <button class="btn btn-link text-danger btn-sm mt-1 p-0" onclick="eliminarDelCarrito(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>`;
        });

        badge.innerText = totalItems;
    }

    document.getElementById('subtotal').innerText = 'S/ ' + subtotal.toFixed(2);
    document.getElementById('total').innerText = 'S/ ' + (subtotal + 5.00).toFixed(2); // +5 de Delivery
}

function cambiarCant(index, variacion) {
    carrito[index].cantidad += variacion;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1); // Si llega a 0, lo borramos
    }
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

function abrirCarrito() {
    document.getElementById('carrito-sidebar').classList.add('active');
}

function cerrarCarrito() {
    document.getElementById('carrito-sidebar').classList.remove('active');
}

function animarCarritoBoton() {
    const btn = document.querySelector('.btn-carrito-flotante');
    if (btn) {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    actualizarCarrito();
});



function abrirCheckout() {
    if (carrito.length === 0) return; // No dejar pasar si está vacío

    // 1. Ocultar carrito, mostrar checkout
    document.getElementById('vista-carrito').style.display = 'none';
    document.getElementById('vista-checkout').style.display = 'flex';

    // 2. Cambiar el título
    document.getElementById('sidebar-title').innerHTML = '<i class="fas fa-receipt"></i> Finalizar Pedido';

    // 3. Copiar los totales al resumen de pago
    let subtotal = 0;
    carrito.forEach(p => subtotal += p.precio * p.cantidad);

    document.getElementById('checkout-subtotal').innerText = 'S/ ' + subtotal.toFixed(2);
    document.getElementById('checkout-total').innerText = 'S/ ' + (subtotal + 5.00).toFixed(2);
}

function volverAlCarrito() {
    document.getElementById('vista-checkout').style.display = 'none';
    document.getElementById('vista-carrito').style.display = 'flex';

    document.getElementById('sidebar-title').innerHTML = '<i class="fas fa-shopping-cart"></i> Tu Carrito';
}

function seleccionarMetodo(botonClickeado) {
    const botones = document.querySelectorAll('.btn-metodo-pago');
    botones.forEach(btn => btn.classList.remove('active'));

    botonClickeado.classList.add('active');
}


function confirmarPedido() {
    const nombre = document.getElementById('cli-nombre').value;
    const telefono = document.getElementById('cli-telefono').value;
    const direccion = document.getElementById('cli-direccion').value;
    const metodoPago = document.querySelector('.btn-metodo-pago.active').getAttribute('data-metodo');

    if (!nombre || !telefono || !direccion) {
        alert("Por favor, completa todos tus datos de envío.");
        return;
    }

    const pedidoData = {
        nombreCliente: nombre,
        telefonoCliente: telefono,
        direccionCliente: direccion,
        metodoPago: metodoPago,
        items: carrito.map(item => ({
            productoId: parseInt(item.id),
            cantidad: item.cantidad,
            precioUnitario: item.precio
        }))
    };

    fetch('/api/pedidos/guardar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoData)
    })
    .then(response => {
        if (response.ok) {
            carrito = [];
            
            const badge = document.getElementById('carrito-cantidad');
            if (badge) badge.innerText = '0';
            
            document.getElementById('vista-checkout').style.display = 'none';
            document.getElementById('vista-exito').style.display = 'flex';
            
            document.getElementById('sidebar-title').innerHTML = '<i class="fas fa-receipt"></i> Finalizar Pedido';
            
            const footerCheckout = document.querySelector('#vista-checkout .carrito-footer');
            if (footerCheckout) footerCheckout.style.display = 'none';

        } else {
            console.error("El servidor respondió con error:", response.status);
        }
    })
    .catch(error => {
        console.error("Error capturado en JavaScript:", error);
    });
}



function cerrarVistaExito() {
    cerrarCarrito(); // Oculta el panel lateral

    document.getElementById('vista-exito').style.display = 'none';
    document.getElementById('vista-carrito').style.display = 'flex';
    document.getElementById('sidebar-title').innerHTML = '<i class="fas fa-shopping-cart"></i> Tu Carrito';
}