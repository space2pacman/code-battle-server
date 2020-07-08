let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let cors = require("cors");
let passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let jwt = require("jsonwebtoken");
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
// profile
app.get("/api/profile/:login/", routes.get.profile.getByLogin);
app.get("/api/profile/:login/tasks/", routes.get.profile.tasks);
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

app.post("/api/login/", (request, response) => {
	let login = request.body.login;
	let password = request.body.password;
	let user = {
		login
	}
	let token = jwt.sign(user, '7x0jhxt"9(thpX6');

	response.send({ data: token });
})

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