let mongoClient = require("./../utils/client");
let config = require("./../config");

module.exports = (async () => {
	let client = await mongoClient.connect();
	let db = await client.db(config.database);

	return db;
})()