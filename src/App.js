const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const translations = require("./routers/translations");
require("dotenv").config();
const FRONT_END_URL = process.env.FRONT_END_URL;

const app = express();
app.use(
  cors({
    origin: FRONT_END_URL,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Main route");
});

//Routes

app.use("/", translations);

app.all("*", (req, res) => {
  res.status(404).json({
    msg: "Something was wrong, please check the code",
    reqMethod: req.method,
    reqPath: req.path,
    reqQuery: req.query,
    reqBody: req.body,
  });
});

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: "Internal server error",
  });
};

app.use(errorHandler);

module.exports = app;
