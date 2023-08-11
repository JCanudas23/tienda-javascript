// Variables para almacenar datos
let productos = [];
let carrito = [];

// Función para obtener datos desde un archivo JSON
async function obtenerDatosDesdeJson() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la petición fetch: ${response.statusText}`);
        }
        const data = await response.json();
        productos = data;
        return data;
    } catch (error) {
        console.error('Error al obtener los datos desde el archivo JSON:', error);
        throw error;
    }
}

// Función para mostrar los productos en la página
function mostrarProductos(productosAMostrar) {
    const contenedorProductos = document.getElementById("listaProductos");
    contenedorProductos.innerHTML = "";

    productosAMostrar.forEach((producto) => {
        const productoCard = crearProductoCard(producto);
        contenedorProductos.appendChild(productoCard);
    });
}

// Función para manejar el cambio de categoría en el filtro
document.getElementById("categoria").addEventListener("change", (event) => {
    const categoriaSeleccionada = event.target.value;
    filtrarProductos(categoriaSeleccionada);
});

// Función para filtrar productos por categoría
function filtrarProductos(categoria) {
    // Verificar si estamos en la página index.html antes de aplicar el filtro
    const isIndexPage = window.location.pathname.includes("index.html");
    if (!isIndexPage) {
        // Si no estamos en la página index.html, simplemente mostrar todos los productos
        mostrarProductos(productos);
        return;
    }

    // Aplicar el filtro por categoría solo si estamos en la página index.html
    const productosFiltrados = (categoria === 'todos') ? productos : productos.filter(p => p.category === categoria);
    mostrarProductos(productosFiltrados);
}

// Función para mostrar los productos en la página del carrito
function mostrarProductosEnCarrito(productosEnCarrito, page) {
    const contenedorCarrito = document.getElementById("listaCarrito");
    if (contenedorCarrito === null) {
        console.error("El elemento 'listaCarrito' no se encontró en el DOM.");
        return;
    }

    // Limpiar el contenido actual del contenedor
    contenedorCarrito.innerHTML = "";

    // Crear elementos de productos en el carrito y agregarlos al contenedor
    productosEnCarrito.forEach((producto) => {
        const productoEnCarrito = crearProductoEnCarrito(producto);
        contenedorCarrito.appendChild(productoEnCarrito);
    });

    // Actualizar el precio total en la página
    actualizarPrecioTotal();

    // Si estamos en la página de carrito.html, mostrar el botón para finalizar la compra
    if (page === "carrito.html") {
        const finalizarCompraBtn = document.getElementById("finalizarCompra");
        if (finalizarCompraBtn !== null) {
            finalizarCompraBtn.style.display = "block";
        }
    }
}

// Función para actualizar el precio total en la página
function actualizarPrecioTotal() {
    const totalElement = document.getElementById("total");
    const total = carrito.reduce((acc, producto) => acc + producto.price, 0);
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Función para finalizar la compra
function finalizarCompra() {
    vaciarCarrito();
    mostrarProductosEnCarrito(carrito);
}

// Función para guardar el carrito en el localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para cargar el carrito desde el localStorage
function cargarCarritoDesdeLocalStorage() {
    const contenedorCarrito = document.getElementById("listaCarrito");
    if (contenedorCarrito === null) {
        console.error("El elemento 'listaCarrito' no se encontró en el DOM.");
        return;
    }

    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        mostrarProductosEnCarrito(carrito, "carrito.html");
    }
}

// Función para actualizar el contenido del carrito en la página
function actualizarCarrito() {
    const contenedorCarrito = document.getElementById("listaCarrito");
    if (contenedorCarrito === null) {
        console.error("El elemento 'listaCarrito' no se encontró en el DOM.");
        return;
    }
}

// Función para manejar el evento de agregar o eliminar un producto del carrito
function manejarCarrito(producto, accion) {
    if (accion === "agregar") {
        carrito.push(producto);
    } else if (accion === "eliminar") {
        const index = carrito.indexOf(producto);
        if (index !== -1) {
            carrito.splice(index, 1);
        }
    }
    actualizarCarrito();
    guardarCarritoEnLocalStorage(); // Guardar el carrito en localStorage
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnLocalStorage(); // Guardar el carrito vacío en localStorage
}

// Función para crear una tarjeta de producto para mostrar en la página principal
function crearProductoCard(producto) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "18rem";

    const img = document.createElement("img");
    img.src = producto.image;
    img.alt = producto.title;
    img.classList.add("card-img-top");
    card.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const nombre = document.createElement("h5");
    nombre.classList.add("card-title");
    nombre.textContent = producto.title; // Usar el título del producto
    cardBody.appendChild(nombre);

    const precio = document.createElement("p");
    precio.classList.add("card-text");
    precio.textContent = `$${parseFloat(producto.price).toFixed(2) || 'N/A'}`; // Usar el precio del producto
    cardBody.appendChild(precio);

    const descripcion = document.createElement("p");
    descripcion.classList.add("card-text");
    descripcion.textContent = producto.description;
    cardBody.appendChild(descripcion);

    const agregarBoton = document.createElement("a");
    agregarBoton.href = "#";
    agregarBoton.classList.add("btn", "btn-primary");
    agregarBoton.textContent = "Agregar al carrito";
    agregarBoton.addEventListener("click", () => {
        manejarCarrito(producto, "agregar");
        swal({
            title: 'Producto agregado al carrito',
            text: `${producto.title}, Precio: $${producto.price}`,
            icon: 'success',
        });
    });
    cardBody.appendChild(agregarBoton);

    card.appendChild(cardBody);

    return card;
}

// Función para crear un elemento en el carrito como una tarjeta de Bootstrap
function crearProductoEnCarrito(producto) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.width = "18rem";

    const img = document.createElement("img");
    img.src = producto.image;
    img.alt = producto.title; // Usar el título del producto
    img.classList.add("card-img-top");
    card.appendChild(img);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const nombre = document.createElement("h5");
    nombre.classList.add("card-title");
    nombre.textContent = producto.title; // Usar el título del producto
    cardBody.appendChild(nombre);

    const descripcion = document.createElement("p");
    descripcion.classList.add("card-text");
    descripcion.textContent = producto.description;
    cardBody.appendChild(descripcion);

    const precio = document.createElement("p");
    precio.classList.add("card-text");
    precio.textContent = `$${parseFloat(producto.price).toFixed(2) || 'N/A'}`; // Usar el precio del producto
    cardBody.appendChild(precio);

    const eliminarBoton = document.createElement("button");
    eliminarBoton.classList.add("btn", "btn-danger");
    eliminarBoton.textContent = "Eliminar";
    eliminarBoton.addEventListener("click", () => {
        manejarCarrito(producto, "eliminar");
    });
    cardBody.appendChild(eliminarBoton);

    card.appendChild(cardBody);

    return card;
}

// Función para inicializar la aplicación
function inicializarApp() {
    obtenerDatosDesdeJson()
        .then(data => {
            productos = data; // Asignar los productos al array global
            mostrarProductos(data);
        })
        .catch(error => {
            console.error('Error al inicializar la aplicación:', error);
        });
}

// Cargar los datos y mostrar productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar la aplicación y mostrar los productos
    obtenerDatosDesdeJson()
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => {
            console.error('Error al inicializar la aplicación:', error);
        });

    // Cargar el carrito desde el almacenamiento local
    cargarCarritoDesdeLocalStorage();
    actualizarCarrito(); // Mostrar los productos del carrito en la página index.html

    // Verificar si estamos en la página "carrito.html"
    if (window.location.pathname.includes("carrito.html")) {
        // Agregar el evento al botón "finalizarCompra" en carrito.html
        const finalizarCompraBtn = document.getElementById("finalizarCompra");
        if (finalizarCompraBtn) {
            finalizarCompraBtn.addEventListener("click", () => {
                finalizarCompra();
            });
        } else {
            console.error("El botón 'finalizarCompra' no se encontró en el DOM.");
        }
    }
});