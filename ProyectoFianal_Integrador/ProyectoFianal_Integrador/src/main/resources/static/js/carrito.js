// Arreglo temporal que vivirá en el navegador
let carrito = [];

function agregarAlCarrito(nombre, precio, img) {
    // Buscamos si el producto ya está en el carrito
    const existe = carrito.find(item => item.nombre === nombre);
    
    if (existe) {
        existe.cantidad++; // Si existe, sumamos 1
    } else {
        // Si no existe, lo agregamos al arreglo
        carrito.push({ nombre: nombre, precio: parseFloat(precio), img: img, cantidad: 1 });
    }
    
    actualizarCarrito();
    animarCarritoBoton();
    abrirCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const badge = document.getElementById('carrito-cantidad');
    const footer = document.querySelector('.carrito-footer');
    
    lista.innerHTML = ''; // Limpiamos visualmente la lista
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
            
            // Dibujamos cada item en el HTML
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
    
    // Actualizamos los textos de dinero
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

// --- Controles de la Interfaz Visual ---
function abrirCarrito() {
    document.getElementById('carrito-sidebar').classList.add('active');
}

function cerrarCarrito() {
    document.getElementById('carrito-sidebar').classList.remove('active');
}

function animarCarritoBoton() {
    const btn = document.querySelector('.btn-carrito-flotante');
    if(btn) {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
    }
}

// Ejecutar al cargar la página por si hay algo guardado
document.addEventListener("DOMContentLoaded", function() {
    actualizarCarrito();
});