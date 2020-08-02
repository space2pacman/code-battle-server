let users = [
	{
		login: "pacman",
		password: "test",
		userpic: "/",
		accessLevel: 0,
		tasks: {
			solved: [0, 1]
		},
		level: 3
	},
	{
		login: "test",
		password: "test",
		userpic: "/",
		accessLevel: 0,
		tasks: {
			solved: [1]
		},
		level: 2
	},
	{
		login: "kek",
		password: "kek",
		userpic: "/",
		accessLevel: 100,
		tasks: {
			solved: []
		},
		level: 2
	}
]

class Users {
	constructor() {
		this._users = users;
	}

	getByLogin(login) {
		let user;

		for(let i = 0; i < this._users.length; i++) {
			if(this._users[i].login === login) {
				user = JSON.parse(JSON.stringify(this._users[i]));

				break;
			} else {
				user = false;
			}
		}

		delete user.password;

		return user;
	}

	find(login, password) {
		let result = false;

		for(let i = 0; i < this._users.length ; i++) {
			let user = JSON.parse(JSON.stringify(this._users[i]));

			if(user.login === login) {
				if(user.password != password) {
					result = "wrong password";
				} else {
					delete user.password;

					result = user;
				}

				break;
			}
		}

		if(result === false) {
			result = "user not found";
		}

		return result;
	}

	update(user) {
		for(let i = 0; i < this._users.length ; i++) {
			if(this._users[i].login === user.login) {
				Object.assign(this._users[i], user);
			}
		}
	}
}

module.exports = new Users();