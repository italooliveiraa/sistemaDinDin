const express = require('express')
require('dotenv').config()

const app = express()

app.listen(process.env.porta);

module.exports = app