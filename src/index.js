const express = require("express");
const cors = require("cors");

//const movies = require("./data/movies.json");
//const users = require("./data/users.json");

//configura base de datos
const Database = require("better-sqlite3");
const db = new Database("./src/db/database.db", { verbose: console.log });

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

server.set("view engine", "ejs");

// arrancar servidor
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//endpoint para enviar las peliculas, filtrado por genero y orden
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
    resp.json({
      success: true,
      movies: movies,
    });
  }
});

//endpoint para enviar el login
server.post("/login", (req, resp) => {
  const email = req.body.email;
  const password = req.body.password;
  const query = db.prepare(`
      SELECT *
        FROM users
          WHERE email = ? AND password = ?`);
  const user = query.get(email, password);

  if (user) {
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
//endpoint de sign-up, Registro de nuevas usuarias.Comprueba que no haya una usuaria registrada con el mismo email
server.post("/sign-up", (req, resp) => {
  const querySearch = db.prepare(`
  SELECT * from users WHERE email= ?`);

  const userFound = querySearch.get(req.body.email);
  if (userFound) {
    resp.json({
      success: false,
      errorMessage: "Usuario ya existente",
    });
  } else {
    const query = db.prepare(`
    INSERT INTO users (email, password) 
    VALUES(?,?)`);
    const addUser = query.run(req.body.email, req.body.password);
    const queryId = db.prepare(`
    SELECT * 
      FROM users
      WHERE email = ?
    `);
    const newUser = queryId.get(req.body.email);
    resp.json({
      success: true,
      userId: newUser.id,
    });
  }
});

//endpoint del id de la pelicula a renderizar
server.get("/movie/:movieId", (req, res) => {
  const id = req.params.movieId;
  const query = db.prepare(`
  SELECT *
    FROM movies
      WHERE id = ?`);
  const movie = query.get(id);
  res.render("movieDetail", movie);
});

//endpoint de actualizacion de datos del login de la usuaria
server.post("/user/profile", (req, res) => {
  const profile = req.header("user-id");
  const data = req.body;

  const queryUpdate = db.prepare(
    `UPDATE users SET name=?,email=?, password=? WHERE id = ? `
  );
  const update = queryUpdate.run(data.name, data.email, data.password, profile);
  const queryId = db.prepare(`
    SELECT * 
      FROM users
      WHERE email = ?
    `);
    const user = queryId.get(data.email);
  res.json({
    success: true,
    userId: user.id,
  });
});

// Endpoint para recuperar los datos del perfil de la usuaria
server.get("/user/profile", (req, res) => {
  const userProfile = req.header("user-id");

  const query = db.prepare(`SELECT * FROM users WHERE id=?`);

  const getUser = query.get(userProfile);
  res.json({
    success: true,
    user: {
      name: getUser.name,
      email: getUser.email,
      password: getUser.password,
      id: getUser.id
    }
  });
});

//endpoint peliculas de usuario
server.get("/user/movies", (req, res) => {
  const userId = req.header("user-id");
  const movieIdsQuery = db.prepare(
    'SELECT movieId FROM rel_movies_users WHERE userId = ?'
  );
  const movieIds = movieIdsQuery.all(userId); // que nos devuelve algo como [{ movieId: 1 }, { movieId: 2 }];

  // obtenemos las interrogaciones separadas por comas
  const moviesIdsQuestions = movieIds.map((id) => '?').join(', '); // que nos devuelve '?, ?'
  // preparamos la segunda query para obtener todos los datos de las pel??culas
  const moviesQuery = db.prepare(
    `SELECT * FROM movies WHERE id IN (${moviesIdsQuestions})`
  );

  // convertimos el array de objetos de id anterior a un array de n??meros
  const moviesIdsNumbers = movieIds.map((movie) => movie.movieId); // que nos devuelve [1.0, 2.0]
  // ejecutamos segunda la query
  const movies = moviesQuery.all(moviesIdsNumbers);

  // respondemos a la petici??n con
  res.json({
    success: true,
    movies: movies,
  });
})

//servidor estatico

const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

//servidor estatico imagenes

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

// servidor de estaticos de link a estilos
const staticServerStyle = "./public";
server.use(express.static(staticServerStyle));
