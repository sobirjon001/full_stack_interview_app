// import librarie
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
const questionRouter = require("./api/questions/question.router");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");

// server settings
const port = process.env.PORT || 7000;

// app settings
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// open web_based application
app.use(express.static("./html"));

// sanity check
app.get("/api/hello", (req, res) => {
  res.status(200);
  //res.send("Hello World!");
  res.json({
    success: true,
    message: "API server is alive!",
  });
});

// all user end points
app.use("/api/users", userRouter);

// all questions end points
app.use("/api/questions", questionRouter);

// create swagger documentation
const yaml = require("yamljs");
const openApiDocumentation = yaml.load("./swagger/swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// start the server
app.listen(port, (error) => {
  if (error) return console.log(`Error: ${error}`);
  console.log(`Server listening on port ${port}`);
});
