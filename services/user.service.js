"use strict";
const User = require("../models/user.model");
const { NotFound } = require("../utils/errors");
const bcrypt = require("bcrypt");
const createAccessToken = require("../jobs/createAccessToken");
const hashed = require("../jobs/hashPassword");
module.exports = {
	name: "user",
	model: User,
	settings: {},
	dependencies: [],
	actions: {
		signup: {
			rest: {
				method: "POST",
				path: "/signup",
			},
			params: {
				body: {
					type: "object",
					strict: true,
					props: {
						fullname: { type: "string" },
						email: { type: "string" },
						password: { type: "string", min: 4 },
					},
				},
			},
			async handler(ctx) {
				let { fullname, email, password } = ctx.params.body;

				let re = await this.schema.model.findOne({ email: email });
				if (!re) {
					let hasedpass = await hashed(password);
					let r = await this.schema.model.create({
						fullname: fullname,
						email: email,
						password: hasedpass,
					});
					console.log(fullname, email, password);
					return { r, status: "sign up succesfully" };
				} else {
					return { status: "already have" };
				}
			},
		},

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
						password: { type: "string", min: 4 },
					},
				},
			},
			async handler(ctx) {
				let { email, password } = ctx.params.body;

				let user = await this.schema.model.findOne({ email: email });
				if (user) {
					let match = await bcrypt.compare(password, user.password);
					if (match) {
						const token = createAccessToken(user);
						ctx.meta.$responseType = "text/csv";
						ctx.meta.$responseHeaders = {
							//"Content-Disposition": `attachment; filename="data-${token}.csv"`,
							"Content-Disposition": `Bearer ${token}`,
						};
						console.log("TOKENNNN", token);
						console.log("password match");

						return { status: "logged In", token };
					} else {
						throw new NotFound();
					}
				} else {
					return { status: "user not found " };
				}
			},
		},
		
	},

	events: {},
	methods: {},
	created() {},
	async started() {},
	async stopped() {},
};
