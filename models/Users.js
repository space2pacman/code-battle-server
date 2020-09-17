let database = require("./../utils/database");

class Users {
	constructor() {
		this._users = null;
		this._init();
	}

	async getByField(key, value) {
		let user = await this._users.findOne({ [key]: value });

		if(user) {
			delete user.password;

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
					result = "wrong password";
				} else {
					delete user.password;

					return user;
				}
			}
		} else {
			return "user not found";
		}
	}

	update(username, user) {
		for(let i = 0; i < this._users.length ; i++) {
			if(this._users[i].login === username) {
				Object.assign(this._users[i], user);
			}
		}
	}

	add(params) {
		let user = {
			login: params.login,
			password: params.password,
			email: {
				address: params.email,
				notification: true,
				confirmed: false
			},
			verified: false,
			userpic: "public/images/users/default.png",
			socialNetworks: [],
			country: "США",
			accessLevel: 0,
			tasks: {
				solved: []
			},
			level: "junior",
			points: 0,
			likes: {
				solutions: []
			}
		}

		this._users.insertOne(user);
	}

	checkPassword(login, password) {
		return this.find(login, password);
	}

	async _init() {
		let db = await database;

		this._users = db.collection("users");
	}
}

module.exports = new Users();