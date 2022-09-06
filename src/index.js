const express = require("express");
const cors = require("cors");

const movies = require("./data/movies.json");

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
  console.log(sortFilter);
  const filterGender = movies.filter((movie) => movie.gender.includes(gender));
  resp.json({
      "success": true,
      "movies": filterGender
    });
  
  
});
