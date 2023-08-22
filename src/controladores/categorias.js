const pool = require('../conexao')

const listarCategoria = async (req, res) => {
    const idDoUsuarioLogado = req.usuarioId

    try {
        const categoriaUsuariologado = await pool.query(`select * from categorias where usuario_id = $1`, [idDoUsuarioLogado])

        return res.status(200).json(categoriaUsuariologado.rows)
    } catch (error) {
        return res.status(400).json({ "mensagem": "Erro ao listar categoria!" })
    }
}

const detalharCategoriaUsuarioLogado = async (req, res) => {
    const { id } = req.params;
    const idDoUsuarioLogado = req.usuarioId;

    try {
        const idInformadoNaRota = await pool.query(`select * from categorias where id = $1`, [id])

        if (idInformadoNaRota.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Não existe categoria para o id informado!" })
        }

        if (idDoUsuarioLogado !== idInformadoNaRota.rows[0].usuario_id) {
            return res.status(400).json({ "mensagem": "Categoria encontrada não pertence ao usuário logado!" })
        }
        return res.status(200).json(idInformadoNaRota.rows[0])
    } catch (error) {
        return res.status(400).json({ "mensagem": "Erro ao buscar categoria, tente novamente!" })
    }
}

const cadastrarCategoria = async (req, res) => {
    const { descricao } = req.body
    const idDoUsuarioLogado = req.usuarioId

    if (!descricao) {
        return res.status(404).json({ "mensagem": "Informe a descrição!" })
    }

    try {
        const cadastrarDescricao = await pool.query(`insert into categorias (descricao, usuario_id) values ($1, $2) RETURNING id, descricao, usuario_id`, [descricao, idDoUsuarioLogado])

        return res.status(201).json(cadastrarDescricao.rows[0]) //falar com viteira sobre o retorno em modo obj ou array
    } catch (error) {
        return res.status(400).json({ "mensagem": "Erro ao cadastrar!" })
    }
}

const atualizarCategoriaUsuarioLogado = async (req, res) => {
    const { descricao } = req.body
    const { id } = req.params
    const idDoUsuarioLogado = req.usuarioId

    if (!descricao) {
        return res.status(404).json({ "mensagem": "Informe a descrição!" })
    }

    try {
        const idInformadoNaRota = await pool.query(`select * from categorias where id = $1`, [id])

        if (idInformadoNaRota.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Categoria não encontrada!" })
        }

        if (idDoUsuarioLogado !== idInformadoNaRota.rows[0].usuario_id) {
            return res.status(400).json({ "mensagem": "Erro ao buscar categoria do usuário logado!" })
        } // perguntar sobre essa validacao

        await pool.query(`update categorias set descricao = $1 where id = $2`, [descricao, id])

        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ "mensagem": "Erro ao atualizar as informações!" })
    }
}

const removerCategoriaUsuarioLogado = async (req, res) => {
    const { id } = req.params
    const idDoUsuarioLogado = req.usuarioId

    try {
        const idInformadoNaRota = await pool.query(`select * from categorias where id = $1`, [id])

        if (idInformadoNaRota.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Categoria não encontrada!" })
        }

        if (idDoUsuarioLogado !== idInformadoNaRota.rows[0].usuario_id) {
            return res.status(400).json({ "mensagem": "Erro ao buscar categoria do usuário logado!" })
        }

        const transacaoRelacionadaAoIdcategoria = await pool.query(`select * from transacoes where id = $1`, [id])

        if (transacaoRelacionadaAoIdcategoria.rowCount > 0) {
            return res.status(401).json({ "mensagem": "Não é permitido excluir essa categoria!" })
        }

        await pool.query(`delete from categorias where id = $1`, [id])

        return res.status(200).json()
    } catch (error) {
        return res.status(400).json({ "mensagem": "Erro ao excluir categoria!" })
    }
}

module.exports = {
    listarCategoria,
    detalharCategoriaUsuarioLogado,
    cadastrarCategoria,
    atualizarCategoriaUsuarioLogado,
    removerCategoriaUsuarioLogado
}
