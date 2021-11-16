const { Schema, model } = require("mongoose");

const collectionsSchema = new Schema({
	products: [
		{
			type: Schema.Types.ObjectId,
			ref: "Products",
		},
	],
	name: {
		type: String,
	},
	description: {
		type: String,
	},
});

const Collection = model("Collection", collectionsSchema);
module.exports = Collection;
