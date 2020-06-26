let tasks = [
	{
		id: 0,
		caption: "Перевернуть строку",
		description: "Напишите функцию по развороту строки",
		level: 1,
		completed: false,
		solutions: 8023,
		author: "space2pacman",
		function: {
			name: "reverseString",
			body: "function reverseString(str) { return str.split('').reverse().join('') }"
		},
		company: null,
		language: "javascript",
		tests: [
			{
				input: "Hello",
				output: "olleH"
			},
			{
				input: "apple",
				output: "elppa"
			},
			{
				input: "I love Javascript",
				output: "tpircsavaJ evol I"
			}
		]
	},
	{
		id: 1,
		caption: "Факториал",
		description: "Напишите функцию по подсчету факториалаи",
		level: 2,
		completed: true,
		solutions: 564,
		author: "Google",
		function: {
			name: "fact",
			body: "function fact(n) { return 120 }"
		},
		company: "Google",
		language: "php",
		tests: [
			{
				input: 5,
				output: 120
			},
			{
				input: 6,
				output: 720
			},
			{
				input: 7,
				output: 5040
			},
			{
				input: 8,
				output: 40320
			},
			{
				input: 9,
				output: 362880
			}
		]
	}
];

module.exports = {
	get: {
		home(request, response) {
			response.send("home page");
		},
		task: {
			getAll(request, response) {
				let answer = {
					status: "success",
					data: tasks
				}

				response.send(answer);
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
				let code = request.body.code;
				let id = request.body.id;
				let tests = [];

				for(let i = 0; i < tasks[id].tests.length; i++) {
					let func = new Function(`
						${code}
					
						return ${tasks[id].function.name}("${tasks[id].tests[i].input}")
					`);
					let result = func();
					
					if(result === tasks[id].tests[i].output) {
						tests.push(true)
					}
				}

				console.log(tests)

				response.send(answer);
			}
		}
	}
}