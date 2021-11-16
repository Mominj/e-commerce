function responseWithMessage(data, message) {
	let response = {};
	response.data = JSON.parse(JSON.stringify(data));
	response.message = message;
	return response;
}

module.exports = { responseWithMessage };
