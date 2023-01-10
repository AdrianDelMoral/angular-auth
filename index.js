const express = require('express');
const cors = require('cors');
const path = require('path');

const { dbConnection } = require('./db/config');
require('dotenv').config();

// Crear el Servidor / Aplicación de Express
const app = express();

// Base de Datos
dbConnection();

// Directorio Público
app.use(express.static('public'));

// CORS
app.use(cors());

// Lectura y Parse del Body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Levantar la aplicación de Express
// Utilizaremos esa aplicación 'app', que escuchará 'listen', en el puerto que indiquemos '(4000)'
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});