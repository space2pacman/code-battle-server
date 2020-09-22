let users = require("../models/Users");

function checkAccessLevel(level) {

	return async function(req, res, next) {
		let user = await users.getByField("login", res.locals.user.login);
		let answer = {
			status: null,
			error: null
		}

		if(user.accessLevel < level) {
			answer.status = "error";
			answer.error = "access closed";

			return res.send(403, answer);
		}

		next();
	}
}

module.exports = checkAccessLevel;