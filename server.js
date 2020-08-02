let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let cors = require("cors");
let passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());
// task
app.get("/", routes.get.home);
app.get("/api/tasks/", routes.get.task.getAll);
app.get("/api/task/:id/", routes.get.task.getById);
app.post("/api/task/test/", authenticate, routes.post.task.test);
app.post("/api/task/check/", authenticate, routes.post.task.check);
app.post("/api/task/add/", authenticate, routes.post.task.add);
app.post("/api/task/edit/", authenticate, routes.post.task.edit);
app.post("/api/task/submit/", authenticate, routes.post.task.submit);
// user
app.get("/api/user/:login/", routes.get.user.getByLogin);
app.get("/api/user/:login/tasks/solved/", routes.get.user.tasks.solved);
app.get("/api/user/:login/tasks/added/", routes.get.user.tasks.added);
// solution
app.get("/api/solution/:id/", authenticate, routes.get.solution.getById);
app.get("/api/solution/task/:id/", [authenticate, solution], routes.get.solution.getByTaskId);
// login
let params = {};

//
let users = require("./models/Users");

params.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
params.secretOrKey = '7x0jhxt"9(thpX6';
passport.use("jwt", new JwtStrategy(params, (payload, done) => {
	done(null, payload); // payload - user
}))

app.post("/api/login/", routes.post.login);
app.post("/api/logout/", routes.post.logout);
app.post("/api/registration/", routes.post.registration);

let urls = {
	"/api/solution/task/:id/": "solution/task",
	"/api/solution/:id/": "solution",
	"/api/task/test/": "task/test"
}

function authenticate(req, res, next) {
	passport.authenticate('jwt', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			let answer = {
				status: "error",
				error: "unauthorized",
				url: urls[req.route.path]
			}

			return res.send(401, answer);
		}

		res.locals.user = user;

		next();	
	})(req, res, next);
}

function solution(req, res, next) {
	let user = users.getByLogin(res.locals.user.login);
	let id = Number(req.params.id);

	if(!user.tasks.solved.includes(id)) {
		let answer = {
			status: "error",
			error: "task is not solved",
			url: urls[req.route.path]
		}

		return res.send(403, answer);
	}

	next();
}

app.listen(8080);