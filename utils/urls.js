let version = require("../utils/version").api();
let urls = {
	[`/api/${version}/solution/task/:id/`]: "solution/task",
	[`/api/${version}/solution/:id/`]: "solution",
	[`/api/${version}/task/test/`]: "task/test"
}

module.exports = urls;