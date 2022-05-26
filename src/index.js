const express = require('express')
const bodyParser = require('body-parser')
const env = require('dotenv').config()
const route = require('./routes/route')

const app = express()

app.use(bodyParser.json())

app.use('/', route)


app.listen(process.env.PORT, () => {
    console.log(`Express is running on port ${process.env.PORT}`)
})