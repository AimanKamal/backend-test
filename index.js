const express = require("express");
const http = require("http");

// import routes
const postRoutes = require("./api/routes/posts");

// init app
const app = express();

// routing
app.use("", postRoutes);

// init server
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log("App is listening on port " + port)
})