let tasks = [
	{
		id: 0,
		caption: "Перевернуть строку",
		description: "Напишите функцию по развороту строки",
		level: 1,
		completed: false,
		solutions: 8023,
		author: "space2pacman",
		func: {
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

class Tasks {
	constructor() {
		this._tasks = tasks;
	}

	getAll() {
		return this._tasks;
	}

	getById(id) {
		let task = false;

		for(let i = 0; i < this._tasks.length; i++) {
			if(this._tasks[i].id === Number(id)) {
				task = this._tasks[i];
				
				break;
			}
		}

		return task;
	}
}

module.exports = new Tasks();