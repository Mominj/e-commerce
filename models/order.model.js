const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
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
});

const orderSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	orderProducts: [itemSchema],
	quantity: {
		type: Number,
	},
	totalprice: {
		type: Number,
	},
});

const Order = model("Order", orderSchema);
module.exports = Order;
