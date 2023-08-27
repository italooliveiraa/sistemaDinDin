const pool = require('../conexao')

const listarTransacoes = async (req, res) => {
    const idDoUsuarioLogado = req.usuarioId
    const { filtro } = req.query

    try {
        const transacaoDoUsuario = await pool.query(`select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, c.usuario_id as categoria_id, c.descricao as categoria_nome from
        transacoes t left join categorias c on (t.categoria_id = c.id) where t.usuario_id = $1`, [idDoUsuarioLogado])

        if (!filtro) {
            return res.status(200).json(transacaoDoUsuario.rows)
        }
        let transacoesFiltradas = [];
        let retorno = []
        for (let index of filtro) {
            transacoesFiltradas = transacaoDoUsuario.rows.filter(elemento => elemento.categoria_nome === index);

            retorno = retorno.concat(transacoesFiltradas)
        }

        return res.status(200).json(retorno)

    } catch (error) {
        return res.status(404).json({ "mensagem": "Não há transações!" })
    }
}

const detalharTransacoes = async (req, res) => {
    const { id } = req.params
    const idDoUsuarioLogado = req.usuarioId
    try {
        const idDetalharTransacao = await pool.query(`select * from transacoes where id = $1 and usuario_id = $2`, [id, idDoUsuarioLogado])

        if (idDetalharTransacao.rowCount === 0) {
            return res.status(404).json({ "mensagem": "transação não encontrada!" })
        }

        const transacaoDoUsuario = await pool.query(`select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, c.usuario_id as categoria_id, c.descricao as categoria_nome from
        transacoes t left join categorias c on (t.categoria_id = c.id) where t.id = $1`, [id])

        return res.status(200).json(transacaoDoUsuario.rows[0])

    } catch (error) {
        return res.status(404).json({ "mensagem": "Erro ao buscar transação!" })
    }
}

const cadastrarTransacoes = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body
    const idDoUsuarioLogado = req.usuarioId

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ "mensagem": "Informe os campos obrigatórios" })
    }

    try {
        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(404).json({ "mensagem": "Tipo incorreto" })
        }

        const validarCategoriaId = await pool.query(`select * from categorias where id = $1 and usuario_id = $2`, [categoria_id, idDoUsuarioLogado])

        if (validarCategoriaId.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Não existe categoria relacionada a transação!" })
        }

        const { rows } = await pool.query(`insert into transacoes (tipo, descricao, valor, data, categoria_id, usuario_id)
        values ($1, $2, $3, $4, $5, $6) returning *`, [tipo, descricao, valor, data, categoria_id, idDoUsuarioLogado])

        const ultimoId = rows[rows.length - 1].id;

        const transacaoCadastrada = await pool.query(`select t.id, t.tipo, t.descricao, t.valor,
        t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t 
        left join categorias c on (t.categoria_id = c.id) where t.id = $1`, [ultimoId])

        if (transacaoCadastrada.rowCount < 1) {
            return res.status(404).json({ "mensagem": "Erro ao cadastrar" })
        }
        return res.status(200).json(transacaoCadastrada.rows[0])
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro servidor" })
    }
}

const editarTransacoes = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id } = req.params
    const idDoUsuarioLogado = req.usuarioId

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ "mensagem": "Todas as informações devem ser inseridas!" })
    }

    if (tipo !== "entrada" && tipo !== "saida") {
        return res.status(400).json({ "mensagem": "Informe o tipo correto" })
    }

    try {
        const validarCategoriaId = await pool.query(`select * from categorias where id = $1 and usuario_id = $2`, [categoria_id, idDoUsuarioLogado])
        const validaTransacoesId = await pool.query(`select * from transacoes where id = $1`, [id])

        if (validaTransacoesId.rowCount < 1) {
            return res.status(400).json({ "mensagem": "Não existe transações relacionada ao id informado" })
        }


        if (validarCategoriaId.rowCount < 1) {
            return res.status(400).json({ "mensagem": "Não existe categoria relacionada ao id informado" })
        }

        await pool.query(`update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6`, [descricao, valor, data, categoria_id, tipo, id])

        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro do servidor!" })
    }
}

const removerTransacoes = async (req, res) => {
    const { id } = req.params
    const idDoUsuarioLogado = req.usuarioId

    try {
        const idRemoverTransacao = await pool.query(`select * from transacoes where id = $1 and usuario_id = $2`, [id, idDoUsuarioLogado])

        if (idRemoverTransacao.rowCount === 0) {
            return res.status(404).json({ "mensagem": "Não existe transação para excluir, verifique se o id corresponde a transação que deseja excluir!" })
        }

        await pool.query(`delete from transacoes where id = $1`, [id])

        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ "mensagem": "erro interno do servidor" })
    }
}

const obterExtratoTransacoes = async (req, res) => {
    const idDoUsuarioLogado = req.usuarioId

    try {
        const ObterExtratoUsuarioLogado = await pool.query(`select * from transacoes where usuario_id = $1`, [idDoUsuarioLogado])

        if (ObterExtratoUsuarioLogado.rowCount === 0) {
            return res.status(404).json({ "mensagem": "usuario logado nao tem permissao" })
        }

        let somaDosValoresEntrada = 0;
        let somaDosValoresSaida = 0;

        for (const elemento of ObterExtratoUsuarioLogado.rows) {
            if (elemento.tipo === 'entrada') {
                somaDosValoresEntrada += elemento.valor
            } else {
                somaDosValoresSaida += elemento.valor
            }
        }

        return res.status(200).json({
            entrada: somaDosValoresEntrada,
            saida: somaDosValoresSaida
        })
    } catch (error) {
        return res.status(500).json({ "mensagem": "Erro servidor" })
    }
}

module.exports = {
    listarTransacoes,
    detalharTransacoes,
    cadastrarTransacoes,
    editarTransacoes,
    removerTransacoes,
    obterExtratoTransacoes
}