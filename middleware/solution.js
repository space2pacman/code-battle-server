let users = require("../models/Users");
let urls = require("../utils/urls");

function solution(req, res, next) {
	let user = users.getByLogin(res.locals.user.login);
	let id = Number(req.params.id);

	if(!user.tasks.solved.includes(id)) {
		let answer = {
			status: "error",
			error: "task is not solved",
			url: urls[req.route.path]
		}

		return res.send(403, answer);
	}

	next();
}

module.exports = solution;