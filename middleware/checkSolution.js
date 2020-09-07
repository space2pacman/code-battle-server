let users = require("../models/Users");
let solutions = require("../models/Solutions");
let urls = require("../utils/urls");

function checkSolution(req, res, next) {
	let user = users.getByField("login", res.locals.user.login);
	let url = urls[req.route.path];
	let id;
	let solution;
	let answer = {
		status: null,
		error: null,
		url
	}

	switch(url) {
		case "solution":
			solution = solutions.getById(req.params.id);

			if(!solution) {
				answer.status = "error";
				answer.error = "solution not found";

				return res.send(401, answer);
			} else {
				id = solution.task;
			}

			break;
		case "solution/task":
			id = Number(req.params.id);

			break;
	}

	if(!user.tasks.solved.includes(id)) {
		answer.status = "error";
		answer.error = "task is not solved";

		return res.send(403, answer);
	}

	next();
}

module.exports = checkSolution;