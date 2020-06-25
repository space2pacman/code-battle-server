module.exports = {
	get: {
		home(request, response) {
			response.send("home page");
		},
		task: {
			getAll(request, response) {
				response.send("all tasks");
			},
			getById(request, response) {
				let id = request.params.id;

				response.send("get by id: " + id);
			}
		}
	},
	post: {
		task: {
			test(request, response) {
				let answer = {
					status: "success"
				}

				console.log(request.body);

				response.send(answer);
			}
		}
	}
}