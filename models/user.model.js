const { Schema, model } = require("mongoose");
const userSchema = new Schema({
	fullname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 4,
	},
});

const User = model("User", userSchema);
module.exports = User;
