let { Worker } = require("worker_threads");

function task(funcName, funcBody, tests, callback) {
	let worker = new Worker(`${__dirname}/worker.js`);
	let isFrozen = true;
	let data = [];
	let timer = setTimeout(onTimer, 12000);

	worker.postMessage({ funcName, funcBody, tests });
	worker.on("message", test => {
		clearTimeout(timer);
		isFrozen = false;
		data.push(test);

		if(data.length === tests.length) {
			callback(data);
		} else {
			timer = setTimeout(onTimer, 12000)
			isFrozen = true;
		}
	});

	function onTimer() {
		if(isFrozen) {
			let test = {
				expected: {
					value: tests[data.length].output.value,
					type: tests[data.length].output.type
				},
				return: {
					value: null,
					type: null
				},
				logs: [],
				solved: false,
				error: "Execution Timed Out (12000 ms)"
			}

			data.push(test);
			worker.terminate();
			callback(data);
		}
	}
}

module.exports = {
	task
}