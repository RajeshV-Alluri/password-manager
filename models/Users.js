const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema ({
	firstname: {type: String},
	lastname: {type: String},
	email: {type: String, unique: true},
	password: {type: String},
	mainKey: {type: String},
	verified: {type: Boolean, default: false},
	verificationToken: {type: String},
	active: {type: Boolean},
	store: {type: Array}
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users