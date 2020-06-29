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
		company: false,
		language: "javascript",
		tests: [
			{
				input: "olleH",
				output: "Hello"
			},
			{
				input: "elppa",
				output: "apple"
			},
			{
				input: "tpircsavaJ evol I",
				output: "I love Javascript"
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
		company: true,
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
	},
	{
		id: 2,
		caption: "CaMeLcAsE",
		description: "Напишите функцию для перевода строки в CaMeLcAsE нотацию",
		level: 3,
		completed: false,
		solutions: 564,
		author: "Yandex",
		function: {
			name: "getCamelCase",
			body: "function getCamelCase(n) { }"
		},
		company: true,
		language: "vue",
		tests: [
			{
				input: "Hello world",
				output: "HeLlO WoRlD"
			},
			{
				input: "Верните мне мой две тысячи седьмой",
				output: "ВеРнИтЕ МнЕ МоЙ ДвЕ ТыСяЧи СеДьМоЙ"
			},
			{
				input: "Напиши мне в icq",
				output: "НаПиШи МнЕ В IcQ"
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
					url: "tasks",
					data: tasks,
					error: null
				}

				response.send(answer);
			},
			getById(request, response) {
				let id = request.params.id;
				let answer = {
					status: null,
					url: "task",
					data: null,
					error: null
				}

				if(tasks[id]) {
					answer.status = "success"
					answer.data = tasks[id]
				} else {
					answer.status = "error"
					answer.error = "not found"
				}

				response.send(answer);
			}
		}
	},
	post: {
		task: {
			test(request, response) {
				let answer = {
					status: "success",
					data: null,
					error: null
				}
				let code = request.body.code;
				let id = request.body.id;
				let tests = [];

				for(let i = 0; i < tasks[id].tests.length; i++) {
					let func = new Function(`
						${code}
					
						return ${tasks[id].function.name}("${tasks[id].tests[i].input}")
					`);
					let result;
					let test = {
						expected: tasks[id].tests[i].output,
						return: null,
						solved: null,
						logs: []
					}

					console.log = data => {
						test.logs.push(data);
					}

					try {
						result = func();
					} catch(e) {
						result = e.message;
					}

					if(result === undefined) {
						result = "undefined";
					}

					if(result === null) {
						result = "null";
					}

					if(result === Infinity) {
						result = "Infinity";
					}

					if(result === tasks[id].tests[i].output) {
						test.solved = true;
					} else {
						test.solved = false;
					}

					test.return = result;
					tests.push(test)
				}

				answer.data = tests;
				response.send(answer);
			}
		}
	}
}