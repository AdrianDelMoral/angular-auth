const { response } = require('express');
const jwt = require('jsonwebtoken');

// Validar y revalidar Token
const validarJWT = (req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Error en el Token'
        })
    }

    try {
        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no Válido'
        });

    }

    // TODO OK!
    next();


}

module.exports = {
    validarJWT
}