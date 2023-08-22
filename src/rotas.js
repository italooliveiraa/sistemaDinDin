const { Router } = require('express')
const rotas = Router()
const { listarCategoria, detalharCategoriaUsuarioLogado, cadastrarCategoria, atualizarCategoriaUsuarioLogado, removerCategoriaUsuarioLogado } = require('./controladores/categorias')
const { listarTransacoes, detalharTransacoes, cadastrarTransacoes, editarTransacoes, obterExtratoTransacoes, removerTransacoes } = require('./controladores/transacoes')
const { cadastrarUsuario, fazerLogin, detalharPerfilLogado, editarPerfilLogado } = require('./controladores/usuarios')
const autenticador = require('./middleware/autenticacao')
const emailFormatado = require('./middleware/validaFormatoEmail')
const validaNomeEmailSenha = require('./middleware/validaNomeEmailSenha')


rotas.post('/usuario', validaNomeEmailSenha, emailFormatado, cadastrarUsuario)
rotas.post('/login', emailFormatado, fazerLogin)

rotas.use(autenticador)

rotas.get('/usuario', detalharPerfilLogado)
rotas.put('/usuario', validaNomeEmailSenha, emailFormatado, editarPerfilLogado)
rotas.get('/categoria', listarCategoria)
rotas.get('/categoria/:id', detalharCategoriaUsuarioLogado)
rotas.post('/categoria', cadastrarCategoria)
rotas.put('/categoria/:id', atualizarCategoriaUsuarioLogado)
rotas.delete('/categoria/:id', removerCategoriaUsuarioLogado)
rotas.get('/transacao', listarTransacoes)
rotas.get('/transacao/extrato', obterExtratoTransacoes)
rotas.get('/transacao/:id', detalharTransacoes)
rotas.post('/transacao', cadastrarTransacoes)
rotas.put('/transacao/:id', editarTransacoes)
rotas.delete('/transacao/:id', removerTransacoes)

module.exports = rotas