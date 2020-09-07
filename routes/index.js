let tasks = require("../models/Tasks");
let solutions = require("../models/Solutions");
let users = require("../models/Users");
let version = require("../models/Version");
let test = require("../utils/test");
let jwt = require("jsonwebtoken");

module.exports = {
	get: {
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
				let user = users.getByField("login", login);

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
					let user = users.getByField("login", login);

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
					let user = users.getByField("login", login);
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
			},
			getByLiked(request, response) {
				let answer = {
					status: "success",
					url: "solution/liked",
					data: null,
					error: null
				}
				let user = users.getByField("login", response.locals.user.login);
				let likes = user.likes.solutions;

				if(likes.length > 0) {
					answer.data = [];

					likes.forEach(id => {
						answer.data.push(solutions.getById(id));
					})
				} else {
					answer.data = "no liked solutions";
				}
				
				response.send(answer);
			}
		},
		version(request, response) {
			response.send(version.get());
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
				let id = request.body.id; 
				let tests = tasks.getById(id).tests;
				let func = {
					name: tasks.getById(id).func.name,
					body: request.body.code
				}
				
				test.task(func.name, func.body, tests, data => {
					answer.data = data;
					response.send(answer);
				});
			},
			check(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let func = {
					name: request.body.data.func.name,
					body: request.body.data.func.body
				}
				let tests = request.body.data.tests;

				test.task(func.name, func.body, tests, data => {
					answer.data = data;
					response.send(answer);
				});
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
				let user = users.getByField("login", author);
				let solution = solutions.find(author, taskId);

				if(solution) {
					solutions.update(solution.id, { code });
				} else {
					solutions.add(code, author, taskId);
					user.tasks.solved.push(taskId);
					users.update(author, user);
				}

				response.send(answer);
			}
		},
		user: {
			update(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let login = request.body.data.login;
				let user = users.getByField("login", login)
				let data = {
					login,
					email: request.body.data.email,
					userpic: request.body.data.userpic,
					country: request.body.data.country,
					level: request.body.data.level
				}
				let fields = {
					email: users.getByField("email.address", data.email.address)
				}

				if(fields.email && user.email.address !== data.email.address) {
					answer.status = "error";
					answer.error = "email already exists"
				} else {
					users.update(login, data);
				}

				response.send(answer);
			}
		},
		solution: {
			like(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let user = users.getByField("login", response.locals.user.login);
				let id = request.body.data.id;
				let index = user.likes.solutions.indexOf(id);
				let solution = solutions.getById(id);

				if(index === -1) {
					user.likes.solutions.push(id);
					solution.likes++;
				} else {
					user.likes.solutions.splice(index, 1);
					solution.likes--;
				}

				users.update(user.login, user);
				solutions.update(id, solution);
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
			let login = request.body.login;
			let password = request.body.password;
			let email = request.body.email;
			let fields = {
				user: users.getByField("login", login),
				email: users.getByField("email.address", email)
			}
			let answer = {
				status: "success",
				error: null
			}

			if(fields.user) {
				answer.status = "error";
				answer.error = "user already exists"
			} else if(fields.email) {
				answer.status = "error";
				answer.error = "email already exists"
			} else {
				users.add({ login, password, email });
			}

			response.send(answer);
		},
		upload(request, response) {
			if (!request.files || Object.keys(request.files).length === 0) {
    			return response.send(400, "no files were uploaded");
  			}

			let answer = {
				status: "success",
				data: null,
				error: null
			}
			let type = Object.keys(request.files)[0];
			let file = request.files[type];
			let MAX_USERPIC_SIZE = 50000;

			switch(type) {
				case "userpic": {
					let mimetypes = ["image/jpeg", "image/png"];

					if(mimetypes.includes(file.mimetype)) {
						if(file.size > MAX_USERPIC_SIZE) {
							answer.status = "error";
							answer.error = "max image size 50kb";

							return response.send(500, answer);
						}
						
						let path =  `public/images/users/${file.name}`;

						file.mv(path, error => {
							if(error) {
								return response.send(500, error);
							} else {
								answer.data = {
									link: path
								};

								response.send(answer);
							}
						});
					} else {
						answer.status = "error";
						answer.error = "unsupported file type";
						response.send(500, answer);
					}

					break;
				}
			}
		}
	}
}