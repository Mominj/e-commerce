const bcrypt = require("bcrypt");

module.exports = async (userPsw, dbPsw) => {
	const ret = await new Promise((resolve, reject) => {
		bcrypt.compare(userPsw, dbPsw, function(err, result) {
			if (err) reject(err);
			resolve(result);
		});
	});

	return ret;
};