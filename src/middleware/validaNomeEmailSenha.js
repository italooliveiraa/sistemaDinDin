const validaNomeEmailSenha = (req, res, next) => {
    const { nome, email, senha } = req.body

    if (!nome) {
        return res.status(400).json({ "mensagem": "Informe o nome" })
    }

    if (!email) {
        return res.status(400).json({ "mensagem": "Informe o email" })
    }

    if (!senha) {
        return res.status(400).json({ "mensagem": "Informe a senha" })
    }
    next()
}

module.exports = validaNomeEmailSenha
