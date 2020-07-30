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
// user
app.get("/api/user/:login/", routes.get.user.getByLogin);
app.get("/api/user/:login/tasks/", routes.get.user.tasks);
// solution
app.get("/api/solution/:id/", authenticate, routes.get.solution.getById);
app.get("/api/solution/task/:id/", authenticate, routes.get.solution.getByTaskId);
// login
let params = {};
params.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
params.secretOrKey = '7x0jhxt"9(thpX6';

passport.use("jwt", new JwtStrategy(params, (payload, done) => {
	let user = {
		login: "test",
		password: "test"
	}

	done(null, user);
}))

app.post("/api/login/", routes.post.login);
app.post("/api/logout/", routes.post.logout);
app.post("/api/registration/", routes.post.registration);

function authenticate(req, res, next) {
	let urls = {
		"/api/solution/task/:id/": "solution/task",
		"/api/solution/:id/": "solution",
		"/api/task/test/": "task/test"
	}

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

		next();	
	})(req, res, next);
}

app.listen(8080);