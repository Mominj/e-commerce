const useragent = require("useragent");

/**
 * Create user information object
 *
 * @param {Object} agent
 * @param {Object} ip req.connection 
 */
module.exports = (agent, ip) => {
	agent = useragent.parse(agent);
	const browser = agent.toAgent();
	const os = agent.os.toString();
	const device = agent.device.toString();

	const obj = {
		device: device,
		os: os,
		browser: browser,
		time: Date.now(),
		ip: ip
	};

	return obj;
};