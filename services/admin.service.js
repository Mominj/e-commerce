"use strict";
const Admin = require("../models/admin.model");
const Product = require("../models/products.model");
const createAccessToken = require("../jobs/createAccessToken");
const jwt = require("jsonwebtoken");
const hashed = require("../jobs/hashPassword");
const bcrypt = require("bcrypt");

const { NotFound } = require("../utils/errors");

module.exports = {
	name: "admin",
	model: Admin,
	settings: {},
	dependencies: [],
	actions: {
		login: {
			rest: {
				method: "POST",
				path: "/login",
			},
			params: {
				body: {
					type: "object",
					strict: true,
					props: {
						email: { type: "string" },
						password: { type: "string" },
					},
				},
			},
			async handler(ctx) {
				// console.log("TOKENNNN",ctx );
				let { email, password } = ctx.params.body;

				let user = await this.schema.model.findOne({ email: email });
				if (user) {
					//let match = await bcrypt.compare(password, user.password);
					if (user.password == password) {
						const token = createAccessToken(user);

						ctx.meta.$responseType = "text/csv";
						ctx.meta.$responseHeaders = {
							//"Content-Disposition": `attachment; filename="data-${token}.csv"`,
							"Content-Disposition": `Bearer ${token}`,
						};
						console.log("TOKENNNN", token);
						console.log("password match");

						return { status: "logged In", token ,user};
					}else {
						throw new NotFound();
					}
				} else {
					return { status: "user not found " };
				}
			},
		},
		// create: { 
		// 	rest: {
		// 		method: "POST",
		// 		path: "/create",
		// 	},
		// 	params: {
		// 		body: {
		// 			type: "object",
		// 			strict: true,
		// 			// props: {
		// 			// 	email: { type: "string"},
		// 			// 	password: { type: "string", min: 4 },
		//             //     roles: { type: "string"}
		// 			// },
		// 		},
		// 	},
		// 	async handler(ctx) {
		// 		let { email, password ,roles} = ctx.params.body;

		// 		let re = await this.schema.model.findOne({ email: email });
		// 		if (!re) {
		// 			let hasedpass = await hashed(password);
		// 			let r = await this.schema.model.create({
		// 				email: email,
		// 				password: hasedpass,
		//                 roles: roles
		// 			});
		// 			console.log(email, password,roles);
		// 			return r;
		// 		} else {
		// 			return { status: "already have" };
		// 		}
		// 	},
		// },
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
