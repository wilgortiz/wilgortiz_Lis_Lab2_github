/*
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    key: document.getElementById("key").value,
  };
  fetch("/getinto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((response) => {
    if (response.status === 200) {
      response.json().then((data) => {
        const token = data.token;

        localStorage.setItem("token", token); // Almacenamos el token en localStorage
        redirigirMain();
      });
    } else {
      response.json().then((data) => {
        let messageError = document.getElementById("messageError");
        messageError.classList.remove("d-none");
        messageError.textContent = "Email or Key incorrect";
      });
    }
  });
});

// function redirigirMain() {
//   const token = localStorage.getItem("token");
//   console.log("token hecho");
//   console.log(token);
//   fetch("/main", {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${token}`, // Envía el token en el encabezado de autorización.
//     },
//   }).then((response) => {
//     if (response.status === 200) {
//       window.location.href = "/main"; // Redirige al usuario a la página principal si la respuesta es exitosa
//     } else {
//       // Aquí puedes manejar casos de respuesta no exitosa, como 401 (No autorizado) u otros errores
//     }
//   });
// }

function redirigirMain() {
  const token = localStorage.getItem("token");

  fetch("/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Envía el token en el encabezado de autorización.
    },
  })
    .then((response) => response.text())
    .then((data) => {
      document.open();
      document.write(data);
      document.close();
    });
}
*/











/*
//funciona perfecto sin pacientes
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    key: document.getElementById("key").value,
  };

  fetch("/getinto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          const token = data.token;
          localStorage.setItem("token", token); // Almacena el token en localStorage
          redirigirMain();
        });
      } else {
        return response.json().then((data) => {
          let messageError = document.getElementById("messageError");
          messageError.classList.remove("d-none");
          messageError.textContent = "Email or Key incorrect";
        });
      }
    })
    .catch((error) => {
      console.error("Error durante el login:", error);
    });
});

function redirigirMain() {
  const token = localStorage.getItem("token");

  fetch("/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Envía el token en el encabezado de autorización.
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la página principal:", response.status);
        // Aquí puedes manejar casos de respuesta no exitosa, como 401 (No autorizado) u otros errores
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
}
*/











//public/scriptAuth.js





















/*
//no funciona la recarga de pagina, pero el resto anda de diez, es la base
//public/scriptAuth.js
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    key: document.getElementById("key").value,
  };

  fetch("/getinto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          if (data.redirect) {
            // Para pacientes
            window.location.href = `${data.redirect}/${data.userId}`;
          } else {
            // Para otros roles
            localStorage.setItem("token", data.token);
            redirigirMain();
          }
        });
      } else {
        return response.json().then((data) => {
          let messageError = document.getElementById("messageError");
          messageError.classList.remove("d-none");
          messageError.textContent = "Email or Key incorrect";
        });
      }
    })
    .catch((error) => {
      console.error("Error durante el login:", error);
    });
});

function redirigirMain() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found");
    return;
  }

  fetch("/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la página principal:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
}
*/










/*
// public/scriptAuth.js
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    key: document.getElementById("key").value,
  };

  fetch("/getinto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          if (data.redirect) {
            // Para pacientes
            localStorage.setItem("currentPage", `${data.redirect}/${data.userId}`);
            window.location.href = `${data.redirect}/${data.userId}`;
          } else {
            // Para otros roles
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentPage", "/main");
            redirigirMain();
          }
        });
      } else {
        return response.json().then((data) => {
          let messageError = document.getElementById("messageError");
          messageError.classList.remove("d-none");
          messageError.textContent = "Email or Key incorrect";
        });
      }
    })
    .catch((error) => {
      console.error("Error durante el login:", error);
    });
});

function redirigirMain() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found");
    return;
  }

  fetch("/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la página principal:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
}

// Al cargar la página, redirigir a la última página visitada si existe
window.addEventListener("load", () => {
  const currentPage = localStorage.getItem("currentPage");
  const token = localStorage.getItem("token");

  if (currentPage && token) {
    fetch(currentPage, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la última página visitada:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
  }
});
*/



/*
//mejorar
// public/scriptAuth.js
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    key: document.getElementById("key").value,
  };

  fetch("/getinto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          if (data.redirect) {
            // Para pacientes
            localStorage.setItem("currentPage", `${data.redirect}/${data.userId}`);
            window.location.href = `${data.redirect}/${data.userId}`;
          } else {
            // Para otros roles
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentPage", "/main");
            redirigirMain();
          }
        });
      } else {
        return response.json().then((data) => {
          let messageError = document.getElementById("messageError");
          messageError.classList.remove("d-none");
          messageError.textContent = "Email or Key incorrect";
        });
      }
    })
    .catch((error) => {
      console.error("Error durante el login:", error);
    });
});

function redirigirMain() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found");
    return;
  }

  fetch("/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la página principal:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
}

// Al cargar la página, redirigir a la última página visitada si existe
window.addEventListener("load", () => {
  console.log("entra");
  const currentPage = localStorage.getItem("currentPage");
  console.log("la pagina es:" + currentPage);
  const token = localStorage.getItem("token");

  if (currentPage && token) {
    fetch(currentPage, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la última página visitada:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
  }
});
*/










// public/scriptAuth.js
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    key: document.getElementById("key").value,
  };

  try {
    const response = await fetch("/getinto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data.redirect) {
        // Para pacientes
        localStorage.setItem("currentPage", `${data.redirect}/${data.userId}`);
        window.location.href = `${data.redirect}/${data.userId}`;
      } else {
        // Para otros roles
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentPage", "/main");
        redirigirMain();
      }
    } else {
      const data = await response.json();
      let messageError = document.getElementById("messageError");
      messageError.classList.remove("d-none");
      messageError.textContent = "Email o clave incorrecta";
    }
  } catch (error) {
    console.error("Error durante el login:", error);
  }
});

function redirigirMain() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found");
    return;
  }

  fetch("/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la página principal:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
}

// Al cargar la página, redirigir a la última página visitada si existe
window.addEventListener("load", () => {
  const currentPage = localStorage.getItem("currentPage");
  const token = localStorage.getItem("token");

  if (currentPage && token) {
    fetch(currentPage, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.text().then((data) => {
            document.open();
            document.write(data);
            document.close();
          });
        } else {
          console.error("Error al redirigir a la última página visitada:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error durante la redirección:", error);
      });
  }
});














/*
//no anda
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    email: document.getElementById("email").value,
    key: document.getElementById("key").value,
  };

  fetch("/login/getinto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json().then((data) => {
          const token = data.token;
          if (token) {
            localStorage.setItem("token", token); // Almacena el token en localStorage
            redirigirMain();
          } else {
            window.location.href = "/patient"; // Redirige al portal del paciente si no hay token
          }
        });
      } else {
        return response.json().then((data) => {
          let messageError = document.getElementById("messageError");
          messageError.classList.remove("d-none");
          messageError.textContent = data.mensaje || "Email or Key incorrect";
        });
      }
    })
    .catch((error) => {
      console.error("Error durante el login:", error);
    });
});

function redirigirMain() {
  const token = localStorage.getItem("token");

  fetch("/login/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Envía el token en el encabezado de autorización.
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text().then((data) => {
          document.open();
          document.write(data);
          document.close();
        });
      } else {
        console.error("Error al redirigir a la página principal:", response.status);
      }
    })
    .catch((error) => {
      console.error("Error durante la redirección:", error);
    });
}
*/