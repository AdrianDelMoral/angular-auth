const { response } = require('express');
const Usuario = require('../models/Usuario'); // Usuario que proviene del modelo creado
const bcrypt = require('bcryptjs'); // Paquete para encriptar contraseñas
const { generarJWT } = require('../helpers/jwt');

// Crear un nuevo usuario
const crearUsuario = async (req, res = response) => {

    // Como pusimos como obligatorio algunos campos, hay que validarlos y hacer validaciones de mongo
    // Tenemos estos datos, que vienen de la reques.body, y sabemos que lo hemos puesto, porque lo verificamos con el "request.validator"
    const { email, name, password } = req.body;

    try {
        // Verificar el Email
        const usuario = await Usuario.findOne({ email }); // buscará alguien cuyo email, que recibimos como argumento

        // Si encuentra un usuario que exista con ese correo:
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Crear Usuario con el Modelo
        const dbUser = new Usuario(req.body);

        // Hashear la Contraseña
        const salt = bcrypt.genSaltSync(); // Si quisiesemos que encriptase la contraseña X numero de veces para que fuese más compleja, ponriamos dentro de la funcion genSaltSync un numero.
        dbUser.password = bcrypt.hashSync(password, salt);

        // Generar el Jason Web Token(JWT)
        const token = await generarJWT(dbUser.id, name);

        // Crear Usuario en la Base de Datos
        await dbUser.save();

        // Generar respuesta Exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
        });


        // Si algun paso da error, cortamos la respuesta de res.json, y la pondremos con (status.500)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Porfavor Hable con el Administrador'
        });
    }


};

// Login de usuario
const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });

        // Verificar si existe o no el usuario:
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El Correo no Existe'
            });
        }

        // Si llega a aquí el email, existe pero no hemos comprobado la contraseña

        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El Password no es Válido'
            });
        }

        // En caso de que el email y contraseña coincidan:
        // Generar JsonWebToken(JWT)
        const token = await generarJWT(dbUser.id, dbUser.name);

        // Respuesta del Servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });
    }
}

// Validar y revalidar Token
const tokenValidator = async (req, res = response) => {

    const { uid } = req;

    // Leer la Base de datos:
    const dbUser = await Usuario.findById(uid);

    // Generar un JWT
    const token = await generarJWT(uid, dbUser.name);

    return res.json({
        ok: true,
        uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });

}

// Exportar para usar en otro archivo
module.exports = {
    crearUsuario,
    loginUsuario,
    tokenValidator
}