const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fetch = require('cross-fetch')
const cors = require('cors')

const { MongoURI } = require('./config/keys')
const router = require('./routes/router')

mongoose.connect(MongoURI, { useNewUrlParser: true, autoIndex: true })
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log(err))

const app = express()
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', router)

const PORT = 5000

app.listen(PORT, () => {console.log("Server Running on http://localhost:" + PORT)})