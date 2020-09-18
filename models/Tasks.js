let database = require("./../utils/database");
let solutions = require("../models/Solutions");

class Tasks {
	constructor() {
		this._tasks = null;
		this._lastId = 3;
		this._init();
	}

	async getAll() {
		let tasks = [];
		let cursor = this._tasks.find();

		while(await cursor.hasNext()) {
			let task = await cursor.next();

			delete task._id;

			task.solutions = await solutions.getCountByTaskId(task.id);
			tasks.push(task);
		}

		return tasks;
	}

	async getById(id) {
		return await this._tasks.findOne({ "id": Number(id) });
	}

	async getByAuthor(author) {
		let tasks = [];
		let cursor = this._tasks.find({ "author": author });

		while(await cursor.hasNext()) {
			let task = await cursor.next();

			delete task._id;

			task.solutions = await solutions.getCountByTaskId(task.id);
			tasks.push(task);
		}

		return tasks;
	}

	async add(task) {
		task.id = this._lastId;

		this._lastId++;
		await this._tasks.insertOne(task);
	}

	async edit(id, data) {
		await this._tasks.updateOne({ id: Number(id) }, { $set: data });
	}

	async _init() {
		let db = await database;

		this._tasks = db.collection("tasks");
	}
}

module.exports = new Tasks();