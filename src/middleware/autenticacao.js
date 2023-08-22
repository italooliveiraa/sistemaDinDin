const jwt = require('jsonwebtoken')
require('dotenv').config()

const autenticador = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ "mensagem": "Não autorizado!" })
    }

    const token = authorization.split(' ')[1]

    try {

        const tokenUsuario = await jwt.verify(token, process.env.senhaSegura)

        req.usuarioId = tokenUsuario.id

        next()
    } catch (error) {
        return res.status(400).json({ "mensagem": "Erro ao autenticar!" })
    }
}

module.exports = autenticador;