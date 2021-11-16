const { Schema, model } = require("mongoose");
const userAddressSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	phone: {
		type: Number,
		required: true,
		unique: true,
		minlength: 10
	},
	fulladdress: {
		type: String,
		required: true,
	},
	
});

const Useraddress = model("Useraddress", userAddressSchema);
module.exports = Useraddress;
