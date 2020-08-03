let tasks = require("../models/Tasks");
let solutions = require("../models/Solutions");
let users = require("../models/Users");
let jwt = require("jsonwebtoken");
let kindof = require("kind-of");
let capitalize = require("capitalize");
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
		user: {
			getByLogin(request, response) {
				let login = request.params.login;
				let answer = {
					status: null,
					url: "user",
					data: null,
					error: null
				}
				let user = users.getByLogin(login);

				if(user) {
					answer.status = "success";
					answer.data = user;
				} else {
					answer.status = "error";
					answer.error = "user not found";
				}

				response.send(answer);
			},
			tasks: {
				solved(request, response) {
					let login = request.params.login;
					let answer = {
						status: null,
						url: "user/tasks/solved",
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
				},
				added(request, response) {
					let login = request.params.login;
					let answer = {
						status: null,
						url: "user/tasks/added",
						data: null,
						error: null
					}
					let user = users.getByLogin(login);
					let data = tasks.getByAuthor(user.login);

					if(user && data.length > 0) {
						answer.data = data;
						answer.status = "success";
					} else {
						answer.status = "error";
						answer.error = "tasks not found";
					}

					response.send(answer);
				}
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
					
						return ${task.func.name}("${task.tests[i].input.value}")
					`);
					let test = {
						expected: {
							value: task.tests[i].output.value,
							type: task.tests[i].output.type
						},
						return: {
							value: null,
							type: null
						},
						solved: null,
						logs: []
					}

					console.log = data => {
						test.logs.push(data);
					}

					try {
						test.return.value = func();
						test.return.type = capitalize.words(kindof(test.return.value));
					} catch(e) {
						test.return.value = e.message;
					}

					if(test.return.value === undefined) {
						test.return.value = "undefined";
					}

					if(test.return.value === null) {
						test.return.value = "null";
					}

					if(test.return.value === Infinity) {
						test.return.value = "Infinity";
					}

					if(kindof(test.return.value) === "function") {
						test.return.value = test.return.value.toString();
					}

					if(test.return.value === task.tests[i].output.value) {
						test.solved = true;
					} else {
						test.solved = false;
					}

					tests.push(test);
				}

				answer.data = tests;
				response.send(answer);
			},
			check(request, response) { // fix double
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let data = request.body.data;
				let tests = [];

				for(let i = 0; i < data.tests.length; i++) {
					let func = new Function(`
						${data.func.body}

						return ${data.func.name}("${data.tests[i].input.value}")
					`);

					let test = {
						expected: {
							value: data.tests[i].output.value,
							type: data.tests[i].output.type
						},
						return: {
							value: null,
							type: null
						},
						solved: null,
						logs: []
					}

					console.log = data => {
						test.logs.push(data);
					}

					try {
						test.return.value = func();
						test.return.type = capitalize.words(kindof(test.return.value));
					} catch(e) {
						test.return.value = e.message;
					}

					if(test.return.value === undefined) {
						test.return.value = "undefined";
					}

					if(test.return.value === null) {
						test.return.value = "null";
					}

					if(test.return.value === Infinity) {
						test.return.value = "Infinity";
					}

					if(kindof(test.return.value) === "function") {
						test.return.value = test.return.value.toString();
					}

					if(test.return.value === data.tests[i].output.value) {
						test.solved = true;
					} else {
						test.solved = false;
					}

					tests.push(test);
				}

				answer.data = tests;
				response.send(answer);
			},
			add(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let fields = request.body.data.fields;
				let func = request.body.data.func;
				let author = request.body.data.author;
				let task = fields;

				task.func.body = func;
				task.author = author;
				tasks.add(task);
				response.send(answer);
			},
			edit(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let id = request.body.data.id;
				let fields = request.body.data.fields;
				let func = request.body.data.func;
				let author = request.body.data.author;
				let task = tasks.getById(id);

				if(task.author === author) {
					fields.func.body = func;
					fields.author = author;
					tasks.edit(id, fields);
					response.send(answer);
				} else {
					answer.status = "error";
					answer.error = "no edit access";
					response.send(403, answer);
				}
				
			},
			submit(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let taskId = request.body.data.taskId;
				let code = request.body.data.code;
				let author = request.body.data.author;
				let user = users.getByLogin(author);

				solutions.add(code, author, taskId);
				user.tasks.solved.push(taskId);
				users.update(user);
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