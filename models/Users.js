let database = require("./../utils/database");

class Users {
	constructor() {
		this._users = null;
		this._init();
	}

	async getAll() {
		let users = [];
		let cursor = this._users.find();

		while(await cursor.hasNext()) {
			let user = await cursor.next();

			delete user.password;
			delete user._id;

			users.push(user);
		}

		return users;
	}

	async getByField(key, value) {
		let user = await this._users.findOne({ [key]: value });

		if(user) {
			delete user.password;
			delete user._id;

			return user;
		} else {
			return false;
		}
	}

	async find(login, password) {
		let user = await this._users.findOne({ "login": login });

		if(user) {
			if(user.login === login) {
				if(user.password != password) {
					return "wrong password";
				} else {
					delete user.password;
					delete user._id;

					return user;
				}
			}
		} else {
			return "user not found";
		}
	}

	async update(login, user) {
		await this._users.updateOne({ "login": login }, { $set: user });
	}

	async add(params) {
		let user = {
			login: params.login,
			password: params.password,
			email: {
				address: params.email,
				notification: true,
				confirmed: false
			},
			verified: false,
			company: false,
			userpic: "public/images/users/default.png",
			socialNetworks: [],
			country: "США",
			accessLevel: 0,
			tasks: {
				solved: []
			},
			level: "junior",
			points: 0,
			created: Date.now(),
			likes: {
				solutions: []
			}
		}

		await this._users.insertOne(user);
	}

	async checkPassword(login, password) {
		return await this.find(login, password);
	}

	async _init() {
		let db = await database;

		this._users = db.collection("users");
	}
}

module.exports = new Users();