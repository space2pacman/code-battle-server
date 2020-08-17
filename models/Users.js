let users = [
	{
		login: "pacman",
		password: "test",
		email: {
			address: "pacman@gmail.com",
			notification: true
		},
		verified: false,
		userpic: "public/images/users/default.png",
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
		points: 0,
		likes: {
			solutions: []
		}
	},
	{
		login: "test",
		password: "test",
		email: {
			address: "test@gmail.com",
			notification: false
		},
		userpic: "public/images/users/default.png",
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
			solved: [0]
		},
		verified: false,
		level: "junior",
		points: 0,
		likes: {
			solutions: []
		}
	},
	{
		login: "kek",
		password: "kek",
		email: {
			address: "kek@gmail.com",
			notification: false
		},
		verified: false,
		userpic: "public/images/users/default.png",
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
			solved: [0]
		},
		level: "senior",
		points: 0,
		likes: {
			solutions: []
		}
	},
	{
		login: "google",
		password: "test",
		email: {
			address: "google@gmail.com",
			notification: false
		},
		verified: true,
		userpic: "public/images/users/default.png",
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
			solved: [0]
		},
		level: "senior",
		points: 0,
		likes: {
			solutions: []
		}
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

	update(username, user) {
		for(let i = 0; i < this._users.length ; i++) {
			if(this._users[i].login === username) {
				Object.assign(this._users[i], user);
			}
		}
	}
}

module.exports = new Users();