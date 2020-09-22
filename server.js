let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let cors = require("cors");
let fileUpload = require("express-fileupload");
let authenticate = require("./middleware/authenticate");
let checkSolution = require("./middleware/checkSolution");
let checkAccessLevel = require("./middleware/checkAccessLevel");
let roles = require("./utils/roles");
let helmet = require("helmet");
let version = require("./utils/version").get();
let app = express();

app.use(helmet());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use("/public", express.static("public"));

// task
app.get(`/${version}/api/tasks/`, routes.get.task.getAll);
app.get(`/${version}/api/task/:id/`, routes.get.task.getById);
app.post(`/${version}/api/task/edit/`, authenticate, routes.post.task.edit);
app.post(`/${version}/api/task/test/`, authenticate, routes.post.task.test);
app.post(`/${version}/api/task/check/`, authenticate, routes.post.task.check);
app.post(`/${version}/api/task/add/`, authenticate, routes.post.task.add);
app.post(`/${version}/api/task/submit/`, authenticate, routes.post.task.submit);
// user
app.get(`/${version}/api/users/`, [authenticate, checkAccessLevel(roles.admin)], routes.get.user.getAll);
app.get(`/${version}/api/user/:login/`, routes.get.user.getByLogin);
app.get(`/${version}/api/user/:login/tasks/solved/`, routes.get.user.tasks.solved);
app.get(`/${version}/api/user/:login/tasks/added/`, routes.get.user.tasks.added);
app.post(`/${version}/api/user/:login/`, routes.post.user.update);
// solution
app.get(`/${version}/api/solution/liked/`, authenticate, routes.get.solution.getByLiked);
app.get(`/${version}/api/solution/:id/`, [authenticate, checkSolution], routes.get.solution.getById);
app.get(`/${version}/api/solution/task/:id/`, [authenticate, checkSolution], routes.get.solution.getByTaskId);
app.post(`/${version}/api/solution/like/`, authenticate, routes.post.solution.like);
// login
app.post(`/${version}/api/login/`, routes.post.login);
app.post(`/${version}/api/logout/`, routes.post.logout);
app.post(`/${version}/api/registration/`, routes.post.registration);
// upload
app.post(`/${version}/api/upload/`, authenticate, routes.post.upload);
// version
app.get("/api/version/", routes.get.version);

app.listen(8080);