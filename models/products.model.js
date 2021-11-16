const { Schema, model } = require("mongoose");
const productSchema = new Schema({
	productName: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	totalNumber: {
		type: Number,
		required: true,
	},
	avatar: {
		type: String,
	},

});

const Product = model("Product", productSchema);
module.exports = Product;
