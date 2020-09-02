let { Worker } = require("worker_threads");

function task(funcName, funcBody, tests, callback) {
	let worker = new Worker(`${__dirname}/worker.js`);

	worker.postMessage({ funcName, funcBody, tests });
	worker.on("message", callback);
}

module.exports = {
	task
}