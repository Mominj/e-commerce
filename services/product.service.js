"use strict";
const Product = require("../models/products.model");
const { NotFound } = require("../utils/errors");

// const multer = require("multer");
// const upload = multer({ dest: '../public/uploads' });

module.exports = {
	name: "product",
	model: Product,
	settings: {},
	dependencies: [],
	actions: {
		create: {
			rest: {
				method: "POST",
				path: "/create",
			},
			params: {
				body: {
					type: "object",
					strict: true,
					props: {
						productName: { type: "string" },
						description: { type: "string" },
						price: { type: "number" },
						totalNumber: { type: "number" },
					},
				},
			},
			async handler(ctx) {
				let { productName, description, price, totalNumber } =
					ctx.params.body;

				let re = await this.schema.model.findOne({
					productName: productName,
				});
				if (!re) {
					let r = await this.schema.model.create({
						productName: productName,
						description: description,
						price: price,
						totalNumber: totalNumber,
					});
					return r;
				} else {
					return { status: "already have" };
				}
			},
		},
		showall: {
			rest: {
				method: "GET",
				path: "/showall",
			},
			async handler(ctx) {
				//const pageNumber = 2;
				const pageSize = 2;
				let r = await this.schema.model
					.find()
					// .skip((pageNumber - 1) * pageSize)
					.limit(pageSize)
					.select({ totalNumber: 1 });
				// .sort({totalNumber: 1})

				return r;
			},
		},
		show: {
			rest: {
				method: "GET",
				path: "/show/:id",
			},
			params: {
				params: {
					type: "object",
					strict: true,
					props: {
						id: { type: "string", optional: true },
					},
				},
			},
			async handler(ctx) {
				let q = ctx.params.params.id;
				let r = await this.schema.model.find({
					_id: ctx.params.params.id,
				});
				return r;
			},
		},
		update: {
			rest: {
				method: "PATCH",
				path: "/update/:id",
			},
			params: {
				params: {
					type: "object",
					strict: true,
					props: {
						id: { type: "string", optional: true },
					},
				},
				body: {
					type: "object",
					strict: true,
					props: {
						totalNumber: { type: "number" },
					},
				},
			},
			async handler(ctx) {
				let r = this.schema.model.findByIdAndUpdate(
					{ _id: ctx.params.params.id },
					ctx.params.body,
					{ new: true }
				);
				return r;
			},
		},
		delete: {
			rest: {
				method: "DELETE",
				path: "/delete/:id",
			},
			params: {
				params: {
					type: "object",
					strict: true,
					props: {
						id: { type: "string", optional: true },
					},
				},
			},
			async handler(ctx) {
				let r = await this.schema.model.findOneAndDelete({
					_id: ctx.params.params.id,
				});
				if(r){
					return { status: "item deleted successfully" };
				}else{
					return { status: "item not found" };
				}

				
			},
		},
	},

	events: {},
	methods: {
		// 	authcheck(ctx) {
		// 		let auth = ctx.meta.token;
		// 		try {
		// 			if (auth && auth.startsWith("Bearer")) {
		// 				let token = auth.slice(7);
		// 				const decoded = jwt.verify(
		// 					token,
		// 					process.env.ACCESS_TOKEN_SECRET
		// 				);
		// 				// Check the token
		// 				if (decoded) {
		//                     console.log("decoded ",decoded);
		// 					return true;
		// 				} else {
		// 					// Invalid token
		// 					return false;
		// 				}
		// 			} else {
		// 				// No token
		// 				return "no token found";
		// 			}
		// 		} catch (e) {
		// 			return "Unauthorized.";
		// 		}
		// 	},
	},
	created() {},
	async started() {},
	async stopped() {},
};
