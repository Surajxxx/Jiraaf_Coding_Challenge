const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const env = require('dotenv').config()
const route = require('./routes/route')

const app = express()

app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_DB_LINK, { useNewUrlParser: true })
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => console.log(err))


app.use('/', route)


app.listen(process.env.PORT, () => {
    console.log(`Express is running on port ${process.env.PORT}`)
})