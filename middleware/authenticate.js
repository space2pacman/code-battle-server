let users = require("../models/Users");
let urls = require("../utils/urls");
let passport = require("passport");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
let params = {};

params.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
params.secretOrKey = '7x0jhxt"9(thpX6';
passport.use("jwt", new JwtStrategy(params, (payload, done) => {
	done(null, payload); // payload - user
}))

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

module.exports = authenticate;