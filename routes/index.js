let tasks = require("../models/Tasks");
let solutions = require("../models/Solutions");
let users = require("../models/Users");
let jwt = require("jsonwebtoken");
let log = console.log; // fix

module.exports = {
	get: {
		home(request, response) {
			response.send("home page");
		},
		task: {
			getAll(request, response) {
				let answer = {
					status: "success",
					url: "tasks",
					data: tasks.getAll(),
					error: null
				}

				response.send(answer);
			},
			getById(request, response) {
				let id = request.params.id;
				let answer = {
					status: null,
					url: "task",
					data: null,
					error: null
				}
				let task = tasks.getById(id);

				if(task) {
					answer.status = "success";
					answer.data = task;
				} else {
					answer.status = "error";
					answer.error = "task not found";
				}

				response.send(answer);
			}
		},
		profile: {
			getByLogin(request, response) {
				let login = request.params.login;
				let answer = {
					status: null,
					url: "profile",
					data: null,
					error: null
				}
				let profile = users.getByLogin(login);

				if(profile) {
					answer.status = "success";
					answer.data = profile;
				} else {
					answer.status = "error";
					answer.error = "user not found";
				}

				response.send(answer);
			},
			tasks(request, response) {
				let login = request.params.login;
				let answer = {
					status: null,
					url: "profile/tasks",
					data: null,
					error: null
				}
				let user = users.getByLogin(login);

				if(user && user.tasks.solved.length > 0) {
					let data = [];

					user.tasks.solved.forEach(id => {
						data.push(tasks.getById(id));
					});
					answer.data = data;
					answer.status = "success";
				} else {
					answer.status = "error";
					answer.error = "tasks not found";
				}

				response.send(answer);
			}
		},
		solution: {
			getById(request, response) {
				let id = request.params.id;
				let answer = {
					status: null,
					url: "solution",
					data: null,
					error: null
				}

				let solution = solutions.getById(id);

				if(solution) {
					answer.data = solution;
					answer.status = "success";
				} else {
					answer.status = "error";
					answer.error = "solution not found";
				}

				response.send(answer)
			},
			getByTaskId(request, response) {
				let id = request.params.id;
				let answer = {
					status: null,
					url: "solution/task",
					data: null,
					error: null
				}

				let data = solutions.getByTaskId(id);

				if(data.length === 0) {
					answer.status = "error";
					answer.error = "solution not found";
					answer.data = null;
				} else {
					answer.status = "success";
					answer.data = data;
				}

				response.send(answer)
			}
		}
	},
	post: {
		task: {
			test(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let code = request.body.code;
				let id = request.body.id;
				let tests = [];
				let task = tasks.getById(id);

				for(let i = 0; i < task.tests.length; i++) {
					let func = new Function(`
						${code}
					
						return ${task.function.name}("${task.tests[i].input}")
					`);
					let result;
					let test = {
						expected: task.tests[i].output,
						return: null,
						solved: null,
						logs: []
					}

					console.log = data => {
						test.logs.push(data);
					}

					try {
						result = func();
					} catch(e) {
						result = e.message;
					}

					if(result === undefined) {
						result = "undefined";
					}

					if(result === null) {
						result = "null";
					}

					if(result === Infinity) {
						result = "Infinity";
					}

					if(result === task.tests[i].output) {
						test.solved = true;
					} else {
						test.solved = false;
					}

					test.return = result;
					tests.push(test)
				}

				answer.data = tests;
				response.send(answer);
			}
		},
		login(request, response) {
			let login = request.body.login;
			let password = request.body.password;
			let user = users.find(login, password);
			let answer = {
				status: "success",
				data: null,
				error: null
			}

			if(typeof user !== "string") {
				let token = jwt.sign(user, '7x0jhxt"9(thpX6');

				answer.data = {
					user,
					token 
				};
				response.send(answer);
			} else {
				answer.status = "error";
				answer.error = user;
				response.send(404, answer);
			}
		},
		logout(request, response) {
			let answer = {
				status: "success"
			}

			response.send(answer);
		},
		registration(request, response) {
			let answer = {
				status: "success"
			}

			response.send(answer);
		}
	}
}