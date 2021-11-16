"use strict";
const order = require("../models/order.model");
const jwt = require("jsonwebtoken");
const { NotFound } = require("../utils/errors");
module.exports = {
	name: "order",
	model: order,
	settings: {},
	dependencies: [],
	actions: {
		store: {
			rest: {
				method: "POST",
				path: "/store",
			},
			// params: {
			// 	body: {
			// 		type: "object",
			// 		strict: true,
			// 		props: {
			// 			// productName: { type: "string" },
			// 			// description: { type: "string" },
			// 			// price: { type: "string" },
			// 			// totalNumber: { type: "string" },
			// 			// quantity: { type: "number" },
			// 			// totalprice: { type: "number" },
			// 			productid: { type: "string" },
			// 			quantity: { type: "number" },
			// 		},
			// 	},
			// },
			async handler(ctx) {
				const ress = ctx.params.body;
				const len = ress.products.length;
				console.log(ress.products);
				//let p = await this.broker.call("product.show", {params: { id: ctx.params.body.products},});
				const decoded = this.usercheck(ctx);
				let totalquantity = 0;
				let totalprice = 0;
				for (let i = 0; i < len; i++) {
					totalprice =
						totalprice +
						ress.products[i].price * ress.products[i].totalNumber;
					totalquantity =
						totalquantity + ress.products[i].totalNumber;
				}

				if (decoded != false) {
					let order = {
						user_id: decoded.id,
						orderProducts:ress.products,
						totalquantity: totalquantity,
						totalprice: totalprice
					};
					console.log(order);
					let r = await this.schema.model.create(order);
					return { status: "order create succesfully", r };
				} else {
					//return { status: "user not found" };
					throw new NotFound();
				}
			},
		},
	},

	events: {},
	methods: {
		usercheck(ctx) {
			let auth = ctx.meta.token;
			try {
				if (auth && auth.startsWith("Bearer")) {
					let token = auth.slice(7);
					const decoded = jwt.verify(
						token,
						process.env.ACCESS_TOKEN_SECRET
					);
					// Check the token
					if (decoded) {
						console.log("decoded ", decoded);
						return decoded;
					} else {
						// Invalid token
						return false;
					}
				} else {
					// No token
					return "no token found";
				}
			} catch (e) {
				return "Unauthorized.";
			}
		},
	},
	created() {},
	async started() {},
	async stopped() {},
};
