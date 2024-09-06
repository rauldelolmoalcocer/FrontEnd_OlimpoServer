const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5000;

const panelsFilePath = path.join(__dirname, 'panels.json');

// Middleware para manejar JSON
app.use(express.json());

// Sirviendo archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal que envía el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para obtener los paneles guardados
app.get('/api/panels', (req, res) => {
    fs.readFile(panelsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al leer los paneles' });
        }

        const panels = data ? JSON.parse(data) : [];
        res.json(panels);
    });
});

// Ruta para agregar un nuevo panel
app.post('/api/panels', (req, res) => {
    const newPanel = req.body;

    fs.readFile(panelsFilePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error(err);
            return res.status(500).json({ message: 'Error al leer los paneles' });
        }

        const panels = data ? JSON.parse(data) : [];
        panels.push(newPanel);

        fs.writeFile(panelsFilePath, JSON.stringify(panels, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al guardar el panel' });
            }

            res.status(201).json(newPanel);
        });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
