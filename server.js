let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let cors = require("cors");
let app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
// task
app.get("/", routes.get.home);
app.get("/api/tasks/", routes.get.task.getAll);
app.get("/api/task/:id/", routes.get.task.getById);
// profile
app.get("/api/profile/:login", routes.get.profile.getByLogin)
app.post("/api/task/test/", routes.post.task.test)

app.listen(8080);