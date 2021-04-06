// import librarie
import express from "express";
const app = express();
import userRouter from "./api/users/user.router";
import fs from "fs";

// server settings
const port = process.env.PORT || 7000;

// app settings
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// sanity check
app.get("/api/hello", (req, res) => {
  res.status(200).send("Hello World!").json({
    success: true,
    message: "API server is alive!",
  });
});

// api documentation page
app.get("/api/doc", (req, res) => {
  fs.readFile("./html/api_doc.html", (error, data) => {
    res.writeHead(200, {
      "content-Type": "text/html",
      "Content-Length": data.length,
    });
    res.write(data);
    res.end();
  });
});

// all user end points
app.use("/api/users", userRouter);

// start the server
app.listen(port, (error) => {
  if (error) return console.log(`Error: ${error}`);
  console.log(`Server listening on port ${port}`);
});
