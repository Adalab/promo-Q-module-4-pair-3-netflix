const express = require("express");
const cors = require("cors");

const movies = require("./data/movies.json");
const users = require("./data/users.json");

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

//endpoint para enviar las peliculas
server.get("/movies", (req, resp) => {
  const gender = req.query.gender ? req.query.gender : '';
  const sortFilter = req.query.sort ? req.query.sort : '';
  if(sortFilter === 'asc'){
    movies.sort(function (a, b) {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    })
  } else if (sortFilter === 'desc') {
    movies.sort(function (a, b) {
      if (a.title < b.title) {
        return 1;
      }
      if (a.title > b.title) {
        return -1;
      }
      return 0;
    })
  }
  const filterGender = movies.filter((movie) => movie.gender.includes(gender));
  resp.json({
      "success": true,
      "movies": filterGender
    }); 
});

//endpoint para enviar las peliculas
server.post("/login", (req, resp) => {
  console.log(req.body);
  users.find((user) => {
    if (user.email === req.body.email && user.password === req.body.password) {
      resp.json({
        "success": true,
        "userId": "id_de_la_usuaria_encontrada"
      })
    } resp.json({
      "success": false,
      "errorMessage": "Usuaria/o no encontrada/o"
    })
  })

});

//servidor estatico

const staticServerPath = ('./src/public-react');
server.use(express.static(staticServerPath));

//servidor estatico imagenes

const staticServerPathImages = ('./src/public-movies-images');
server.use(express.static(staticServerPathImages));