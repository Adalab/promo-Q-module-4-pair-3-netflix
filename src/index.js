const express = require("express");
const cors = require("cors");

//const movies = require("./data/movies.json");
//const users = require("./data/users.json");
const Database = require("better-sqlite3");
const db = new Database("./src/db/database.db", { verbose: console.log });
const { response } = require("express");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//endpoint para enviar las peliculas
server.get("/movies", (req, resp) => {
  const gender = req.query.gender ? req.query.gender : "";
  const sortFilter = req.query.sort.toUpperCase();

  if (gender != "") {
    const query = db.prepare(`
      SELECT *
        FROM movies
          WHERE gender = ?
          ORDER BY title ${sortFilter}`);
    const movies = query.all(gender);
    console.log(movies);
    resp.json({
      success: true,
      movies: movies,
    });
  } else {
    const query = db.prepare(`
      SELECT *
        FROM movies
          ORDER BY title ${sortFilter}`);
    const movies = query.all();
    console.log(movies);
    resp.json({
      success: true,
      movies: movies,
    });
  }
});

//endpoint para enviar las peliculas
server.post("/login", (req, resp) => {
  const email = req.body.email;
  const password = req.body.password;
  const query = db.prepare(`
      SELECT *
        FROM users
          WHERE email = ? AND password = ?`);
  const user = query.get(email, password);

  if (user != undefined) {
    console.log(user.id);
    resp.json({
      success: true,
      userId: user.id,
    });
  } else {
    resp.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    });
  }
});
//endpoint de sign-up
server.post("/sign-up", (req, resp) => {
  //console.log(body.params);
  const querySearch = db.prepare(`
  SELECT * from users WHERE email= ?`);

  const userFound = querySearch.get(req.body.email);
  console.log(userFound);
  if (userFound != undefined) {
    resp.json({
      success: false,
      errorMessage: "Usuario ya existente",
    });
  } else {
    const query = db.prepare(`INSERT INTO users (email, password) VALUES(?,?)`);
    const newUser = query.run(req.body.email, req.body.password);
    console.log(newUser);
    resp.json({
      success: true,
      userId: newUser.id,
    });
  }
});

//servidor del id de la pelicula a renderizar

server.get("/movie/:movieId", (req, res) => {
  const id = req.params.movieId;
  //console.log(foundMovie);

  const query = db.prepare(`
  SELECT *
    FROM movies
      WHERE id = ?`);
  const movie = query.get(id);
  res.render("movieDetail", movie);
});
//endpoint de actualizacion de datos de la usuaria

//servidor estatico

const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

//servidor estatico imagenes

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

// servidor de estaticos de link a estilos
const staticServerStyle = "./public";
server.use(express.static(staticServerStyle));
