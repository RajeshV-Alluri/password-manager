const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fetch = require('cross-fetch')
const cors = require('cors')
const bcrypt = require('bcrypt')

const { MongoURI } = require('./config/keys')
const Users = require('./models/Users')

mongoose.connect(MongoURI, { useNewUrlParser: true, autoIndex: true })
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log(err))

const app = express()
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/register', async (req, res) => {
	const {firstname, lastname, email, password} = req.body

	try {
		const hashPassword = await bcrypt.hash(password, 10)

		const newUser = new Users({ firstname, lastname, email, password: hashPassword });
		newUser.save((err, data) => {
			if (err && err.name === 'MongoServerError' && err.code === 11000) {
				return res.json({
					redirect: true,
					redirectTo: '/',
					message: "Email has already been taken"
				})
			} else if (err) {return console.log(err)}
			res.json(data.email)
		});
	}	catch{err => console.log(err)}
})

const PORT = 5000

app.listen(PORT, () => {console.log("Server Running on PORT " + PORT)})