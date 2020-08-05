let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let cors = require("cors");
let fileUpload = require("express-fileupload");
let authenticate = require("./middleware/authenticate");
let checkSolution = require("./middleware/checkSolution");
let app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
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
app.post("/api/user/:login/", routes.post.user.update);
// solution
app.get("/api/solution/:id/", [authenticate, checkSolution], routes.get.solution.getById);
app.get("/api/solution/task/:id/", [authenticate, checkSolution], routes.get.solution.getByTaskId);
// login
app.post("/api/login/", routes.post.login);
app.post("/api/logout/", routes.post.logout);
app.post("/api/registration/", routes.post.registration);
// upload
app.post("/api/upload/", routes.post.upload);

app.listen(8080);