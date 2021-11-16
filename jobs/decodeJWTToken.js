const jwt = require("jsonwebtoken");

module.exports = (token) => {
	try{
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		return decoded;
	} catch (error) {
		console.log("TCL: error", error);
	}
};

//authorization check
//authorization check means access ablity of a path check