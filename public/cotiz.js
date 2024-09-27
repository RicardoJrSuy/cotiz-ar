const cotizacionDataJSON = localStorage.getItem('cotizacion');
if (!cotizacionDataJSON) {
    alert('No hay datos de cotización disponibles.');
} else {
    const cotizacionData = JSON.parse(cotizacionDataJSON);

    // Mostrar información del cliente
    document.getElementById('cliente').textContent = cotizacionData.cliente || 'Cliente no disponible';
    document.getElementById('direccion-cliente').textContent = cotizacionData.direccion || 'Dirección no disponible';
    document.getElementById('fecha-cotizacion').textContent = new Date().toLocaleDateString();

    // Mostrar número de cotización
    document.getElementById('numero-cotizacion').textContent = cotizacionData.numeroCotizacion || 'Sin número';

    // Mostrar productos en la tabla
    const tablaProductos = document.getElementById('tabla-productos');
    let subtotal = 0;

    cotizacionData.productos.forEach((item, index) => {
        const cantidad = parseInt(item.cantidad);
        const precioUnitario = parseFloat(item.precio).toFixed(2); // Mostrar con dos decimales
        const valorVenta = (cantidad * parseFloat(item.precio)).toFixed(2);  // Calcular valor total con dos decimales
        subtotal += parseFloat(valorVenta);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.producto}</td>
            <td>${cantidad}</td>
            <td>${precioUnitario}</td> <!-- Sin símbolo de moneda -->
            <td>${valorVenta}</td> <!-- Sin símbolo de moneda -->
        `;
        tablaProductos.appendChild(row);
    });

    // Calcular IGV y Total
    const igv = (subtotal * 0.18).toFixed(2);
    const total = (subtotal + parseFloat(igv)).toFixed(2);

    // Obtener la moneda
    const moneda = cotizacionData.moneda;

    // Mostrar Subtotal, IGV y Total con símbolo de moneda
    document.getElementById('subtotal').textContent = `${moneda} ${subtotal}`;
    document.getElementById('igv').textContent = `${moneda} ${igv}`;
    document.getElementById('total').textContent = `${moneda} ${total}`;

    // Limpiar cotización del localStorage
    localStorage.removeItem('cotizacion');
}

// Función para generar PDF con vista de escritorio y ocultar botones temporalmente
function generarPDF() {
    const guardarPDFButton = document.getElementById('guardar-pdf');
    const imprimirButton = document.getElementById('imprimir-cotizacion');

    // Ocultar ambos botones mientras se genera el PDF
    guardarPDFButton.style.display = 'none';
    imprimirButton.style.display = 'none';

    // Aplicar estilos de escritorio antes de generar el PDF
    document.body.style.zoom = "100%";  // Forzar la vista como si estuviera en escritorio
    document.body.style.width = "800px";  // Ajustar el ancho a 800px como en una pantalla de escritorio
    document.body.style.margin = "0 auto";  // Centrar el contenido como en escritorio

    const { jsPDF } = window.jspdf;

    html2canvas(document.getElementById('cotizacion'), { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imgHeight = canvasHeight * pdfWidth / canvasWidth;

        if (imgHeight > pdfHeight) {
            const imgRatio = canvasHeight / canvasWidth;
            const newImgHeight = pdfHeight;
            const newImgWidth = newImgHeight / imgRatio;

            pdf.addImage(imgData, 'PNG', 0, 0, newImgWidth, newImgHeight);
        } else {
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        }

        pdf.save(`cotizacion_${new Date().toISOString().split('T')[0]}.pdf`);
    }).catch(error => {
        console.error("Error al generar PDF:", error);
    }).finally(() => {
        // Restaurar estilos originales después de generar el PDF
        document.body.style.zoom = "";  // Restaurar el zoom original
        document.body.style.width = "";  // Restaurar el ancho original
        document.body.style.margin = "";  // Restaurar el margen original

        // Volver a mostrar los botones después de guardar el PDF
        guardarPDFButton.style.display = 'block';
        imprimirButton.style.display = 'block';
    });
}

// Función para imprimir usando la ventana de impresión del navegador
function imprimirCotizacion() {
    window.print();  // Abre la ventana de impresión del navegador
}

// Asignar eventos a los botones
document.getElementById('imprimir-cotizacion').addEventListener('click', imprimirCotizacion);
document.getElementById('guardar-pdf').addEventListener('click', generarPDF);