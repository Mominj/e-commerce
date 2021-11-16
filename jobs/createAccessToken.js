const jwt = require("jsonwebtoken");

/**
 * returns the jwt token
 * 
 * @returns {string} the jwt token
 */
module.exports = (user) => {
	const token = jwt.sign(
		{
			id: user._id,
			email: user.email,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			//expiresIn:process.env.ACCESS_TOKEN_SECRET
			expiresIn: 60*60*60*24
		}
	);

	return token;
};

//token create