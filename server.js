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
let version = require("./utils/version").api();
let app = express();

app.use(helmet());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use("/public", express.static("public"));

// task
app.get(`/api/${version}/tasks/`, routes.get.task.getAll);
app.get(`/api/${version}/task/:id/`, routes.get.task.getById);
app.post(`/api/${version}/task/edit/`, authenticate, routes.post.task.edit);
app.post(`/api/${version}/task/test/`, authenticate, routes.post.task.test);
app.post(`/api/${version}/task/check/`, [authenticate, checkAccessLevel(roles.admin)], routes.post.task.check);
app.post(`/api/${version}/task/add/`, [authenticate, checkAccessLevel(roles.admin)], routes.post.task.add);
app.post(`/api/${version}/task/submit/`, authenticate, routes.post.task.submit);
// user
app.get(`/api/${version}/users/`, [authenticate, checkAccessLevel(roles.admin)], routes.get.user.getAll);
app.get(`/api/${version}/user/:login/`, routes.get.user.getByLogin);
app.get(`/api/${version}/user/:login/tasks/solved/`, routes.get.user.tasks.solved);
app.get(`/api/${version}/user/:login/tasks/added/`, routes.get.user.tasks.added);
app.post(`/api/${version}/user/:login/update/settings/`, routes.post.user.update.settings);
app.post(`/api/${version}/user/:login/update/advanced/`, routes.post.user.update.advanced);
// solution
app.get(`/api/${version}/solution/liked/`, authenticate, routes.get.solution.getByLiked);
app.get(`/api/${version}/solution/:id/`, [authenticate, checkSolution], routes.get.solution.getById);
app.get(`/api/${version}/solution/task/:id/`, [authenticate, checkSolution], routes.get.solution.getByTaskId);
app.post(`/api/${version}/solution/like/`, authenticate, routes.post.solution.like);
// login
app.post(`/api/${version}/login/`, routes.post.login);
app.post(`/api/${version}/logout/`, routes.post.logout);
app.post(`/api/${version}/registration/`, routes.post.registration);
// upload
app.post(`/api/${version}/upload/`, authenticate, routes.post.upload);
// version
app.get("/api/version/", routes.get.version);
// statistics
app.get(`/api/${version}/system/ram/`, routes.get.system.ram);
app.get(`/api/${version}/system/cpu/`, routes.get.system.cpu);
app.get(`/api/${version}/system/info/`, routes.get.system.info);
app.get(`/api/${version}/system/app/`, routes.get.system.app);

app.listen(8080);