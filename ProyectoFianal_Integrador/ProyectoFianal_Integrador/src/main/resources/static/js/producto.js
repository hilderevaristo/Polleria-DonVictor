const productos = [
    // PROMOCIONES
    { nombre: "Promo Familiar", precio: 79.0, img: "secciones/promociones/Promocion1.png", categoria: "Promociones", desc: "1 Pollo + Papas fritas + Ensalada + Tequeños" },
    { nombre: "Promo Gaseosa", precio: 89.0, img: "secciones/promociones/Promocion2.png", categoria: "Promociones", desc: "1 Pollo + Papas + Ensalada + Gaseosa 1L" },
    { nombre: "Promo Peruana", precio: 92.0, img: "secciones/promociones/Promocion3.png", categoria: "Promociones", desc: "1 Pollo + Papas + Ensalada + Chicha 1.5L" },
    { nombre: "Promo Dúo", precio: 49.0, img: "secciones/promociones/promocion4.png", categoria: "Promociones", desc: "1/2 Pollo + Papas + Ensalada + 2 Gaseosas 500ml" },
    { nombre: "Promo Mega Familiar", precio: 159.0, img: "secciones/promociones/promocion5.png", categoria: "Promociones", desc: "2 Pollos + 2 Papas + 2 Ensaladas + Gaseosa 1.5L" },
    
    // POLLO A LA BRASA
    { nombre: "1/4 Pollo (Pierna)", precio: 25.0, img: "secciones/pollos/1-4pollo.png", categoria: "Pollos", desc: "Papas fritas y ensalada." },
    { nombre: "1/4 Pollo (Pecho)", precio: 27.0, img: "secciones/pollos/1-4pollopecho.png", categoria: "Pollos", desc: "Papas fritas y ensalada." },
    { nombre: "1/2 Pollo", precio: 45.0, img: "secciones/pollos/1-2pollo.png", categoria: "Pollos", desc: "Papas fritas y ensalada." },
    { nombre: "1 Pollo", precio: 79.0, img: "secciones/pollos/1-pollo.png", categoria: "Pollos", desc: "Papas fritas y ensalada." },
    
    // PIQUEOS
    { nombre: "Alitas BBQ (6 und.)", precio: 25.0, img: "secciones/piqueos/alitas_bbq.png", categoria: "Piqueos", desc: "Alitas bañadas en salsa BBQ." },
    { nombre: "Alitas Buffalo (6 und.)", precio: 25.0, img: "secciones/piqueos/alitas_buffalo.png", categoria: "Piqueos", desc: "Alitas picantes estilo Buffalo." },
    { nombre: "Nuggets de Pollo", precio: 20.0, img: "secciones/piqueos/nuggets_pollo.png", categoria: "Piqueos", desc: "Crujientes nuggets de pollo." },
    { nombre: "Tequeños de Queso", precio: 18.0, img: "secciones/piqueos/tequenos_queso.png", categoria: "Piqueos", desc: "Tequeños artesanales de queso." },
    { nombre: "Salchipapa Brasa", precio: 24.0, img: "secciones/piqueos/salchipapa_brasa.png", categoria: "Piqueos", desc: "Con trozos de pollo a la brasa." },
    
    // HAMBURGUESAS
    { nombre: "Hamburguesa Clásica", precio: 20.0, img: "secciones/hamburguesas/hamburguesa_clasica.png", categoria: "Hamburguesas", desc: "Hamburguesa clásica." },
    { nombre: "Hamburguesa con Tocino", precio: 23.0, img: "secciones//hamburguesas/hamburguesa_tocino.png", categoria: "Hamburguesas", desc: "Con tocino crocante." },
    { nombre: "Hamburguesa Crispy Chicken", precio: 24.0, img: "secciones/hamburguesas/hamburguesa_crispy_chicken.png", categoria: "Hamburguesas", desc: "Pollo crujiente." },
    { nombre: "Hamburguesa Doble Carne", precio: 28.0, img: "secciones/hamburguesas/hamburguesa_doble_carne.png", categoria: "Hamburguesas", desc: "Doble carne jugosa." },
    
    // WRAPS
    { nombre: "Wrap de Pollo a la Brasa", precio: 18.0, img: "secciones/Warp/wrap_pollo_brasa.png", categoria: "Wraps", desc: "Pollo a la brasa en tortilla." },
    { nombre: "Crispy Chicken Wrap", precio: 19.0, img: "secciones/Warp/crispy_chicken_wrap_v2.png", categoria: "Wraps", desc: "Pollo crispy en tortilla." },
    { nombre: "Bacon Cheese Wrap", precio: 20.0, img: "secciones/Warp/bacon_cheese_wrap.png", categoria: "Wraps", desc: "Tocino y queso en tortilla." },
    
    // ACOMPAÑAMIENTOS
    { nombre: "Papas fritas chicas", precio: 8.0, img: "secciones/Acompañamientos/papas_chicas_v2.png", categoria: "Acompañamientos", desc: "Porción individual." },
    { nombre: "Papas fritas familiares", precio: 15.0, img: "secciones/Acompañamientos/papas_familiares.png", categoria: "Acompañamientos", desc: "Porción para compartir." },
    { nombre: "Arroz con choclo", precio: 10.0, img: "secciones/Acompañamientos/arroz_con_choclo.png", categoria: "Acompañamientos", desc: "Arroz con choclo tierno." },
    { nombre: "Onion Rings", precio: 16.0, img: "secciones/Acompañamientos/onion_rings.png", categoria: "Acompañamientos", desc: "Aros de cebolla." },
    { nombre: "Camote frito", precio: 14.0, img: "secciones/Acompañamientos/camote_frito_premium.png", categoria: "Acompañamientos", desc: "Camotes crocantes." },
    
    // POSTRES
    { nombre: "Brownie", precio: 8.0, img: "secciones/postres/brownie_fudge.png", categoria: "Postres", desc: "Chocolate fudge." },
    { nombre: "Picarones", precio: 15.0, img: "secciones/postres/picarones.png", categoria: "Postres", desc: "Con miel de chancaca." },
    { nombre: "Tres Leches", precio: 10.0, img: "secciones/postres/tres_leches.png", categoria: "Postres", desc: "Bizcocho tres leches." },
    
    // BEBIDAS
    { nombre: "Gaseosa 500 ml", precio: 5.0, img: "secciones/Bebidas/gaseosas_personales.png", categoria: "Bebidas", desc: "Gaseosa personal." },
    { nombre: "Gaseosa 1 L", precio: 9.0, img: "secciones/Bebidas/gaseosa_1L.png", categoria: "Bebidas", desc: "Gaseosa 1 Litro." },
    { nombre: "Gaseosa 1.5 L", precio: 12.0, img: "secciones/Bebidas/Gaseosa1.5L.png", categoria: "Bebidas", desc: "Gaseosa 1.5 Litros." },
    { nombre: "Chicha Morada 1.5 L", precio: 14.0, img: "secciones/Bebidas/chicha_morada_1.5L.png", categoria: "Bebidas", desc: "Chicha artesanal." },
    { nombre: "Agua Mineral", precio: 4.0, img: "", categoria: "Bebidas", desc: "Agua sin gas." }
];

let carrito = [];

function filtrarProductos(cat, btn) {
    document.querySelectorAll('.btn-filtro').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    const list = cat === 'Todos' ? productos : productos.filter(p => p.categoria === cat);
    
    list.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <img src="${p.img}" loading="lazy">
                <div class="info">
                    <h3>${p.nombre}</h3>
                    <p style="font-size: 0.85rem; color: #666; margin-bottom: 8px;">${p.desc}</p>
                    <p style="font-weight: bold; color: #d9534f; margin-bottom: 10px;">S/ ${p.precio.toFixed(2)}</p>
                    <button class="btn-agregar" onclick="agregarAlCarrito('${p.nombre}', ${p.precio}, '${p.img}')">🛒 Agregar</button>
                </div>
            </div>`;
    });
}

function animarCarrito() {
    const btn = document.querySelector('.btn-carrito');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
}

function agregarAlCarrito(nombre, precio, img) {
    const existe = carrito.find(i => i.nombre === nombre);
    if (existe) existe.cantidad++;
    else carrito.push({ nombre, precio, img, cantidad: 1 });
    actualizarCarrito();
    animarCarrito();
    abrirCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const badge = document.getElementById('carrito-cantidad');
    const footer = document.querySelector('.sidebar-footer');
    lista.innerHTML = '';
    let sub = 0, totalItems = 0;
    
    if (carrito.length === 0) {
        lista.innerHTML = `<div style="text-align:center; padding: 20px;">Tu carrito está vacío</div>`;
        badge.style.display = 'none';
        footer.style.display = 'none';
    } else {
        footer.style.display = 'block';
        carrito.forEach((p, i) => {
            sub += p.precio * p.cantidad;
            totalItems += p.cantidad;
            lista.innerHTML += `
                <div class="item-carrito">
                    <img src="${p.img}" class="miniatura">
                    <div style="flex-grow:1; margin-left:10px;">
                        <div>${p.nombre}</div>
                        <button onclick="cambiarCant(${i},-1)">-</button> ${p.cantidad} <button onclick="cambiarCant(${i},1)">+</button>
                    </div>
                    <button onclick="eliminar(${i})">🗑️</button>
                </div>`;
        });
        badge.innerText = totalItems;
        badge.style.display = 'block';
    }
    document.getElementById('subtotal').innerText = 'S/ ' + sub.toFixed(2);
    document.getElementById('total').innerText = 'S/ ' + (sub + 5).toFixed(2);
}

function cambiarCant(i, c) {
    carrito[i].cantidad += c;
    if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
    actualizarCarrito();
}

function eliminar(i) { carrito.splice(i, 1); actualizarCarrito(); }
function abrirCarrito() { document.getElementById('carrito-sidebar').classList.add('active'); }
function cerrarCarrito() { document.getElementById('carrito-sidebar').classList.remove('active'); }
function vaciarCarrito() { carrito = []; actualizarCarrito(); }

filtrarProductos('Todos', document.querySelector('.btn-filtro'));
actualizarCarrito();