const { check } = require('express-validator');
const { crearUsuario, loginUsuario, tokenValidator } = require('../controllers/auth');
const { Router } = require('express');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Definir rutas que vamos a utilizar

// Crear un nuevo usuario
router.post('/new', [
    check('name', 'La Nombre debe tener minimo 5 Cáracteres').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'La Contraseña debe tener minimo 6 Cáracteres').isLength({ min: 6 }),
    validarCampos
], crearUsuario);

// Login de usuario
router.post('/', [
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'La Contraseña debe tener minimo 6 Cáracteres').isLength({ min: 6 }),
    validarCampos
], loginUsuario);

// Validar y revalidar Token
router.get('/renew', validarJWT, tokenValidator);

module.exports = router;