const express = require("express");
const hbs = require("express-handlebars");
const upload = require("express-fileupload");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
// const os = require('os');

const port = 8080;

const app = express();
const server = new http.Server(app);

// parse various different custom JSON types as JSON
app.use(bodyParser.json({
    type: "application/json",
}))

// parse an HTML body into a string
app.use(bodyParser.text({
    type: "text/html",
}))


require(path.join(__dirname, "renders/socket"))(server)


app.use(upload())

const files = require(path.join(__dirname, "renders/files"))
const render = require(path.join(__dirname, "renders/index"))
const api = require(path.join(__dirname, "renders/api"))

app.use(express.static(path.join(__dirname, "public")))

app.engine("hbs", hbs({
    defaultLayout: "main",
    extname: "hbs"
}))
app.set("view engine", "hbs")

app.use("/file", files)
app.use("/", render)
app.use("/api", api)

server.listen(port, () => console.log("server runing..."))