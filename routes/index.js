let tasks = require("../models/Tasks");
let solutions = require("../models/Solutions");
let users = require("../models/Users");
let version = require("../models/Version");
let test = require("../utils/test");
let jwt = require("jsonwebtoken");
let regex = {
	form: /^[a-zA-Z0-9]+$/
}

module.exports = {
	get: {
		task: {
			async getAll(request, response) {
				let answer = {
					status: "success",
					url: "tasks",
					data: await tasks.getAll(),
					error: null
				}

				response.send(answer);
			},
			async getById(request, response) {
				let id = request.params.id;
				let answer = {
					status: null,
					url: "task",
					data: null,
					error: null
				}
				let task = await tasks.getById(id);

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
			async getByLogin(request, response) {
				let login = request.params.login;
				let answer = {
					status: null,
					url: "user",
					data: null,
					error: null
				}
				let user = await users.getByField("login", login);

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
				async solved(request, response) {
					let login = request.params.login;
					let answer = {
						status: null,
						url: "user/tasks/solved",
						data: null,
						error: null
					}
					let user = await users.getByField("login", login);

					if(user && user.tasks.solved.length > 0) {
						let data = [];

						for(let i = 0; i < user.tasks.solved.length; i++) {
							let id = user.tasks.solved[i];

							data.push(await tasks.getById(id));
						}

						answer.data = data;
						answer.status = "success";
					} else {
						answer.status = "error";
						answer.error = "tasks not found";
					}

					response.send(answer);
				},
				async added(request, response) {
					let login = request.params.login;
					let answer = {
						status: null,
						url: "user/tasks/added",
						data: null,
						error: null
					}
					let user = await users.getByField("login", login);
					let data = await tasks.getByAuthor(user.login);

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
			async getById(request, response) {
				let id = request.params.id;
				let answer = {
					status: null,
					url: "solution",
					data: null,
					error: null
				}
				let solution = await solutions.getById(id);

				if(solution) {
					answer.data = solution;
					answer.status = "success";
				} else {
					answer.status = "error";
					answer.error = "solution not found";
				}

				response.send(answer)
			},
			async getByTaskId(request, response) {
				let id = request.params.id;
				let answer = {
					status: null,
					url: "solution/task",
					data: null,
					error: null
				}
				let data = await solutions.getByTaskId(id);

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
			async getByLiked(request, response) {
				let answer = {
					status: "success",
					url: "solution/liked",
					data: null,
					error: null
				}
				let user = await users.getByField("login", response.locals.user.login);
				let likes = user.likes.solutions;

				if(likes.length > 0) {
					answer.data = [];

					for(let i = 0; i < likes.length; i++) {
						let id = likes[i];
						
						answer.data.push(await solutions.getById(id));
					}
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
			async test(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let id = request.body.id; 
				let task = await tasks.getById(id);
				let tests =  task.tests;
				let func = {
					name: task.func.name,
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
			async add(request, response) {
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
				await tasks.add(task);
				response.send(answer);
			},
			async edit(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let id = request.body.data.id;
				let fields = request.body.data.fields;
				let func = request.body.data.func;
				let author = request.body.data.author;
				let task = await tasks.getById(id);

				if(task.author === author) {
					fields.func.body = func;
					fields.author = author;
					await tasks.edit(id, fields);
					response.send(answer);
				} else {
					answer.status = "error";
					answer.error = "no edit access";
					response.send(403, answer);
				}
				
			},
			async submit(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let taskId = request.body.data.taskId;
				let code = request.body.data.code;
				let author = request.body.data.author;
				let user = await users.getByField("login", author);
				let solution = await solutions.find(author, taskId);

				if(solution) {
					await solutions.update(solution.id, { code });
				} else {
					user.tasks.solved.push(taskId);
					await solutions.add(code, author, taskId);
					await users.update(author, user);
				}

				response.send(answer);
			}
		},
		user: {
			async update(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let login = request.body.data.login;
				let password = request.body.data.password;
				let user = await users.getByField("login", login)
				let data = {
					login,
					email: {
						address: request.body.data.email.address,
						confirmed: user.email.confirmed,
						notification: request.body.data.email.notification
					},
					userpic: request.body.data.userpic,
					country: request.body.data.country,
					level: request.body.data.level,
					socialNetworks: request.body.data.socialNetworks
				}
				let fields = {
					email: await users.getByField("email.address", data.email.address),
					password: await users.checkPassword(login, password.old)
				}

				data.socialNetworks = data.socialNetworks.filter(socialNetwork => socialNetwork.link.length > 0);

				if(password.old !== null && password.new !== null) {
					data.password = password.new;
				}

				if(fields.email && user.email.address !== data.email.address) {
					answer.status = "error";
					answer.error = "email already exists"
				} else if(password.old !== null && password.new !== null && fields.password === "wrong password") {
					answer.status = "error";
					answer.error = "wrong old password";
				} else {
					users.update(login, data);
				}

				response.send(answer);
			}
		},
		solution: {
			async like(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let user = await users.getByField("login", response.locals.user.login);
				let id = request.body.data.id;
				let index = user.likes.solutions.indexOf(id);
				let solution = await solutions.getById(id);

				if(index === -1) {
					user.likes.solutions.push(id);
					solution.likes++;
				} else {
					user.likes.solutions.splice(index, 1);
					solution.likes--;
				}

				await users.update(user.login, user);
				await solutions.update(id, solution);
				response.send(answer);
			}
		},
		async login(request, response) {
			let login = request.body.login;
			let password = request.body.password;
			let answer = {
				status: "success",
				data: null,
				error: null
			}

			if(!regex.form.test(login)) {
				answer.status = "error";
				answer.error = "invalid characters in login";
				response.send(answer);
			} else if(!regex.form.test(password)) {
				answer.status = "error";
				answer.error = "invalid characters in password";
				response.send(answer);
			} else {
				let user = await users.find(login, password);
				
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
			}
		},
		logout(request, response) {
			let answer = {
				status: "success"
			}

			response.send(answer);
		},
		async registration(request, response) {
			let login = request.body.login;
			let password = request.body.password;
			let email = request.body.email;
			let answer = {
				status: "success",
				error: null
			}

			if(!regex.form.test(login)) {
				answer.status = "error";
				answer.error = "invalid characters in login";
			} else if(!regex.form.test(password)) {
				answer.status = "error";
				answer.error = "invalid characters in password";
			} else {
				let fields = {
					user: await users.getByField("login", login),
					email: await users.getByField("email.address", email)
				}

				if(fields.user) {
					answer.status = "error";
					answer.error = "user already exists";
				} else if(fields.email) {
					answer.status = "error";
					answer.error = "email already exists";
				} else {
					await users.add({ login, password, email });
				}
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