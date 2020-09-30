let database = require("./../utils/database");

class Solutions {
	constructor() {
		this._solutions = null;
		this._init();
	}

	async getById(id) {
		return await this._solutions.findOne({ id: Number(id) });
	}

	async getByTaskId(id) {
		let solutions = [];

		await this._solutions.find({ "task": Number(id) }).forEach(solution => {
			solutions.push(solution);
		})

		return solutions;
	}

	async getCountByTaskId(id) {
		let solutions = await this.getByTaskId(id);

		return solutions.length;
	}

	async find(username, taskId) {
		return await this._solutions.findOne({ username, task: Number(taskId) });
	}
	
	async add(code, username, taskId) {
		let solution = {
			id: await this._solutions.countDocuments(),
			task: taskId,
			username,
			code,
			likes: 0,
			comments: 0
		}

		await this._solutions.insertOne(solution);
	}

	async update(id, solution) {
		await this._solutions.updateOne({ id: Number(id) }, { $set: solution });
	}

	async _init() {
		let db = await database;

		this._solutions = db.collection("solutions");
	}
}

module.exports = new Solutions();