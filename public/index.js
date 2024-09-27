let productos = [];

// Manejo del modal para agregar nuevo cliente
const modal = document.getElementById("modal");
const btn = document.getElementById("nuevo-cliente-btn");
const span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById('nuevo-cliente-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const ruc = document.getElementById('ruc').value;
    const razonSocial = document.getElementById('razon-social').value;
    const direccion = document.getElementById('direccion').value;
    const distrito = document.getElementById('distrito').value;
    const ciudad = document.getElementById('ciudad').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    alert(`Cliente registrado: ${razonSocial}, RUC: ${ruc}`);

    modal.style.display = "none";
    document.getElementById('nuevo-cliente-form').reset();
});

// Función para agregar productos y mostrarlos en la tabla
document.getElementById('agregar-producto-btn').addEventListener('click', function() {
    const producto = document.getElementById('producto').value.trim();
    const cantidad = document.getElementById('cantidad').value.trim();
    const precio = document.getElementById('precio').value.trim();

    // Validar que no se agreguen productos vacíos
    if (!producto || !cantidad || !precio) {
        alert('Por favor, completa todos los campos de producto, cantidad y precio.');
        return;
    }

    const subtotal = (parseFloat(cantidad) * parseFloat(precio)).toFixed(3);

    productos.push({
        producto,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
        subtotal: parseFloat(subtotal)
    });

    mostrarProductos();

    // Limpiar campos de entrada después de agregar el producto
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precio').value = '';
});

// Función para mostrar los productos en la tabla
function mostrarProductos() {
    const tbody = document.querySelector('#productos-table tbody');
    tbody.innerHTML = '';  // Limpiar tabla antes de actualizarla

    productos.forEach((prod, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prod.producto}</td>
            <td>${prod.cantidad}</td>
            <td>${prod.precio.toFixed(2)}</td>
            <td>${prod.subtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Función para crear la cotización
document.getElementById('cotizacion-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Verificar si hay productos agregados antes de permitir la creación de la cotización
    if (productos.length === 0) {
        alert('Debes agregar al menos un producto antes de crear la cotización.');
        return; // Detener el envío del formulario si no hay productos
    }

    const cliente = document.getElementById('cliente').value;
    const moneda = document.getElementById('moneda').value;

    // Generar número de cotización
    let numeroCotizacion = localStorage.getItem('numeroCotizacion');
    if (!numeroCotizacion) {
        numeroCotizacion = 1;
    } else {
        numeroCotizacion = parseInt(numeroCotizacion) + 1;
    }
    localStorage.setItem('numeroCotizacion', numeroCotizacion);

    // Guardar datos en localStorage
    const cotizacionData = {
        numeroCotizacion,
        cliente,
        moneda,
        productos
    };

    localStorage.setItem('cotizacion', JSON.stringify(cotizacionData));

    // Redirigir a cotiz.html
    window.location.href = 'cotiz.html';
});
