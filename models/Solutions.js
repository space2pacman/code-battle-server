let solutions = [
	{
		id: 0,
		task: 0,
		username: "pacman",
		code: "function pacman() {}",
		likes: 1,
		comments: 2
	},
	{
		id: 1,
		task: 0,
		username: "test",
		code: "function test() {}",
		likes: 10,
		comments: 22
	}
]

class Solutions {
	constructor() {
		this._solutions = solutions;
		this._lastId = 2;
	}

	getById(id) {
		let solution = false;

		for(let i = 0; i < this._solutions.length; i++) {
			if(this._solutions[i].id === Number(id)) {
				solution = this._solutions[i];

				break;
			}
		}

		return solution;
	}

	getByTaskId(id) {
		let solutions = [];

		for(let i = 0; i < this._solutions.length; i++) {
			if(this._solutions[i].task === Number(id)) {
				solutions.push(this._solutions[i]);
			}
		}

		return solutions;
	}

	getCountByTaskId(id) {
		return this.getByTaskId(id).length;
	}
	
	add(code, author, taskId) {
		let solution = {
			id: this._lastId,
			task: taskId,
			username: author,
			code: code,
			likes: 0,
			comments: 0
		}

		this._lastId++;
		this._solutions.push(solution);
	}
}

module.exports = new Solutions();