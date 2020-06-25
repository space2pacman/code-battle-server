let express = require("express");
let bodyParser = require("body-parser");
let routes = require("./routes");
let app = express();

app.use(bodyParser.urlencoded());

app.get("/", routes.home);
app.get("/tasks", routes.task.getAll);
app.get("/task/:id", routes.task.getById);

app.listen(8080);