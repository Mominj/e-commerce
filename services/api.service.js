"use strict";

const ApiGateway = require("moleculer-web");
const jwt             = require("jsonwebtoken");
const cookieParser    = require("cookie-parser");
const { MoleculerError } = require("moleculer").Errors;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	settings: {
	
		port: 4300,

		ip: "127.0.0.1",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [
			cookieParser(),
			// helmet()
		],

		// Global CORS settings
		cors: {
			origin: "*",
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
			allowedHeaders: "*",
			//exposedHeaders: "*",
			credentials: true,
			maxAge: null
		},
      
		routes: [
	
			{
				path: "/api",

				whitelist: [
					"**"
				],

				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: false,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: false,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {
					"showall": "product.showall",
				},

				/**
				 * Before call hook. You can check the request.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 **/
				onBeforeCall(ctx, route, req, res) {
					console.log("incoming--------------------------------------------------");
					console.log(req.headers.authorization);
					ctx.meta.token = req.headers.authorization;
				},

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: true,
						limit: "5MB"
					},
					urlencoded: {
						extended: true,
						limit: "5MB"
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				//mappingPolicy: "all", // Available values: "all", "restrict"
				mappingPolicy: "restrict",
				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,


		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}
	},

	methods: {

		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			// let auth = req.headers["authorization"];

			// try {
			// 	if (auth && auth.startsWith("Bearer")) {
			// 		let token = auth.slice(7);
			// 		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			// 		// Check the token
			// 		if (decoded) {
			// 			// Set the authorized user entity to `ctx.meta`
			// 			ctx.meta.user = decoded;
			// 			ctx.meta.token = auth;
			// 			return Promise.resolve(ctx);

			// 		} else {
			// 			// Invalid token
			// 			return Promise.reject(new MoleculerError("Unauthorized.", 401));
			// 		}

			// 	} else {
			// 		// No token
			// 		return Promise.reject(new MoleculerError("No Bearer token found.", 401));
			// 	}
			// } catch(e) {
			// 	return Promise.reject(new MoleculerError("Unauthorized.", 401));
			// }
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			// Read the token from header
			let auth = req.headers["authorization"];

			try {
				if (auth && auth.startsWith("Bearer")) {
					let token = auth.slice(7);
					const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
					// Check the token
					if (decoded) {
						// Set the authorized user entity to `ctx.meta`
						ctx.meta.user = decoded;
						ctx.meta.token = auth;
						return Promise.resolve(ctx);

					} else {
						// Invalid token
						return Promise.reject(new MoleculerError("Unauthorized.", 401));
					}

				} else {
					// No token
					return Promise.reject(new MoleculerError("No Bearer token found.", 401));
				}
			} catch(e) {
				return Promise.reject(new MoleculerError("Unauthorized.", 401));
			}
		}

	}
};
