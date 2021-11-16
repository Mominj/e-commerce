"use strict";
const Collection = require("../models/colletion.model");
const jwt = require("jsonwebtoken");
const { NotFound } = require("../utils/errors");
module.exports = {
	name: "collection",
	model: Collection,
	settings: {},
	dependencies: [],
	actions: {
		create: {
			rest: {
				method: "POST",
				path: "/create",
			},
			async handler(ctx) {
				const ress = ctx.params.body;
				const r = await this.schema.model.create({
					products: ress.products,
					name: ress.name,
					description: ress.description,
				});
	
				return {r, status: " create successfully"};
			},
		},
	},

	events: {},
	methods: {},
	created() {},
	async started() {},
	async stopped() {},
};
