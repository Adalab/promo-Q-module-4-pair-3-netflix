const express = require("express");
const cors = require("cors");
const data = require("../src/data/movies.json");

const { response } = require("express");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
server.get("/", (req, resp) => {
  resp.json(data);
});
