const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { MongoURI } = require('./config/keys')

const app = express()

mongoose.connect(MongoURI, { useNewUrlParser: true })
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log(err))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = 5000

app.listen(PORT, () => {console.log("Server Running on PORT " + PORT)})