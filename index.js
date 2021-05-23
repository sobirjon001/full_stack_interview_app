// import librarie
const express = require("express");
const app = express();
const initialise = require("./api/database/firstBootInitialize");
const userRouter = require("./api/users/user.router");
const questionRouter = require("./api/questions/question.router");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const https = require("https");

// first initialisation
initialise();

// server settings
const port = process.env.PORT || 7000;
const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
const certificate = fs.readFileSync("sslcert/server.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

// app settings
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());

// open web_based application
app.use("/app", express.static("./app"));

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
const openApiDocumentation = yaml.load("./api/swagger/swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// start the server
const httpsServet = https.createServer(credentials, app);
httpsServet.listen(port, (error) => {
  if (error) return console.log(`Error: ${error}`);
  console.log(`Server listening on port ${port}`);
});
// app.listen(port, (error) => {
//   if (error) return console.log(`Error: ${error}`);
//   console.log(`Server listening on port ${port}`);
// });
