let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let app = express();

app.use(bodyParser.urlencoded());

app.get("/", routes.get.home);
app.get("/tasks", routes.get.task.getAll);
app.get("/task/:id", routes.get.task.getById);

app.post("/task/test", routes.post.task.check)

app.listen(8080);