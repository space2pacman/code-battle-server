let { NodeVM } = require("vm2");

module.exports = new NodeVM({
	console: "redirect"
});;