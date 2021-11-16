const mongoose = require("mongoose");
//let cs = "mongodb://momin:password@localhost:4300/molecular";
let connectionString = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

mongoose.Promise = Promise;
	
mongoose.connection.on("connected", () => {
	console.log("Connection Established");
});
	
mongoose.connection.on("reconnected", () => {
	console.log("Connection Reestablished");
});
	
mongoose.connection.on("disconnected", () => {
	console.log("Connection Disconnected");
});
	
mongoose.connection.on("close", () => {
	console.log("Connection Closed");
});
	
mongoose.connection.on("error", (error) => {
	console.log("ERROR: " + error);
});
//"mongodb://localhost:27017/molecular"	
const run = async () => {
	await mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
		// autoReconnect: true,
		// reconnectTries: 1000000,
		// reconnectInterval: 3000
	});
};

const close = async () => {
	await mongoose.connection.close();
};
	
// run().catch(error => console.error(error));

module.exports = { connect: run, close: close };
