const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema ({
	firstname: {type: String},
	lastname: {type: String},
	email: {type: String, unique: true},
	password: {type: String},
	verified: {type: Boolean, default: false},
	verificationToken: {type: String},
	prevPasswordChangeToken: {type: String},
	passwordChangeToken : {type: String},
	store: {type: Array}
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users