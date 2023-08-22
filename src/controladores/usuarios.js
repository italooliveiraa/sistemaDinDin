const bcript = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../conexao')
require('dotenv').config()

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {

        const validaEmailExistente = await pool.query('select * from usuarios where email = $1', [email])

        if (validaEmailExistente.rowCount === 1) {
            return res.status(400).json({ "mensagem": "Email já cadastrado, revise suas informações!" })
        }

        const senhaCriptografada = await bcript.hash(senha, 10)

        const usuarioCadastrado = await pool.query('insert into usuarios (nome, email, senha) values ($1, $2, $3) RETURNING id, nome, email', [nome, email, senhaCriptografada])

        return res.status(201).json(usuarioCadastrado.rows[0])
    } catch (error) {
        return res.status(400).json({ "mensagem": "Falha ao cadastrar usuario!" })
    }
}

const fazerLogin = async (req, res) => {
    const { email, senha } = req.body

    if (!email) {
        return res.status(400).json({ "mensagem": "Informe o email" })
    }

    if (!senha) {
        return res.status(400).json({ "mensagem": "Informe a senha" })
    }

    try {
        const usuarioValido = await pool.query('select * from usuarios where email = $1', [email])

        if (usuarioValido.rowCount < 1) {
            return res.status(401).json({ "mensagem": "Email ou senha inválidos!" })
        }

        const senhaCorreta = await bcript.compare(senha, usuarioValido.rows[0].senha)

        if (!senhaCorreta) {
            return res.status(401).json({ "mensagem": "Email ou senha inválidos!" })
        }

        const token = jwt.sign({ id: usuarioValido.rows[0].id }, process.env.senhaSegura, { expiresIn: '2h' })

        const { senha: excluido, ...usuario } = usuarioValido.rows[0]

        return res.status(200).json({ usuario, token })
    } catch (error) {
        return res.status(400).json({ "mensagem": "Erro ao fazer login, verifique as informações inseridas!" })
    }
}

const detalharPerfilLogado = async (req, res) => {
    const idDoUsuarioLogado = req.usuarioId

    try {
        const usuarioLogado = await pool.query(`select * from usuarios where id = $1`, [idDoUsuarioLogado])

        if (usuarioLogado.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Usuário não existe!" })

        }
        const { senha: excluida, ...usuarioSemSenha } = usuarioLogado.rows[0]

        return res.status(200).json(usuarioSemSenha)
    } catch (error) {
        return res.status(401).json({ "mensagem": "Usuario não possui acesso!" })
    }
}

const editarPerfilLogado = async (req, res) => {
    const { nome, email, senha } = req.body
    const idDoUsuarioLogado = req.usuarioId

    try {
        const validaEmailExistente = await pool.query('select * from usuarios where email = $1', [email])

        if (validaEmailExistente.rowCount === 1) {
            return res.status(400).json({ "mensagem": "Email já cadastrado, revise suas informações!" })
        }

        const senhaCriptografada = await bcript.hash(senha, 10)

        await pool.query(`update usuarios set nome = $1, email = $2, senha = $3 where id = $4`, [nome, email, senhaCriptografada, idDoUsuarioLogado])

        return res.status(201).json()
    } catch (error) {
        return res.status(400).json({ "mensagem": "falha ao atualizar usuario!" })
    }
}

module.exports = {
    cadastrarUsuario,
    fazerLogin,
    detalharPerfilLogado,
    editarPerfilLogado
}