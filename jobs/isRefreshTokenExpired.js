module.exports = (mongodbId) => {
	const refreshTokenCreatedTime = Date.parse(mongodbId.getTimestamp());
	const currentTime = new Date();
	const diff = currentTime - refreshTokenCreatedTime;

	if(diff > parseInt(process.env.REFRESH_TOKEN_LIFE)) return true;
	return false;
};