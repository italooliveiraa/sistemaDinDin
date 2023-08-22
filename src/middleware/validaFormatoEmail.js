const validaFormatoEmail = require('email-validator')

const emailFormatado = async (req, res, next) => {
    const { email } = req.body
    const emailCorreto = validaFormatoEmail.validate(email)

    if (!emailCorreto) {
        return res.status(400).json({ "mensagem": "Email inválido, verifique se foi informado corretamente!" })
    }
    next()
}

module.exports = emailFormatado;