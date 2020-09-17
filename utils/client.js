let MongoCLient = require("mongodb").MongoClient;
let config = require("./../config");
let options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

module.exports = new MongoCLient(config.url, options);