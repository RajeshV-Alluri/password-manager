const express = require('express')
const router = express.Router()
const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const bcrypt = require('bcrypt')
const { v4 } = require('uuid');
const cors = require('cors')

const Users = require('../models/Users')
const { AuthUser, AuthPass } = require('../config/keys')

// router.use(cors({
// 	origin: 'http://localhost:3000',
// 	credentials: true
// }));


router.post('/register', async (req, res) => {
	const {firstname, lastname, email, password, verificationToken} = req.body

	try {
		const hashPassword = await bcrypt.hash(password, 10)

		const newUser = new Users({ firstname, lastname, email, password: hashPassword, verificationToken: v4() });
		newUser.save(async (err, data) => {
			// if (err && err.name === 'MongoServerError' && err.code === 11000) {
			// 	return res.redirect('http://localhost:3000')
			// } 
			
			if (err) {return console.log(err)}

			let transporter = await nodemailer.createTransport({
				service: "Gmail",
				auth: {
						user: AuthUser,
						pass: AuthPass
				},
				tls: {
					rejectUnauthorized: false
				}
			});
	
			transporter.use("compile",hbs({
				viewEngine:{
					partialsDir:"./views/",
					defaultLayout:""
				},
				viewPath:"./views/",
				extName:".handlebars"
			}))
		
			let info = await transporter.sendMail({
				from: '"Password Manager" <rajesharv04@gmail.com>',
				to: email,
				subject: "Please verify your email address",
				template: 'index',
				context: {
				 firstname,
				 lastname,
				 email,
				 verificationToken
				}
			});

			return res.status(200).redirect(`http://localhost:3000/verification/${data.verificationToken}`)
		});
	}
	
	catch{err => console.log(err)}
})

router.get('/verification/verify/:id', (req, res) => {
	const verificationToken = req.params.id

	Users.findOne({verificationToken}, (err, data) => {
		if (err) return console.log(err)
		
		if (data === null){
			return res.status(404).redirect('http://localhost:3000/error404')
		}

		else if (data.verified === true) {
			return res.redirect('http://localhost:3000/')
		}

		else {
			Users.findOneAndUpdate(
				{"verificationToken": verificationToken},
				{verified: true},
				{new: true},
				(err, data) => {
					if (err) return console.log(err)
					res.status(201).redirect('http://localhost:3000')
				}
			)
		}
	})
})

router.get('/verification/resend-email/:verificationToken', (req, res) => {
	const {verificationToken} = req.params

	Users.findOne({verificationToken}, async(err, data) => {
		if (err) return console.log(err)

		const {firstname, lastname, email, verificationToken} = data

		if (data.verified === false) {
			let transporter = await nodemailer.createTransport({
				service: "Gmail",
				auth: {
						user: AuthUser,
						pass: AuthPass
				},
				tls: {
					rejectUnauthorized: false
				}
			});
		
			transporter.use("compile",hbs({
				viewEngine:{
					partialsDir:"./views/",
					defaultLayout:""
				},
				viewPath:"./views/",
				extName:".handlebars"
			}))
		
			let info = await transporter.sendMail({
				from: '"Password Manager" <rajesharv04@gmail.com>',
				to: email,
				subject: "Please verify your email address",
				template: 'index',
				context: {
					firstname,
					lastname,
					email,
					verificationToken
				}
			})
		
			// console.log("Message sent: %s", info.messageId);
		} 
		else {
			return res.json({verified: true})
		}
	})
})

// Check if email has been taken while registration
router.get('/valid-email/:emailId', (req, res) => {
	const {emailId} = req.params

	Users.findOne({"email": emailId}, (err, data) => {
		if (err) return console.log(err)
		else if (data) return res.json({validEmail: false})
		else return res.json({validEmail: true})
	})
})

module.exports = router