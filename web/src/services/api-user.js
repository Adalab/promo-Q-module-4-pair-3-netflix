// login

const sendLoginToApi = (data) => {
  console.log("Se están enviando datos al login:", data);
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch(
    `http://localhost:4000/login/?email=${data.email}&password=${data.password}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return data;
    });
};

// signup

const sendSingUpToApi = (data) => {
  console.log("Se están enviando datos al signup:", data);
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch("http://localhost:4000/sign-up", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

// profile

const sendProfileToApi = (userId, data) => {
  console.log("Se están enviando datos al profile:", userId, data);

  return fetch("http://localhost:4000/user/profile", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

const getProfileFromApi = (userId) => {
  console.log("Se están pidiendo datos del profile del usuario:", userId);
  return fetch("http://localhost:4000/user/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.user);
      return data.user;
    });
};

// user movies

const getUserMoviesFromApi = (userId) => {
  console.log(
    "Se están pidiendo datos de las películas de la usuaria:",
    userId
  );
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  return fetch("http://localhost:4000/user/movies", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "user-id": userId,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return data;
    });
};

const objToExport = {
  sendLoginToApi: sendLoginToApi,
  sendSingUpToApi: sendSingUpToApi,
  sendProfileToApi: sendProfileToApi,
  getProfileFromApi: getProfileFromApi,
  getUserMoviesFromApi: getUserMoviesFromApi,
};

export default objToExport;
