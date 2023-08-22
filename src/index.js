const express = require('express')
const app = require('./servidor')
const rotas = require('./rotas')
require('dotenv').config()

app.use(express.json())

app.use(rotas)