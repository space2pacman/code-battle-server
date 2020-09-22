let version = require("../utils/version").get();
let urls = {
	[`/${version}/api/solution/task/:id/`]: "solution/task",
	[`/${version}/api/solution/:id/`]: "solution",
	[`/${version}/api/task/test/`]: "task/test"
}

module.exports = urls;