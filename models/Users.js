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
		socialNetworks: [],
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
		socialNetworks: [],
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
		socialNetworks: [],
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

	getByField(key, value) {
		let user;

		for(let i = 0; i < this._users.length; i++) {
			let keys = key.split(".");
			
			if(keys.length > 1) {
				let propertie = this._users[i];

				for(let i = 0; i < keys.length; i++) {	
					propertie = propertie[keys[i]];
				}
				
				if(propertie === value) {
					user = JSON.parse(JSON.stringify(this._users[i]));
					
					delete user.password;
					break;
				} else {
					user = false;
				}
			} else {
				if(this._users[i][key] === value) {
					user = JSON.parse(JSON.stringify(this._users[i]));

					delete user.password;
					break;
				} else {
					user = false;
				}
			}
		}

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

	add(params) {
		let user = {
			login: params.login,
			password: params.password,
			email: {
				address: params.email,
				notification: true
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

		this._users.push(user);
	}

	checkPassword(login, password) {
		return this.find(login, password);
	}
}

module.exports = new Users();