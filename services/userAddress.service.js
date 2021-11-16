"use strict";
const Useraddress = require("../models/useraddress.model");
const jwt = require("jsonwebtoken");
const { NotFound } = require("../utils/errors");
module.exports = {
	name: "userAddress",
	model: Useraddress,
	settings: {},
	dependencies: [],
	actions: {
		address_create: {
			rest: {
				method: "POST",
				path: "/address_create",
			},
			params: {
				body: {
					type: "object",
					strict: true,
					props: {
						phone: { type: "number" },
						fulladdress: { type: "string" },
					},
				},
			},
			async handler(ctx) {
				let { phone, fulladdress } = ctx.params.body;

				const decoded = this.usercheck(ctx);
				if (decoded != false) {
					let user = await this.schema.model.findOne({
						user_id: decoded.id,
					});

					if (!user) {
						let r = await this.schema.model.create({
							user_id: decoded.id,
							phone: phone,
							fulladdress: fulladdress,
						});
						return { r, status: "address create succesfully" };
					} else {
						return { status: "user already have" };
					}
				} else {
					throw new NotFound();
				}
			},
		},
		show: {
			rest: {
				method: "GET",
				path: "/show",
			},

			async handler(ctx) {
				const address = await this.schema.model
					.findOne({
						_id: "612c7a46061f6034547d627c",
					})
					.populate("user_id");
				return address;
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
