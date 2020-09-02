let vm = require("./vm");
let kindof = require("kind-of");
let capitalize = require("capitalize");
let { MessagePort, parentPort } = require('worker_threads');

parentPort.on("message", handler);

function handler({ funcName, funcBody, tests }) {
	for(let i = 0; i < tests.length; i++) {
		let test = {
			expected: {
				value: tests[i].output.value,
				type: tests[i].output.type
			},
			return: {
				value: null,
				type: null
			},
			solved: null,
			logs: [],
			error: null
		}

		function onConsoleLog(data){
			test.logs.push(data);
		}

		vm.on("console.log", onConsoleLog);

		try {
			let func = vm.run(`
				${funcBody}
			
				module.exports = () => {
					return ${funcName}("${tests[i].input.value}");
				}
			`);
			test.return.value = func();
			test.return.type = capitalize.words(kindof(test.return.value));
		} catch(e) {
			test.error = e.message;
		}

		if(test.return.value === undefined) {
			test.return.value = "undefined";
		}

		if(test.return.value === null) {
			test.return.value = "null";
		}

		if(test.return.value === Infinity) {
			test.return.value = "Infinity";
		}

		if(kindof(test.return.value) === "function") {
			test.return.value = test.return.value.toString();
		}

		if(test.return.value === tests[i].output.value) {
			test.solved = true;
		} else {
			test.solved = false;
		}

		parentPort.postMessage(test);
		vm.removeListener("console.log", onConsoleLog);
	}
}