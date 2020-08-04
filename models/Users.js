let users = [
	{
		login: "pacman",
		password: "test",
		email: {
			address: "pacman@gmail.com",
			notification: true
		},
		userpic: "/",
		socialNetworks: [
			{
				name: "github",
				icon: "fab fa-github",
				link: "http://github.com/space2pacman"
			}
		],
		country: "США",
		accessLevel: 0,
		tasks: {
			solved: [0, 1]
		},
		level: "middle",
		points: 0
	},
	{
		login: "test",
		password: "test",
		email: {
			address: "test@gmail.com",
			notification: false
		},
		userpic: "/",
		socialNetworks: [
			{
				name: "github",
				icon: "fab fa-github",
				link: ""
			}
		],
		country: "Россия",
		accessLevel: 0,
		tasks: {
			solved: []
		},
		level: "junior",
		points: 0
	},
	{
		login: "kek",
		password: "kek",
		email: {
			address: "kek@gmail.com",
			notification: false
		},
		userpic: "/",
		socialNetworks: [
			{
				name: "github",
				icon: "fab fa-github",
				link: ""
			}
		],
		country: "Россия",
		accessLevel: 100,
		tasks: {
			solved: []
		},
		level: "senior",
		points: 0
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