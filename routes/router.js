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
	const {firstname, lastname, password, verificationToken} = req.body
	let {email} = req.body
	email = email.toLowerCase()

	try {
		const hashPassword = await bcrypt.hash(password, 10)

		const newUser = new Users({ firstname, lastname, email, password: hashPassword, verificationToken: v4(), passwordChangeToken: v4() });
		newUser.save(async (err, data) => {			
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
				template: 'verifyEmail',
				context: {
				 firstname,
				 lastname,
				 email,
				 verificationToken
				}
			});

			return res.status(200).redirect(`http://localhost:3000/verification/verify/${data.verificationToken}`)
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
				template: 'verifyEmail',
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
	let {emailId} = req.params
	emailId = emailId.toLowerCase()

	Users.findOne({"email": emailId}, (err, data) => {
		if (err) return console.log(err)
		else if (data) return res.json({validEmail: false})
		else return res.json({validEmail: true})
	})
})

// Check if login credentials are true or not
router.post('/valid-login', async (req, res) => {
	const {loginEmail, loginPassword} = req.body

	try {
		Users.findOne({email: loginEmail}, async (err, data) => {
			if (err) return console.log(err)

			if(!data) {
				return res.json({loginCredentials: false})
			} else {
				const hashPassword = data.password
				if (await bcrypt.compare(loginPassword, hashPassword)) {
					return res.json({loginCredentials: true})
				} else {
					res.json({loginCredentials: false})
				}
			}
		})
	} catch {
		err => console.log(err)
	}
})

// UPDATE THIS
router.post('/login', (req, res) => {
	const {email, password} = req.body

	
})

router.get('/forgot-password/send-mail/:mailId', (req, res) => {
	let {mailId} = req.params
	mailId = mailId.toLowerCase()

	Users.findOne({email: mailId}, async (err, data) => {
		if (err) return console.log(err)

		const {firstname, lastname, email, passwordChangeToken} = data

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
			subject: "Change Password",
			template: 'forgotPassword',
			context: {
				firstname,
				lastname,
				email,
				passwordChangeToken
			}
		})

		Users.findOneAndUpdate({email}, {passwordChangeToken: v4(), prevPasswordChangeToken: passwordChangeToken}, {new: true}, (err, data) => {
			if (err) return console.log(err)
		})
	})
})

router.post('/change-password/:passwordChangeToken', (req, res) => {
	const {password} = req.body;
	const {passwordChangeToken} = req.params;

	Users.findOne({prevPasswordChangeToken: passwordChangeToken}, async (err, data) => {
		if(err) return console.log(err)
		else if (!data) {
			return res.redirect('http://localhost:3000/error404')
		}
		else {
			try{
				const hashPassword = await bcrypt.hash(password, 10)

				Users.findOneAndUpdate(
					{prevPasswordChangeToken: passwordChangeToken},
					{password: hashPassword, prevPasswordChangeToken: ''},
					{new: true},
					(err, data) => {
						return res.redirect('http://localhost:3000')
					}
				)
			} catch {err => console.log(err)}
		}
	})
})

module.exports = router