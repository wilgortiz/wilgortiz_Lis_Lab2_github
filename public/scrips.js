const opcionesMenu = document.querySelectorAll("a.enlace");

opcionesMenu.forEach((opcion) => {
  opcion.addEventListener("click", (e) => {
    e.preventDefault();
    const id = opcion.getAttribute("id");
    fetch(`/main/${id}`)
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("#contenido-derecho").innerHTML = data;
        nuevosEnlaces();
      });
  });
});

function nuevosEnlaces() {
  const linksUsuarios = document.querySelectorAll(".enlace-usuario");
  linksUsuarios.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const id = enlace.getAttribute("id");
      fetch(`/main/patient/${id}`)
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-derecho").innerHTML = data;
          if (id == "add") {
            enlaceAgregar();
          } else {
            nuevosEnlacesUpdate();
          }
        });
    });
  });

  function enlaceAgregar() {
    let btnagregar = document.getElementById("btnagregar");
    btnagregar.addEventListener("click", (e) => {
      e.preventDefault();
      let dni = document.getElementById("dni").value;
      let first_name = document.getElementById("first_name").value;
      let last_name = document.getElementById("last_name").value;
      let phone = document.getElementById("phone").value;
      let email = document.getElementById("email").value;
      let clave = document.getElementById("clave".value);
      let gender = document.getElementById("gender").value;
      let location = document.getElementById("location").value;
      let birthdate = document.getElementById("birthdate").value;

      let patient = {
        dni: dni,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        clave: clave,
        gender: gender,
        location: location,
        birthdate: birthdate,
      };

      fetch("/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-derecho").innerHTML = data;

        });
    });
  }

  function nuevosEnlacesUpdate() {
    const updates = document.querySelectorAll("a.update2");
    updates.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        const id = opcion.getAttribute("id");
        const patient = { id: id };

        fetch("/main/patient/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patient),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#contenido-derecho").innerHTML = data;
            enlaceUpdate()
          });
      });
    });

    function enlaceUpdate() {
      let btnupdate = document.getElementById("btnupdate");
      btnupdate.addEventListener("click", (e) => {
        e.preventDefault();
        let id = document.getElementById("id").value;
        let dni = document.getElementById("dni").value;
        let first_name = document.getElementById("first_name").value;
        let last_name = document.getElementById("last_name").value;
        let phone = document.getElementById("phone").value;
        let email = document.getElementById("email").value;
        let clave = document.getElementById("clave".value);
        let gender = document.getElementById("gender").value;
        let location = document.getElementById("location").value;
        let active = document.getElementById("active").value;
        let birthdate = document.getElementById("birthdate").value;

        let patient = {
          id: id,
          dni: dni,
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          email: email,
          clave: clave,
          gender: gender,
          location: location,
          active: active,
          birthdate: birthdate,
        };

        fetch("/main/patient/updateUser/newUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patient),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#contenido-derecho").innerHTML = data;

          });
      });
    }

    const deletes = document.querySelectorAll("a.delete");
    deletes.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        const id = opcion.getAttribute("id");
        const patient = { id: id };
        fetch("/main/patient/deleteUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patient),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#contenido-derecho").innerHTML = data;
          });
      });
    });

    const search = document.getElementById("search");
    search.addEventListener("click", (e) => {
      e.preventDefault();
      let usuario = {};
      let inputDni = document.getElementById("dni");
      let inputlastName = document.getElementById("last_name");
      let inputemail = document.getElementById("email");
      usuario.dni = inputDni.value;
      usuario.last_name = inputlastName.value;
      usuario.email = inputemail.value;

      fetch("/searchUser", {
        //cabecera de tipo json
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        //convertimos el objeto js a string para poder mostrarlo
        body: JSON.stringify(usuario),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-derecho").innerHTML = data;
          nuevosEnlacesUpdate();
        });
    });
  }
}
