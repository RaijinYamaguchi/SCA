const express = require('express');
const cors = require('cors');
require('dotenv').config();
const usuarioController = require('./controller/usuarioController');
const deviceController = require('./controller/deviceContoller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// Rutas para usuários
app.get('/usuarios', usuarioController.getAllUsuarios);
app.get('/usuarios/:id', usuarioController.getUsuarioById);
app.post('/usuarios', usuarioController.createUsuario);
app.put('/usuarios/:id', usuarioController.updateUsuario);
app.delete('/usuarios/:id', usuarioController.deleteUsuario);

// Rutas para dispositivos
app.get('/devices', deviceController.getAllDevices);
app.get('/devices/:id', deviceController.getDeviceById);
app.post('/devices', deviceController.createDevice);
app.put('/devices/:id', deviceController.updateDevice);
app.delete('/devices/:id', deviceController.deleteDevice);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
