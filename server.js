const express = require('express');
const path = require('path');
const app = express();

// Utiliza la variable de entorno PORT proporcionada por la plataforma o usa el puerto 3000 por defecto
const port = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Escuchar en el puerto asignado por el entorno
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
