//const { render } = require("../app");
//scripsPatient.js
const opcionesMenu = document.querySelectorAll("a.enlace");


window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('SignOff').style.display = 'none';
  document.getElementById('NavSignOff').style.display = 'none';
});

const SignOff = document.getElementById("SignOff");
SignOff.addEventListener("click", (e) => {
  e.preventDefault();
  if (document.getElementById("NavSignOff").classList.contains('d-none')) {
    document.getElementById("NavSignOff").classList.remove("d-none");
    let btnClosed = document.getElementById("btnClosed");
    btnClosed.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      console.log("Token removed from localStorage"); // Log para verificar la eliminación del token
      console.log("Token in localStorage after removal:", localStorage.getItem("token")); // Verifica el estado del token en localStorage
      document.getElementById("NavSignOff").classList.add("d-none");

      // Agregar retraso de 10 segundos antes de redirigir
      setTimeout(() => {
        window.location.href = "/";
      }, 10000); // 10 segundos
    });
  } else {
    document.getElementById("NavSignOff").classList.add("d-none");
  }
});



document.getElementById('newSignOffButton').addEventListener('click', function (event) {
  event.preventDefault(); // Evita que el enlace siga su acción predeterminada

  // Pregunta al usuario si está seguro de cerrar sesión
  //if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
  localStorage.removeItem('token'); // Elimina el token del localStorage
  console.log("Token removed from localStorage"); // Log para verificar la eliminación del token
  console.log("Token in localStorage after removal:", localStorage.getItem("token")); // Verifica el estado del token en localStorage

  // Redirige al usuario después de 5 segundos
  // setTimeout(() => {
  window.location.href = "/";
  //}, 5000); // 5 segundos

});



/*
const SignOff = document.getElementById("SignOff");
SignOff.addEventListener("click", (e) => {
  e.preventDefault();
  if (document.getElementById("NavSignOff").classList.contains('d-none')) {
    document.getElementById("NavSignOff").classList.remove("d-none");
    let btnClosed = document.getElementById("btnClosed");
    btnClosed.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      document.getElementById("NavSignOff").classList.add("d-none");
      //window.location.href = "/login";
      window.location.href = "/";
    });
  } else {
    document.getElementById("NavSignOff").classList.add("d-none");
  }

});
*/








opcionesMenu.forEach((opcion) => {
  opcion.addEventListener("click", (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");
    console.log(token);
    const id = opcion.getAttribute("id");
    fetch(`/main/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("#contenido-derecho").innerHTML = data;
        if (id == "patient") {
          nuevosEnlacesPatient();
        } else if (id == "exam") {
          enlacesExam();
        } else if (id == "order") {
          enlacesOrder();
        } else if (id == "user") {
          enlacesUser();
        }
      });
  });
});

//ENLACES PARA USERS
function enlacesUser() {
  let btnAddUser = document.getElementById("btnAddUser");
  let divInvisible = document.getElementById("invisible");
  let btnUpdateUser = document.querySelectorAll('.btnUpdateUser')
  let btnDeleteUser = document.querySelectorAll('.btnDeleteUser')
  let btnSearchUser = document.getElementById('btnSearchUser')

  btnSearchUser.addEventListener("click", (e) => {
    let dni = document.getElementById("dniUserSearch").value;
    console.log(dni)
    let user = {
      dni: dni,
    };
    fetch("/user/searchUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((respose) => respose.text())
      .then((data) => {
        document.querySelector("#tabla-users").innerHTML = data;
        enlacesUser();
      });
  });


  btnAddUser.addEventListener("click", (e) => {
    e.preventDefault();
    divInvisible.classList.remove("invisible");
    fetch("/user/addUser")
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("#contenedor-flotante").innerHTML = data;
        document.querySelector("#viewUser").classList.add("opacity-50");

        let btnCerrarFlot = document.getElementById("btnCerrarFlot");
        btnCerrarFlot.addEventListener("click", (e) => {
          e.preventDefault();
          divInvisible.classList.add("invisible");
          document.querySelector("#viewUser").classList.remove("opacity-50");
          enlacesUser();
        });

        let btnRegisterUser = document.getElementById("btnRegisterUser");
        btnRegisterUser.addEventListener("click", (e) => {
          e.preventDefault();
          const user = {
            first_name: document.getElementById("firstName").value,
            last_name: document.getElementById("lastName").value,
            dni: document.getElementById("dni").value,
            email: document.getElementById("email").value,
            rol: document.getElementById("rol").value,
          };
          fetch("/user/registerUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          })
            .then((response) => response.text())
            .then((data) => {
              document
                .querySelector("#viewUser")
                .classList.remove("opacity-50");
              document.querySelector("#contenido-derecho").innerHTML = data;
              divInvisible.classList.add("invisible");
              enlacesUser();
            });
        });
      });
  });





  btnUpdateUser.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      let user = {
        id: id,
      };
      fetch("/user/updateUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.text())
        .then((data) => {
          divInvisible.classList.remove("invisible");
          document
            .querySelector("#viewUser")
            .classList.add("opacity-50");
          document.querySelector("#contenedor-flotante").innerHTML = data;

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            document
              .querySelector("#viewUser")
              .classList.remove("opacity-50");
          });

          let btnRegNewUser = document.getElementById(
            "btnRegNewUser"
          );
          btnRegNewUser.addEventListener("click", (e) => {
            e.preventDefault();
            let active = false;
            if (document.getElementById("active").checked) {
              active = true;
            }
            let newUser = {
              id: document.getElementById('idNewUser').value,
              first_name: document.getElementById("firstName").value,
              last_name: document.getElementById("lastName").value,
              dni: document.getElementById("dni").value,
              email: document.getElementById("email").value,
              rol: document.getElementById("rol").value,
              active: active,
            };
            fetch("/user/regUpdateUser", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(newUser),
            })
              .then((response) => response.text())
              .then((data) => {
                document.querySelector("#contenido-derecho").innerHTML = data;
                divInvisible.classList.add("invisible");
                document
                  .querySelector("#viewUser")
                  .classList.remove("opacity-50");
                enlacesUser();
              });
          });
        });
    });
  });

  btnDeleteUser.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      const user = {
        id: opcion.getAttribute("id"),
      };
      fetch("/user/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-derecho").innerHTML = data;
          enlacesUser();
        });
    });
  });
}



/*
//ENLACES PARA ORDENES
function enlacesOrder() {
  let divInvisible = document.getElementById("invisible");
  let btnAddOrder = document.getElementById("btnAddOrder");
  let btnViewExam = document.querySelectorAll(".btnViewExam");
  let btnAddExam = document.getElementById("btnAddExam");
  let btnUpdateOrder = document.getElementById("btnUpdateOrder");
  let btnViewSamples = document.querySelectorAll(".btnViewSamples");
  let btnDeliverSamples = document.querySelectorAll(".btnDeliverSamples");







  btnAddOrder.addEventListener("click", (e) => {
    e.preventDefault();
    divInvisible.classList.remove("invisible");
    fetch("/order/addPatient")
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("#contenedor-flotante").innerHTML = data;
        document.querySelector("#viewOrder").classList.add("opacity-50");

        let btnCerrarFlot = document.getElementById("btnCerrarFlot");
        btnCerrarFlot.addEventListener("click", (e) => {
          e.preventDefault();
          divInvisible.classList.add("invisible");
          document.querySelector("#viewOrder").classList.remove("opacity-50");
          enlacesOrder();
        });

        let btnAddPatient = document.querySelectorAll(".btnAddPatient");

        btnAddPatient.forEach((option) => {
          option.addEventListener("click", (e) => {
            e.preventDefault();
            const patient = {
              id: option.getAttribute("id"),
            };
            fetch("/order/addOrder", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(patient),
            })
              .then((response) => response.text())
              .then((data) => {
                document
                  .querySelector("#viewOrder")
                  .classList.remove("opacity-50");
                document.querySelector("#contenido-derecho").innerHTML = data;
                divInvisible.classList.add("invisible");
                enlacesOrder();
              });
          });
        });
      });
  });

  btnViewExam.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      let order = {
        id: id,
      };
      fetch("/order/viewExams", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-exam").classList.remove("d-none");
          document.querySelector("#contenido-sample").classList.add("d-none");
          document.querySelector("#contenido-exam").innerHTML = data;
          enlacesOrder();
        });
    });
  });

  btnAddExam.addEventListener("click", (e) => {
    e.preventDefault();
    divInvisible.classList.remove("invisible");
    let orderId = document.getElementById("orderId").value;
    let order = {
      id: orderId,
    };
    fetch("/order/addExam", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("#viewOrder").classList.add("opacity-50");
        document.querySelector("#contenedor-flotante").innerHTML = data;
        regExams();

        let btnCerrarFlot = document.getElementById("btnCerrarFlot");
        btnCerrarFlot.addEventListener("click", (e) => {
          e.preventDefault();
          divInvisible.classList.add("invisible");
          document.querySelector("#viewOrder").classList.remove("opacity-50");
          enlacesOrder();
        });
        function regExams() {
          let orderId = document.getElementById("orderId").value;
          let btnRegExam = document.querySelectorAll(".btnRegExam");

          btnRegExam.forEach((opcion) => {
            opcion.addEventListener("click", (e) => {
              e.preventDefault();
              let id = opcion.getAttribute("id");
              let exam = {
                id: id,
                orderId: orderId,
              };

              console.log(exam);
              fetch("/order/regExams", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify(exam),
              })
                .then((response) => response.text())
                .then((data) => {
                  document
                    .querySelector("#viewOrder")
                    .classList.add("opacity-50");
                  document.querySelector("#contenedor-flotante").innerHTML =
                    data;

                  let btnCerrarFlot = document.getElementById("btnCerrarFlot");
                  btnCerrarFlot.addEventListener("click", (e) => {
                    e.preventDefault();
                    divInvisible.classList.add("invisible");
                    document
                      .querySelector("#viewOrder")
                      .classList.remove("opacity-50");
                    enlacesOrder();
                  });
                  regExams();
                });
            });
          });
        }
      });
  });







  btnUpdateOrder.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let id = button.getAttribute("id");
      let order = { id: id };

      fetch("/order/updateOrder", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("contenedor-flotante").classList.remove("d-none");
          document.getElementById("contenedor-flotante").innerHTML = data;

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          if (btnCerrarFlot) {
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              document.getElementById("contenedor-flotante").classList.add("d-none");
            });
          }

          let btnRegNewOrder = document.getElementById("btnRegNewOrder");
          if (btnRegNewOrder) {
            btnRegNewOrder.addEventListener("click", (e) => {
              e.preventDefault();

              let order = {
                id: document.getElementById('orderId').value,
                patient_name: document.getElementById("updateOrderName").value,
                diagnosis: document.getElementById("updateOrderDiagnosis").value,
                pregnant: document.getElementById("updateOrderPregnant").value,
                state: document.getElementById("updateOrderState").value,
                date: document.getElementById("updateOrderDate").value,
              };

              fetch("/order/regUpdateOrder", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify(order),
              })
                .then((response) => response.text())
                .then((data) => {
                  document.getElementById("contenido-order").innerHTML = data;
                  document.getElementById("contenedor-flotante").classList.add("d-none");
                  enlacesOrder(); // Volver a añadir los eventListeners
                });
            });
          }
        });
    });
  });








  btnViewSamples.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      let order = {
        id: id,
      };
      fetch("/order/viewSamples", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document
            .querySelector("#contenido-sample")
            .classList.remove("d-none");
          document.querySelector("#contenido-exam").classList.add("d-none");
          document.querySelector("#contenido-sample").innerHTML = data;
          enlacesOrder();
        });
    });
  });










  btnDeliverSamples.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      console.log(id);
      let datos = {
        sampleId: id,
        orderId: document.getElementById("orderId").value,
        userId: document.getElementById("userId").value,
      };
      console.log(datos);
      fetch("/order/deliverSamples", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(datos),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#viewOrder").classList.add("opacity-50");
          document.querySelector("#contenedor-flotante").innerHTML = data;
          divInvisible.classList.remove("invisible");

          imprimir();
          function imprimir() {
            let btnCerrarFlot = document.getElementById("btnCerrarFlot");
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document
                .querySelector("#viewOrder")
                .classList.remove("opacity-50");
              enlacesOrder();
            });
            let bntImprimirEtiqueta = document.getElementById(
              "bntImprimirEtiqueta"
            );

            bntImprimirEtiqueta.addEventListener("click", (e) => {
              e.preventDefault();
              console.log("entro");
              let etiqueta = document.getElementById("etiqueta");

              const divClonado = etiqueta.cloneNode(true);
              const ventanaImpresion = window.open(
                "",
                "",
                "width=600,height=600"
              );
              ventanaImpresion.document.write(
                "<html><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css'><head><title>Imprimir Div</title></head><body>"
              );
              ventanaImpresion.document.write(divClonado.innerHTML);
              ventanaImpresion.document.write("</body></html>");
              ventanaImpresion.document.close();
              ventanaImpresion.onload = async function () {
                ventanaImpresion.print();
                ventanaImpresion.close();
              };
              imprimir();
            });
          }
        });
    });
  });
}
*/




/*
  // Escucha el evento click en cada botón de actualización
  btnUpdateOrder.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let id = button.getAttribute("id");
 
      // Hacer una solicitud para obtener los detalles de la orden
      fetch(`/order/getOrderDetails/${id}`)
        .then((response) => response.json())
        .then((order) => {
          // Llenar los campos del formulario con los detalles de la orden obtenidos
          document.getElementById("orderId").value = order.id;
          document.getElementById("updateOrderName").value = `${order.User.first_name} ${order.User.last_name}`;
          document.getElementById("updateOrderDiagnosis").value = order.diagnostic;
          //document.getElementById("updateOrderPregnant").value = order.pregnant;
          document.getElementById("updateOrderPregnant").value = order.pregnant ? '1' : '0';
          document.getElementById("updateOrderState").value = order.state;
          document.getElementById("updateOrderFechaIngreso").value = order.fechaIngreso.substring(0, 10);
          document.getElementById("updateOrderFechaEntregaResultados").value = order.fechaEntregaResultados.substring(0, 10);
 
          // Mostrar el formulario de actualización
          document.getElementById("formUpdateOrder").classList.remove("d-none");
        })
        .catch((error) => {
          console.error('Error al obtener detalles de la orden:', error);
        });
    });
  });
 
  // Escucha el evento submit del formulario de actualización
  let formUpdateOrder = document.getElementById("formUpdateOrder");
  if (formUpdateOrder) {
    formUpdateOrder.addEventListener("submit", (e) => {
      e.preventDefault();
 
      // Construir el objeto con los datos actualizados de la orden
 
      let updatedOrder = {
        id: document.getElementById("orderId").value,
        patient_name: document.getElementById("updateOrderName").value,
        diagnostic: document.getElementById("updateOrderDiagnosis").value,
        //pregnant: document.getElementById("updateOrderPregnant").value === 'true',
        pregnant: document.getElementById("updateOrderPregnant").value === '1' ? 1 : 0,
 
        state: document.getElementById("updateOrderState").value,
        fechaIngreso: document.getElementById("updateOrderFechaIngreso").value,
        fechaEntregaResultados: document.getElementById("updateOrderFechaEntregaResultados").value,
      };
 
 
      // Enviar la solicitud POST para actualizar la orden
      fetch('/order/regUpdateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      })
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error('Error al actualizar la orden');
          }
        })
        .then(data => {
          console.log('Orden actualizada:', data);
          document.getElementById("formUpdateOrder").classList.add("d-none");
          enlacesOrder();
        })
        .catch(error => {
          console.error('Error al actualizar la orden:', error);
        });
    });
  }
}
 
 
// Llamar a la función para configurar los enlaces y eventos
document.addEventListener("DOMContentLoaded", () => {
  enlacesOrder();
});
*/




/*
//ordenes medianamente andandp
function enlacesOrder() {
  let divInvisible = document.getElementById("invisible");
  let btnAddOrder = document.getElementById("btnAddOrder");
  let btnViewExam = document.querySelectorAll(".btnViewExam");
  let btnAddExam = document.getElementById("btnAddExam");
  let btnUpdateOrder = document.querySelectorAll(".btnUpdateOrder");
  let btnViewSamples = document.querySelectorAll(".btnViewSamples");
  let btnDeliverSamples = document.querySelectorAll(".btnDeliverSamples");
  //let btnEliminarExam = document.querySelectorAll(".btnEliminarExam"); // Agregado el selector para los botones de eliminación de exámenes


  if (btnAddOrder) {
    btnAddOrder.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      fetch("/order/addPatient")
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenedor-flotante").innerHTML = data;
          document.querySelector("#viewOrder").classList.add("opacity-50");

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          if (btnCerrarFlot) {
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document.querySelector("#viewOrder").classList.remove("opacity-50");
              enlacesOrder();
            });
          }

          let btnAddPatient = document.querySelectorAll(".btnAddPatient");
          btnAddPatient.forEach((option) => {
            option.addEventListener("click", (e) => {
              e.preventDefault();
              const patient = {
                id: option.getAttribute("id"),
              };
              fetch("/order/addOrder", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(patient),
              })
                .then((response) => response.text())
                .then((data) => {
                  document.querySelector("#viewOrder").classList.remove("opacity-50");
                  document.querySelector("#contenido-derecho").innerHTML = data;
                  divInvisible.classList.add("invisible");
                  enlacesOrder();
                });
            });
          });
        });
    });
  }

  btnViewExam.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      let order = { id: id };
      fetch("/order/viewExams", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-exam").classList.remove("d-none");
          document.querySelector("#contenido-sample").classList.add("d-none");
          document.querySelector("#contenido-exam").innerHTML = data;
          enlacesOrder();
        });
    });
  });

  if (btnAddExam) {
    btnAddExam.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      let orderId = document.getElementById("orderId").value;
      let order = { id: orderId };
      fetch("/order/addExam", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#viewOrder").classList.add("opacity-50");
          document.querySelector("#contenedor-flotante").innerHTML = data;
          regExams();

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          if (btnCerrarFlot) {
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document.querySelector("#viewOrder").classList.remove("opacity-50");
              enlacesOrder();
            });
          }

          function regExams() {
            let orderId = document.getElementById("orderId").value;
            let btnRegExam = document.querySelectorAll(".btnRegExam");

            btnRegExam.forEach((opcion) => {
              opcion.addEventListener("click", (e) => {
                e.preventDefault();
                let id = opcion.getAttribute("id");
                let exam = {
                  id: id,
                  orderId: orderId,
                };

                console.log(exam);
                fetch("/order/regExams", {
                  method: "POST",
                  headers: {
                    "Content-type": "application/json",
                  },
                  body: JSON.stringify(exam),
                })
                  .then((response) => response.text())
                  .then((data) => {
                    document.querySelector("#viewOrder").classList.add("opacity-50");
                    document.querySelector("#contenedor-flotante").innerHTML = data;

                    let btnCerrarFlot = document.getElementById("btnCerrarFlot");
                    if (btnCerrarFlot) {
                      btnCerrarFlot.addEventListener("click", (e) => {
                        e.preventDefault();
                        divInvisible.classList.add("invisible");
                        document.querySelector("#viewOrder").classList.remove("opacity-50");
                        enlacesOrder();
                      });
                    }
                    regExams();
                  });
              });
            });
          }
        });
    });
  }










  document.querySelectorAll('.btnEliminarExam').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      let id = btn.getAttribute("id");
      let orderId = document.getElementById("orderId").value; // Obtener orderId desde el input oculto

      console.log(`Intentando eliminar examen. ID del examen: ${id}, ID de la orden: ${orderId}`);

      fetch("/order/removeExam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, orderId: orderId }),
      })
        .then((response) => {
          console.log('Respuesta completa del servidor:', response);
          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          if (data.success) {
            alert("Examen eliminado correctamente.");
            // Aquí puedes actualizar la vista si es necesario
          } else {
            alert("Error al eliminar el examen: " + data.message);
          }
        })
        .catch((error) => {
          console.error('Error al eliminar examen:', error);
          alert("Error al eliminar el examen. Por favor, inténtalo de nuevo más tarde.");
        });
    });
  });







  // Escucha el evento click en cada botón de actualización
  btnUpdateOrder.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let id = button.getAttribute("id");

      // Hacer una solicitud para obtener los detalles de la orden
      fetch(`/order/getOrderDetails/${id}`)
        .then((response) => response.json())
        .then((order) => {
          // Llenar los campos del formulario con los detalles de la orden obtenidos
          document.getElementById("updateOrderId").value = order.id;
          document.getElementById("updateOrderName").value = `${order.User.first_name} ${order.User.last_name}`;
          document.getElementById("updateOrderDiagnosis").value = order.diagnostic;
          document.getElementById("updateOrderPregnant").value = order.User.pregnant ? '1' : '0';
          document.getElementById("updateOrderState").value = order.state;
          document.getElementById("updateOrderFechaIngreso").value = order.fechaIngreso.substring(0, 10);
          document.getElementById("updateOrderFechaEntregaResultados").value = order.fechaEntregaResultados.substring(0, 10);

          // Mostrar el formulario de actualización
          document.getElementById("containerActualizarOrden").classList.remove("d-none");
          document.getElementById("formUpdateOrder").classList.remove("d-none");
        })
        .catch((error) => {
          console.error('Error al obtener detalles de la orden:', error);
        });
    });
  });


  // Escucha el evento submit del formulario de actualización
  document.addEventListener('DOMContentLoaded', function () {
    let formUpdateOrder = document.getElementById("formUpdateOrder");
    if (formUpdateOrder) {
      formUpdateOrder.addEventListener("submit", (e) => {
        e.preventDefault();

        // Construir el objeto con los datos actualizados de la orden
        let updatedOrder = {
          id: document.getElementById("updateOrderId").value,
          patient_name: document.getElementById("updateOrderName").value,
          diagnostic: document.getElementById("updateOrderDiagnosis").value,
          pregnant: document.getElementById("updateOrderPregnant").value === '1' ? 1 : 0,
          state: document.getElementById("updateOrderState").value,
          fechaIngreso: document.getElementById("updateOrderFechaIngreso").value,
          fechaEntregaResultados: document.getElementById("updateOrderFechaEntregaResultados").value,
        };

        console.log('Datos enviados:', updatedOrder); // Registro de depuración

        // Enviar la solicitud POST para actualizar la orden
        fetch('/order/regUpdateOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder),
        })
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('Error al actualizar la orden');
            }
          })
          .then(data => {
            console.log('Orden actualizada:', data);
            document.getElementById("formUpdateOrder").classList.add("d-none");
            // Volver a ocultar el contenedor principal si es necesario
            document.getElementById("containerActualizarOrden").classList.add("d-none");
            // Llamar a una función para actualizar la lista de órdenes
            enlacesOrder();
          })
          .catch(error => {
            console.error('Error al actualizar la orden:', error);
          });
      });
    }
   
  });





  btnViewSamples.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      let order = {
        id: id,
      };
      fetch("/order/viewSamples", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document
            .querySelector("#contenido-sample")
            .classList.remove("d-none");
          document.querySelector("#contenido-exam").classList.add("d-none");
          document.querySelector("#contenido-sample").innerHTML = data;
          enlacesOrder();
        });
    });
  });










  btnDeliverSamples.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      console.log(id);
      let datos = {
        sampleId: id,
        orderId: document.getElementById("orderId").value,
        userId: document.getElementById("userId").value,
      };
      console.log(datos);
      fetch("/order/deliverSamples", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(datos),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#viewOrder").classList.add("opacity-50");
          document.querySelector("#contenedor-flotante").innerHTML = data;
          divInvisible.classList.remove("invisible");

          imprimir();
          function imprimir() {
            let btnCerrarFlot = document.getElementById("btnCerrarFlot");
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document
                .querySelector("#viewOrder")
                .classList.remove("opacity-50");
              enlacesOrder();
            });
            let bntImprimirEtiqueta = document.getElementById(
              "btnImprimirEtiqueta"
            );

            bntImprimirEtiqueta.addEventListener("click", (e) => {
              e.preventDefault();
              console.log("entro");
              let etiqueta = document.getElementById("etiqueta");

              const divClonado = etiqueta.cloneNode(true);
              const ventanaImpresion = window.open(
                "",
                "",
                "width=600,height=600"
              );
              ventanaImpresion.document.write(
                "<html><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css'><head><title>Imprimir Div</title></head><body>"
              );
              ventanaImpresion.document.write(divClonado.innerHTML);
              ventanaImpresion.document.write("</body></html>");
              ventanaImpresion.document.close();
              ventanaImpresion.onload = async function () {
                ventanaImpresion.print();
                ventanaImpresion.close();
              };
              imprimir();
            });
          }
        });
    });
  });

}
*/


// Función para alternar la visibilidad del formulario
function toggleFormVisibility() {
  const container = document.getElementById('containerActualizarOrden');
  if (container) {
    container.classList.toggle('d-none');
  }
}

const closeButton = document.querySelector('#containerActualizarOrden .btn-close');
if (closeButton) {
  closeButton.addEventListener('click', toggleFormVisibility);
  // enlacesOrder();
}

//ordenes
function enlacesOrder() {
  let divInvisible = document.getElementById("invisible");
  let btnAddOrder = document.getElementById("btnAddOrder");
  let btnViewExam = document.querySelectorAll(".btnViewExam");
  let btnAddExam = document.getElementById("btnAddExam");
  let btnUpdateOrder = document.querySelectorAll(".btnUpdateOrder");
  //let btnUpdateStateOrder = document.querySelectorAll(".btnUpdateStateOrder");
  let btnViewSamples = document.querySelectorAll(".btnViewSamples");
  let btnDeliverSamples = document.querySelectorAll(".btnDeliverSamples");
  let btnEliminarExam = document.querySelectorAll(".btnEliminarExam");
  let btnCancelOrder = document.querySelectorAll(".btnCancelOrder");
  let btnViewResults = document.querySelectorAll(".btnViewResults");
  let btnAddResults = document.querySelectorAll(".btnAddResults");
  const modalAgregarExamen = document.getElementById('modalAgregarExamen');
  const orderIdInput = document.getElementById('orderId'); // Asegurarse de que orderIdInput esté definido
  // Obtener el token del almacenamiento local (o de donde lo estés guardando)
  const token = localStorage.getItem('token'); // Ajustar según dónde guardamos el token





  btnCancelOrder.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");

      if (confirm("¿Realmente desea eliminar esta orden? Esta acción eliminará la orden y todos los registros asociados.")) {
        fetch("/order/cancelOrderDef", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`, //para auditar
            "Content-type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert("Orden eliminada con éxito");
              //opcion.closest('tr').remove();
              enlacesOrder();
            } else {
              alert("Error al eliminar la orden: " + data.message);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert("Ocurrió un error al intentar eliminar la orden");
          });
      }
    });
  });








  if (btnAddOrder) {
    btnAddOrder.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      fetch("/order/addPatient")
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenedor-flotante").innerHTML = data;
          document.querySelector("#viewOrder").classList.add("opacity-50");

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          if (btnCerrarFlot) {
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document.querySelector("#viewOrder").classList.remove("opacity-50");
              enlacesOrder();
            });
          }

          let btnAddPatient = document.querySelectorAll(".btnAddPatient");
          btnAddPatient.forEach((option) => {
            option.addEventListener("click", (e) => {
              e.preventDefault();
              const patient = {
                id: option.getAttribute("id"),
              };
              fetch("/order/addOrder", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(patient),
              })
                .then((response) => response.text())
                .then((data) => {
                  document.querySelector("#viewOrder").classList.remove("opacity-50");
                  document.querySelector("#contenido-derecho").innerHTML = data;
                  divInvisible.classList.add("invisible");
                  enlacesOrder();
                });
            });
          });
        });
    });
  }






  // Obtener exámenes de la orden
  btnViewExam.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute('id');

      fetch(`/order/examenesDeLaOrden/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Incluir el token en el encabezado
        }
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector('#contenido-exam').classList.remove('d-none');
          document.querySelector('#contenido-sample').classList.add('d-none');
          document.querySelector('#contenido-exam').innerHTML = data;
          enlacesOrder();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  });



  /*
  //anda sin auditar
    //get examenes de la orden
    btnViewExam.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute('id');
  
        fetch(`/order/examenesDeLaOrden/${id}`, {
          method: 'GET',
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector('#contenido-exam').classList.remove('d-none');
            document.querySelector('#contenido-sample').classList.add('d-none');
            document.querySelector('#contenido-exam').innerHTML = data;
            enlacesOrder();
          });
      });
    });
  */













  // Verificar que los elementos existen antes de agregar eventos
  if (btnAddExam && orderIdInput) {
    btnAddExam.addEventListener('click', (e) => {
      e.preventDefault();
      const orderId = orderIdInput.value;

      if (!orderId) {
        console.error('Order ID no proporcionado');
        return;
      }

      divInvisible.classList.remove('invisible');

      // Agregar examen a la orden
      fetch('/order/addExam', {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',

          'Authorization': `Bearer ${token}`, // Añadir el token al encabezado

        },
        body: JSON.stringify({ orderId }),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector('#viewOrder').classList.add('opacity-50');
          document.querySelector('#contenedor-flotante').innerHTML = data;

          // Manejar el cierre del modal
          const btnCerrarFlot = document.getElementById('btnCerrarFlot');
          if (btnCerrarFlot) {
            btnCerrarFlot.addEventListener('click', (e) => {
              e.preventDefault();
              divInvisible.classList.add('invisible');
              document.querySelector('#viewOrder').classList.remove('opacity-50');
              enlacesOrder(); // Refrescar la vista de la tabla
            });
          }

          regExams(); // Reasignar eventos a los nuevos botones cargados
        })
        .catch((error) => {
          console.error('Error al agregar el examen:', error);
        });
    });
  }

  // Función para registrar exámenes
  function regExams() {
    const orderId = orderIdInput.value;
    const btnRegExam = document.querySelectorAll('.btnRegExam');

    btnRegExam.forEach((opcion) => {
      opcion.addEventListener('click', (e) => {
        e.preventDefault();
        const examId = opcion.getAttribute('id');

        fetch('/order/regExams', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId, examId }),
        })
          .then((response) => response.json()) // Asumimos que la respuesta es JSON
          .then((data) => {
            if (data.success) {
              alert('Examen agregado exitosamente');

              // Remover el examen de la lista de exámenes disponibles
              const examRow = opcion.closest('tr');
              if (examRow) {
                examRow.remove();
              }

              enlacesOrder(); // Refrescar la vista de la tabla

              // Manejar el cierre del modal
              const btnCerrarFlot = document.getElementById('btnCerrarFlot');
              if (btnCerrarFlot) {
                btnCerrarFlot.addEventListener('click', (e) => {
                  e.preventDefault();
                  divInvisible.classList.add('invisible');
                  document.querySelector('#viewOrder').classList.remove('opacity-50');
                  enlacesOrder(); // Refrescar la vista de la tabla
                });
              }
            } else {
              alert('Error al agregar el examen');
            }
          })
          .catch((error) => {
            console.error('Error al registrar el examen:', error);
          });
      });
    });
  }




  /*
  //FUNCIONA PERO SE PUEDE MEJORAR
    // Verificar que los elementos existen antes de agregar eventos
    if (btnAddExam && orderIdInput) {
      btnAddExam.addEventListener('click', (e) => {
        e.preventDefault();
        const orderId = orderIdInput.value;
  
        if (!orderId) {
          console.error('Order ID no proporcionado');
          return;
        }
  
        divInvisible.classList.remove('invisible');
  
        // Agregar examen a la orden
        fetch('/order/addExam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderId }),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector('#viewOrder').classList.add('opacity-50');
            document.querySelector('#contenedor-flotante').innerHTML = data;
  
            // Manejar el cierre del modal
            const btnCerrarFlot = document.getElementById('btnCerrarFlot');
            if (btnCerrarFlot) {
              btnCerrarFlot.addEventListener('click', (e) => {
                e.preventDefault();
                divInvisible.classList.add('invisible');
                document.querySelector('#viewOrder').classList.remove('opacity-50');
                enlacesOrder(); // Refrescar la vista de la tabla
              });
            }
  
            regExams();
          })
          .catch((error) => {
            console.error('Error al agregar el examen:', error);
          });
      });
    }
  
  
  
  
    //maso
    // Función para registrar exámenes
    function regExams() {
      const orderId = orderIdInput.value;
      const btnRegExam = document.querySelectorAll('.btnRegExam');
  
      btnRegExam.forEach((opcion) => {
        opcion.addEventListener('click', (e) => {
          e.preventDefault();
          const examId = opcion.getAttribute('id');
  
          fetch('/order/regExams', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, examId }),
          })
            .then((response) => response.json()) // Asumimos que la respuesta es JSON
            .then((data) => {
              if (data.success) {
                alert('Examen agregado exitosamente');
                //divInvisible.classList.remove("invisible");
  
                //document.querySelector('#viewOrder').classList.add('opacity-50');
                //document.querySelector('#contenedor-flotante').innerHTML = data.htmlContent;
                //document.querySelector('#contenedor-flotante').innerHTML = data.htmlContent || 'Contenido no disponible';
                //document.querySelector('#contenedor-flotante').innerHTML = ''; // Limpiar el contenido si no es necesario
                document.querySelector("#viewOrder").classList.remove("opacity-50");
                //document.querySelector("#contenido-derecho").innerHTML = data;
                divInvisible.classList.add("invisible");
                enlacesOrder();
                //regExams();
  
  
  
  
                // Manejar el cierre del modal
                const btnCerrarFlot = document.getElementById('btnCerrarFlot');
                if (btnCerrarFlot) {
                  btnCerrarFlot.addEventListener('click', (e) => {
                    e.preventDefault();
                    divInvisible.classList.add('invisible');
                    document.querySelector('#viewOrder').classList.remove('opacity-50');
                    enlacesOrder(); // Refrescar la vista de la tabla
                  });
                }
              } else {
                alert('Error al agregar el examen');
              }
            })
            .catch((error) => {
              console.error('Error al registrar el examen:', error);
            });
        });
      });
    }
  */










  /* post
  btnViewExam.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("id");
      let order = { id: id };

      //fetch("/order/viewExams", {

      fetch("/order/examenesDeLaOrden", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-exam").classList.remove("d-none");
          document.querySelector("#contenido-sample").classList.add("d-none");
          document.querySelector("#contenido-exam").innerHTML = data;
          enlacesOrder();
        });
    });
  });
*/




  //funciona perfectamente
  btnEliminarExam.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute("data-id");
      let orderId = document.getElementById("orderId").value; // Obtener orderId desde el input oculto

      console.log(`Intentando eliminar examen. ID del examen: ${id}, ID de la orden: ${orderId}`);

      fetch("/order/removeExamen2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, orderId: orderId }),
      })
        .then((response) => {
          console.log('Respuesta completa del servidor:', response);
          if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          if (data.success) {
            alert("Examen eliminado correctamente.");
            // Remover el examen de la tabla
            opcion.closest("tr").remove();
          } else {
            alert("Error al eliminar el examen: " + data.message);
          }
        })
        .catch((error) => {
          console.error('Error al eliminar examen:', error);
          alert("Error al eliminar el examen. Por favor, inténtalo de nuevo más tarde.");
        });
    });
  });


  /*
  //corrigiendo
    btnEliminarExam.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute("id");
        let orderId = document.getElementById("orderId").value; // Obtener orderId desde el input oculto
  
        console.log(`Intentando eliminar examen. ID del examen: ${id}, ID de la orden: ${orderId}`);
  
        fetch("/order/removeExamen2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, orderId: orderId }),
        })
          .then((response) => {
            console.log('Respuesta completa del servidor:', response);
            if (!response.ok) {
              throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Respuesta del servidor:", data);
            if (data.success) {
              alert("Examen eliminado correctamente.");
              enlacesOrder();
  
              // Aquí puedes actualizar la vista si es necesario
            } else {
              alert("Error al eliminar el examen: " + data.message);
            }
          })
          .catch((error) => {
            console.error('Error al eliminar examen:', error);
            alert("Error al eliminar el examen. Por favor, inténtalo de nuevo más tarde.");
          });
      });
    });
  */


  /*
  
    if (btnAddExam) {
      btnAddExam.addEventListener("click", (e) => {
        e.preventDefault();
        divInvisible.classList.remove("invisible");
        let orderId = document.getElementById("orderId").value;
        let order = { id: orderId };
        fetch("/order/addExam", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(order),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#viewOrder").classList.add("opacity-50");
            document.querySelector("#contenedor-flotante").innerHTML = data;
            regExams();
  
            let btnCerrarFlot = document.getElementById("btnCerrarFlot");
            if (btnCerrarFlot) {
              btnCerrarFlot.addEventListener("click", (e) => {
                e.preventDefault();
                divInvisible.classList.add("invisible");
                document.querySelector("#viewOrder").classList.remove("opacity-50");
                enlacesOrder();
              });
            }
  
  
  
            function regExams() {
              let orderId = document.getElementById("orderId").value;
              let btnRegExam = document.querySelectorAll(".btnRegExam");
  
              btnRegExam.forEach((opcion) => {
                opcion.addEventListener("click", (e) => {
                  e.preventDefault();
                  let id = opcion.getAttribute("id");
                  let exam = {
                    id: id,
                    orderId: orderId,
                  };
  
                  console.log(exam);
                  fetch("/order/regExams", {
                    method: "POST",
                    headers: {
                      "Content-type": "application/json",
                    },
                    body: JSON.stringify(exam),
                  })
                    .then((response) => response.text())
                    .then((data) => {
                      document.querySelector("#viewOrder").classList.add("opacity-50");
                      document.querySelector("#contenedor-flotante").innerHTML = data;
  
                      let btnCerrarFlot = document.getElementById("btnCerrarFlot");
                      if (btnCerrarFlot) {
                        btnCerrarFlot.addEventListener("click", (e) => {
                          e.preventDefault();
                          divInvisible.classList.add("invisible");
                          document.querySelector("#viewOrder").classList.remove("opacity-50");
                          enlacesOrder();
                        });
                      }
                      regExams();
                    });
                });
              });
            }
          });
      });
    }
  */


  /*
  if (btnAddExam && orderIdElement) {
    const orderId = orderIdElement.value;
 
    if (!orderId) {
      console.error('Order ID no proporcionado');
      return;
    }
 
    btnAddExam.addEventListener("click", (e) => {
      e.preventDefault();
      fetch("/order/addExam", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      })
        .then((response) => response.text())
        .then((data) => {
          const divInvisible = document.getElementById('divInvisible');
          const viewOrder = document.getElementById('viewOrder');
          const contenedorFlotante = document.getElementById('contenedorFlotante');
 
          if (divInvisible && viewOrder && contenedorFlotante) {
            divInvisible.classList.remove("invisible");
            viewOrder.classList.add("opacity-50");
            contenedorFlotante.innerHTML = data;
            setupCloseButton();
            setupRegExams();
          }
        })
        .catch((error) => {
          console.error('Error fetching exams:', error);
        });
    });
  }
 
  function setupCloseButton() {
    const btnCerrarFlot = document.getElementById("btnCerrarFlot");
    if (btnCerrarFlot) {
      btnCerrarFlot.addEventListener("click", (e) => {
        e.preventDefault();
        const divInvisible = document.getElementById('divInvisible');
        const viewOrder = document.getElementById('viewOrder');
 
        if (divInvisible && viewOrder) {
          divInvisible.classList.add("invisible");
          viewOrder.classList.remove("opacity-50");
        }
      });
    }
  }
 
  function setupRegExams() {
    const orderIdElement = document.getElementById("orderId");
    if (!orderIdElement) {
      console.error('Order ID no proporcionado');
      return;
    }
    const orderId = orderIdElement.value;
 
    const btnRegExams = document.querySelectorAll(".btnRegExam");
 
    btnRegExams.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const examId = btn.getAttribute("id");
 
        fetch("/order/regExams", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ examId, orderId }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              console.error(data.error);
              // Mostrar mensaje de error al usuario
            } else {
              console.log(data.message);
              btn.innerHTML = '<i class="fa-solid fa-check px-1 text-success"></i>';
              btn.classList.add('disabled');
            }
          })
          .catch((error) => {
            console.error('Error associating exam with order:', error);
          });
      });
    });
  }
  */



  /*
  if (btnAddExam) {
    btnAddExam.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      let orderId = document.getElementById("orderId").value;
      let order = { id: orderId };
  
      fetch("/order/addExam", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#viewOrder").classList.add("opacity-50");
          document.querySelector("#contenedor-flotante").innerHTML = data;
  
          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          if (btnCerrarFlot) {
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document.querySelector("#viewOrder").classList.remove("opacity-50");
              enlacesOrder();
            });
          }
  
          regExams(); // Asegúrate de que esta función solo se llame una vez después de actualizar la vista
        })
        .catch((error) => {
          console.error('Error fetching exams:', error);
        });
    });
  }
  
  function regExams() {
    //let orderId = document.getElementById("orderId").value;
    let btnRegExam = document.querySelectorAll(".btnRegExam");
    let exam = {
      examId: id,  // Este es el ID del examen
      orderId: orderId  // Este debe ser el ID de la orden (que corresponde al 'id' en la tabla 'orders')
    };
    
    fetch("/order/regExams", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(exam),
    })
    btnRegExam.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute("id");
        let exam = {
          id: id,
          orderId: orderId,
        };
  
        console.log(exam);
        fetch("/order/regExams", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(exam),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#viewOrder").classList.add("opacity-50");
            document.querySelector("#contenedor-flotante").innerHTML = data;
  
            let btnCerrarFlot = document.getElementById("btnCerrarFlot");
            if (btnCerrarFlot) {
              btnCerrarFlot.addEventListener("click", (e) => {
                e.preventDefault();
                divInvisible.classList.add("invisible");
                document.querySelector("#viewOrder").classList.remove("opacity-50");
                enlacesOrder();
              });
            }
          })
          .catch((error) => {
            console.error('Error associating exam with order:', error);
          });
      });
    });
  }
  */


  /*
  // Escucha el evento click en cada botón de actualización
  btnUpdateOrder.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let id = button.getAttribute("id");

      // Hacer una solicitud para obtener los detalles de la orden
      fetch(`/order/getOrderDetails/${id}`)
        .then((response) => response.json())
        .then((order) => {
          // Llenar los campos del formulario con los detalles de la orden obtenidos
          document.getElementById("updateOrderId").value = order.id;
          document.getElementById("updateOrderName").value = `${order.User.first_name} ${order.User.last_name}`;
          document.getElementById("updateOrderDiagnosis").value = order.diagnostic;
          document.getElementById("updateOrderPregnant").value = order.User.pregnant ? '1' : '0';
          document.getElementById("updateOrderState").value = order.state;
          document.getElementById("updateOrderFechaIngreso").value = order.fechaIngreso.substring(0, 10);
          document.getElementById("updateOrderFechaEntregaResultados").value = order.fechaEntregaResultados.substring(0, 10);

          // Mostrar el formulario de actualización
          document.getElementById("containerActualizarOrden").classList.remove("d-none");
          document.getElementById("formUpdateOrder").classList.remove("d-none");
        })
        .catch((error) => {
          console.error('Error al obtener detalles de la orden:', error);
        });
    });
  });

  // Escucha el evento submit del formulario de actualización
  document.addEventListener('DOMContentLoaded', function () {
    let formUpdateOrder = document.getElementById("formUpdateOrder");
    if (formUpdateOrder) {
      formUpdateOrder.addEventListener("submit", (e) => {
        e.preventDefault();

        // Construir el objeto con los datos actualizados de la orden
        let updatedOrder = {
          id: document.getElementById("updateOrderId").value,
          patient_name: document.getElementById("updateOrderName").value,
          diagnostic: document.getElementById("updateOrderDiagnosis").value,
          pregnant: document.getElementById("updateOrderPregnant").value === '1' ? 1 : 0,
          state: document.getElementById("updateOrderState").value,
          fechaIngreso: document.getElementById("updateOrderFechaIngreso").value,
          fechaEntregaResultados: document.getElementById("updateOrderFechaEntregaResultados").value,
        };

        console.log('Datos enviados:', updatedOrder); // Registro de depuración

        // Enviar la solicitud POST para actualizar la orden
        fetch('/order/regUpdateOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert('Orden actualizada exitosamente.');
              window.location.href = '/order/viewOrders'; // Redirigir a la vista de órdenes
            } else {
              alert('Error al actualizar la orden: ' + data.message);
            }
          })
          .catch(error => {
            console.error('Error al actualizar la orden:', error);
            alert('Ocurrió un error al actualizar la orden. Por favor, inténtelo nuevamente.');
          });
      });
    }
  });
*/


  // Función para alternar la visibilidad del formulario
  function toggleFormVisibility() {
    const container = document.getElementById('containerActualizarOrden');
    if (container) {
      container.classList.toggle('d-none');
    }
  }

  const closeButton = document.querySelector('#containerActualizarOrden .btn-close');
  if (closeButton) {
    closeButton.addEventListener('click', toggleFormVisibility);
    // enlacesOrder();
  }


  // Escucha el evento click en cada botón de actualización
  btnUpdateOrder.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let id = button.getAttribute("id");






      // Hacer una solicitud para obtener los detalles de la orden
      fetch(`/order/getOrderDetails/${id}`)
        .then((response) => response.json())
        .then((order) => {
          // Llenar los campos del formulario con los detalles de la orden obtenidos
          document.getElementById("updateOrderId").value = order.id;
          document.getElementById("updateOrderName").value = `${order.User.first_name} ${order.User.last_name}`;
          document.getElementById("updateOrderDiagnosis").value = order.diagnostic;
          document.getElementById("updateOrderPregnant").value = order.User.pregnant ? '1' : '0';
          document.getElementById("updateOrderState").value = order.state;
          document.getElementById("updateOrderFechaIngreso").value = order.fechaIngreso.substring(0, 10);
          document.getElementById("updateOrderFechaEntregaResultados").value = order.fechaEntregaResultados.substring(0, 10);
          document.getElementById("updateOrderObservations").value = order.observations;
          // Mostrar el formulario de actualización
          document.getElementById("containerActualizarOrden").classList.remove("d-none");
          document.getElementById("formUpdateOrder").classList.remove("d-none");


          // Mostrar el ID, nombre y apellido junto al título
          let orderDetails = `${order.id} - ${order.User.first_name} ${order.User.last_name}`;
          document.getElementById("orderDetails").textContent = orderDetails;

        })
        .catch((error) => {
          console.error('Error al obtener detalles de la orden:', error);
        });
    });
  });


  // Escucha el evento submit del formulario de actualización
  //document.addEventListener('DOMContentLoaded', function () {
  let formUpdateOrder = document.getElementById("formUpdateOrder");
  if (formUpdateOrder) {
    formUpdateOrder.addEventListener("submit", (e) => {
      e.preventDefault();

      // Construir el objeto con los datos actualizados de la orden
      let updatedOrder = {
        id: document.getElementById("updateOrderId").value,
        patient_name: document.getElementById("updateOrderName").value,
        diagnostic: document.getElementById("updateOrderDiagnosis").value,
        pregnant: document.getElementById("updateOrderPregnant").value === '1' ? 1 : 0,
        state: document.getElementById("updateOrderState").value,
        fechaIngreso: document.getElementById("updateOrderFechaIngreso").value,
        fechaEntregaResultados: document.getElementById("updateOrderFechaEntregaResultados").value,
        observations: document.getElementById("updateOrderObservations").value,
      };

      console.log('Datos enviados:', updatedOrder); // Registro de depuración

      // Enviar la solicitud POST para actualizar la orden
      fetch('/order/regUpdateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedOrder),
      })
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error('Error al actualizar la orden');
          }
        })
        .then(data => {
          alert(data);
          console.log('Orden actualizada:', data);
          document.getElementById("formUpdateOrder").classList.add("d-none");
          // Volver a ocultar el contenedor principal si es necesario
          document.getElementById("containerActualizarOrden").classList.add("d-none");

          // document.querySelector("#viewOrder").classList.add("opacity-50");
          // document.querySelector("#contenedor-flotante").innerHTML = data;


          // Llamar a una función para actualizar la lista de órdenes
          enlacesOrder();

        })
        .catch(error => {
          console.error('Error al actualizar la orden:', error);
        });
    });

    // Manejar el botón de cierre
    const closeButton = document.querySelector('#containerActualizarOrden .btn-close');
    if (closeButton) {
      closeButton.addEventListener('click', toggleFormVisibility);
      // enlacesOrder();
    }

  }







  /*
  //para actualizar estado de orden
     // Función para alternar la visibilidad del formulario
     function toggleFormVisibility2() {
      const container = document.getElementById('containerActualizarEstadoOrden');
      if (container) {
        container.classList.toggle('d-none');
      }
    }
  
    const closeButton2 = document.querySelector('#containerActualizarEstadoOrden .btn-close');
    if (closeButton2) {
      closeButton2.addEventListener('click', toggleFormVisibility2);
      // enlacesOrder();
    }
    //actualizar estado de orden
    // Escucha el evento click en cada botón de actualización
    btnUpdateStateOrder.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        let id = button.getAttribute("id");
  
  
  
  
  
  
        // Hacer una solicitud para obtener los detalles de la orden
        fetch(`/order/getStateOrderDetails/${id}`)
          .then((response) => response.json())
          .then((order) => {
            // Llenar los campos del formulario con los detalles de la orden obtenidos
            document.getElementById("updateOrderId").value = order.id;
            document.getElementById("updateOrderName2").value = `${order.User.first_name} ${order.User.last_name}`;
            //document.getElementById("updateOrderDiagnosis").value = order.diagnostic;
            //document.getElementById("updateOrderPregnant").value = order.User.pregnant ? '1' : '0';
            document.getElementById("updateOrderState").value = order.state;
            //document.getElementById("updateOrderFechaIngreso").value = order.fechaIngreso.substring(0, 10);
            //document.getElementById("updateOrderFechaEntregaResultados").value = order.fechaEntregaResultados.substring(0, 10);
            //document.getElementById("updateOrderObservations").value = order.observations;
            // Mostrar el formulario de actualización
            document.getElementById("containerActualizarEstadoOrden").classList.remove("d-none");
            document.getElementById("formUpdateStateOrder").classList.remove("d-none");
  
  
            // Mostrar el ID, nombre y apellido junto al título
            let orderDetails2 = `${order.id} - ${order.User.first_name} ${order.User.last_name}`;
            document.getElementById("orderDetails2").textContent = orderDetails2;
  
          })
          .catch((error) => {
            console.error('Error al obtener detalles de la orden:', error);
          });
      });
    });
  
  
    // Escucha el evento submit del formulario de actualización
    //document.addEventListener('DOMContentLoaded', function () {
    let formUpdateStateOrder = document.getElementById("formUpdateStateOrder");
    if (formUpdateStateOrder) {
      formUpdateStateOrder.addEventListener("submit", (e) => {
        e.preventDefault();
  
        // Construir el objeto con los datos actualizados de la orden
        let updatedStateOrder = {
          id: document.getElementById("updateOrderId").value,
          //patient_name: document.getElementById("updateOrderName").value,
          //diagnostic: document.getElementById("updateOrderDiagnosis").value,
          //pregnant: document.getElementById("updateOrderPregnant").value === '1' ? 1 : 0,
          state: document.getElementById("updateOrderState").value,
          //fechaIngreso: document.getElementById("updateOrderFechaIngreso").value,
          //fechaEntregaResultados: document.getElementById("updateOrderFechaEntregaResultados").value,
          //observations: document.getElementById("updateOrderObservations").value,
        };
  
        console.log('Datos enviados:', updatedStateOrder); // Registro de depuración
  
        // Enviar la solicitud POST para actualizar la orden
        fetch('/order/regUpdateStateOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedStateOrder),
        })
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('Error al actualizar la orden');
            }
          })
          .then(data => {
            alert(data);
            console.log('Estado de la Orden actualizada:', data);
            document.getElementById("formUpdateStateOrder").classList.add("d-none");
            // Volver a ocultar el contenedor principal si es necesario
            document.getElementById("containerActualizarEstadoOrden").classList.add("d-none");
  
            // document.querySelector("#viewOrder").classList.add("opacity-50");
            // document.querySelector("#contenedor-flotante").innerHTML = data;
  
  
            // Llamar a una función para actualizar la lista de órdenes
            enlacesOrder();
  
          })
          .catch(error => {
            console.error('Error al actualizar la orden:', error);
          });
      });
  
      // Manejar el botón de cierre
      const closeButton2 = document.querySelector('#containerActualizarEstadoOrden .btn-close');
      if (closeButton2) {
        closeButton2.addEventListener('click', toggleFormVisibility2);
        // enlacesOrder();
      }
  
    }
  */

  /*
    //botón para ver muestras DE CADA EXAMEN DE LA ORDEN. GET
    btnViewSamples.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute('id');
  
        fetch(`/order/muestrasDeLaOrden/${id}`, {
          method: 'GET',
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector('#contenido-exam').classList.add('d-none');
            document.querySelector('#contenido-sample').classList.remove('d-none');
            document.querySelector('#contenido-sample').innerHTML = data;
  
            enlacesOrder();
          });
      });
    });
  */



  //funciona perfecto
  btnViewSamples.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();
      let id = opcion.getAttribute('id');
      const token = localStorage.getItem("token");
      const role = opcion.getAttribute('data-role'); // Obtener el rol desde el atributo data-role

      if (!token) {
        console.error("No token found");
        return;
      }

      let url = `/order/muestrasDeLaOrden/${id}?role=${role}`; // Pasar el rol en la URL

      // Mostrar el token, rol y la URL en la consola para depuración
      console.log('Token:', token);
      console.log('Role:', role);
      console.log('URL:', url);

      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
        },
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector('#contenido-exam').classList.add('d-none');
          document.querySelector('#contenido-sample').classList.remove('d-none');
          document.querySelector('#contenido-sample').innerHTML = data;

          enlacesOrder();
        });
    });
  });




  /*
    //andando, POST
    btnViewSamples.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute("id");
        let order = {
          id: id,
        };
        fetch("/order/viewSamples", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(order),
        })
          .then((response) => response.text())
          .then((data) => {
            document
              .querySelector("#contenido-sample")
              .classList.remove("d-none");
            document.querySelector("#contenido-exam").classList.add("d-none");
            document.querySelector("#contenido-sample").innerHTML = data;
            enlacesOrder();
          });
      });
    });
  */

  btnDeliverSamples.forEach((opcion) => {
    opcion.addEventListener("click", (e) => {
      e.preventDefault();

      // Encontrar la fila (tr) más cercana al botón clicado
      const row = opcion.closest('tr');
      const orderId = document.getElementById('orderId').value;
      const userId = document.getElementById('userId').value;
      const userDni = document.getElementById('userDni').value;
      const currentDateTime = new Date().toLocaleString();
      const userFirstName = document.getElementById('userFirstName').value;
      const userLastName = document.getElementById('userLastName').value;

      // Crear la etiqueta
      const labelContent = `
              <div class="label-container">
                  <div class="label-content">
                      <p>Nº de Orden: ${orderId}</p>
                      <p>Código de Persona: ${userId}</p>
                      <p>Nombre: ${userFirstName} ${userLastName}</p>
                      <p>DNI: ${userDni}</p>
                      <p>Fecha y Hora: ${currentDateTime}</p>
                  </div>
              </div>
          `;

      // Crear una ventana de impresión con el contenido de la etiqueta
      const printWindow = window.open('', '', 'width=1000,height=500'); // Aumentar el tamaño de la ventana emergente
      printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Etiqueta de Muestra</title>
                <style>
                    @media print {
                        .label-container {
                            width: 4cm;
                            height: 2cm;
                            border: 1px solid #000;
                            padding: 0.1cm;
                            box-sizing: border-box;
                            overflow: hidden;
                            transform: scale(2.0); /* Aumentar el tamaño de la etiqueta en la vista previa */
                            transform-origin: top left;
                            page-break-inside: avoid;
                            margin: 0;
                        }
                        .label-content {
                            font-family: Roboto, sans-serif;
                            font-size: 10px;
                            line-height: 1.2;
                        }
                        p {
                            margin: 0;
                        }
                    }
                </style>
            </head>
            <body>
                ${labelContent}
            </body>
            </html>
        `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();

      // Cerrar la ventana de impresión (opcional)
      // printWindow.close();
    });
  });









  /*
    //andando
    btnDeliverSamples.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute("id");
        console.log(id);
        let datos = {
          sampleId: id,
          orderId: document.getElementById("orderId").value,
          userId: document.getElementById("userId").value,
        };
        console.log(datos);
        //fetch("/order/deliverSamples", {
          //method: "POST",
          //headers: {
            //"Content-type": "application/json",
          //},
          //body: JSON.stringify(datos),
        //})
        fetch("/order/deliverSamples", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            sampleId: document.getElementById("sampleId").value,  // Asegúrate de que estos elementos existan
            orderId: document.getElementById("orderId").value,
            userId: document.getElementById("userId").value,
          }),
        })
        
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#viewOrder").classList.add("opacity-50");
            document.querySelector("#contenedor-flotante").innerHTML = data;
            divInvisible.classList.remove("invisible");
  
            imprimir();
            function imprimir() {
              let btnCerrarFlot = document.getElementById("btnCerrarFlot");
              btnCerrarFlot.addEventListener("click", (e) => {
                e.preventDefault();
                divInvisible.classList.add("invisible");
                document
                  .querySelector("#viewOrder")
                  .classList.remove("opacity-50");
                enlacesOrder();
              });
              let bntImprimirEtiqueta = document.getElementById(
                "btnImprimirEtiqueta"
              );
  
              bntImprimirEtiqueta.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("entro");
                let etiqueta = document.getElementById("etiqueta");
  
                const divClonado = etiqueta.cloneNode(true);
                const ventanaImpresion = window.open(
                  "",
                  "",
                  "width=600,height=600"
                );
                ventanaImpresion.document.write(
                  "<html><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css'><head><title>Imprimir Div</title></head><body>"
                );
                ventanaImpresion.document.write(divClonado.innerHTML);
                ventanaImpresion.document.write("</body></html>");
                ventanaImpresion.document.close();
                ventanaImpresion.onload = async function () {
                  ventanaImpresion.print();
                  ventanaImpresion.close();
                };
                imprimir();
              });
            }
          });
      });
    });
    */







  /*funciona para mismos examenes y determinaciones
    btnViewResults.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute("id");
        let order = {
          id: id,
        };
        fetch("/order/viewResults", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(order),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#contenido-exam").classList.remove("d-none");
            document.querySelector("#contenido-sample").classList.add("d-none");
            document.querySelector("#contenido-exam").innerHTML = data;
            enlacesOrder();
          });
      });
    });
  */


  /*
      //andando
    btnViewResults.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute('id'); // ID de la orden
  
        fetch(`/orders/resultadosD/${id}`, {
        
          method: 'GET',
        })
          .then((response) => response.text())
          .then((data) => {
            // Mostrar los resultados en la vista flotante
            document.querySelector('#contenedor-flotante').innerHTML = data;
            divInvisible.classList.remove("invisible");
  
            let btnCerrarFlot = document.getElementById("closeResultsFlotante");
            if (btnCerrarFlot) {
              btnCerrarFlot.addEventListener("click", (e) => {
                e.preventDefault();
                divInvisible.classList.add("invisible");
                enlacesOrder(); // Re-activar los enlaces
              });
            }
          })
          .catch((error) => {
            console.error('Error al obtener los resultados:', error);
            alert('Error al obtener los resultados. Por favor, inténtalo de nuevo más tarde.');
          });
      });
    });
    */
  /*
      //funciona perfecto, sin la impresion
      btnViewResults.forEach((opcion) => {
        opcion.addEventListener("click", (e) => {
          e.preventDefault();
          let id = opcion.getAttribute('id'); // ID de la orden
      
          fetch(`/orders/resultadosD/${id}`, {
            method: 'GET',
          })
            .then((response) => response.text())
            .then((data) => {
              // Mostrar los resultados en la vista flotante
              const contenedorFlotante = document.querySelector('#contenedor-flotante');
              contenedorFlotante.innerHTML = data;
              divInvisible.classList.remove("invisible");
      
              let btnCerrarFlot = document.getElementById("closeResultsFlotante");
              if (btnCerrarFlot) {
                btnCerrarFlot.addEventListener("click", (e) => {
                  e.preventDefault();
                  divInvisible.classList.add("invisible");
                  enlacesOrder(); // Re-activar los enlaces
                });
              }
      
              // Verificar si hay valores fuera de rango
              setTimeout(() => {
                console.log('HTML renderizado:', contenedorFlotante.innerHTML); // Verifica el HTML renderizado
                const dangerRows = document.querySelectorAll('td.table-danger');
                console.log('Filas fuera de rango:', dangerRows.length); // Verifica la cantidad de filas fuera de rango
                if (dangerRows.length > 0) {
                  alert('Hay valores fuera de rango.');
                }
              }, 100); // Ajusta el tiempo según sea necesario
            })
            .catch((error) => {
              console.error('Error al obtener los resultados:', error);
              alert('Error al obtener los resultados. Por favor, inténtalo de nuevo más tarde.');
            });
        });
      });
      */




  /*
  //funciona perfecto
btnViewResults.forEach((opcion) => {
opcion.addEventListener('click', (e) => {
  e.preventDefault();
  let id = opcion.getAttribute('id'); // ID de la orden

  fetch(`/orders/resultadosD/${id}`, {
    method: 'GET',
  })
    .then(response => response.text())
    .then(data => {
      // Mostrar los resultados en la vista flotante
      const contenedorFlotante = document.querySelector('#contenedor-flotante');
      contenedorFlotante.innerHTML = data;
      divInvisible.classList.remove("invisible");

      // Verificar si hay valores fuera de rango
      setTimeout(() => {
        console.log('HTML renderizado:', contenedorFlotante.innerHTML); // Verifica el HTML renderizado
        const dangerRows = document.querySelectorAll('td.table-danger');
        console.log('Filas fuera de rango:', dangerRows.length); // Verifica la cantidad de filas fuera de rango
        if (dangerRows.length > 0) {
          alert('Hay valores fuera de rango.');
        }
      }, 100); // Ajusta el tiempo según sea necesario

      // Configurar el botón de impresión después de actualizar el DOM
      setupPrintButton();

      let btnCerrarFlot = document.getElementById("closeResultsFlotante");
      if (btnCerrarFlot) {
        btnCerrarFlot.addEventListener("click", (e) => {
          e.preventDefault();
          divInvisible.classList.add("invisible");
          enlacesOrder(); // Re-activar los enlaces
        });
      }
    })
    .catch((error) => {
      console.error('Error al obtener los resultados:', error);
      alert('Error al obtener los resultados. Por favor, inténtalo de nuevo más tarde.');
    });
});
});

function setupPrintButton() {
const btnPrintResults = document.querySelector('#printResults');
if (btnPrintResults) {
  btnPrintResults.addEventListener('click', (e) => {
    e.preventDefault();

    // Ocultar el botón de impresión
    btnPrintResults.style.display = 'none';

    // Clonar el contenido del contenedor flotante
    const contenedorClonado = document.querySelector('#contenedor-flotante').cloneNode(true);

    // Crear una nueva ventana para imprimir
    const printWindow = window.open('', '', 'height=600,width=800');

    printWindow.document.write('<html><head><title>Resultados del Paciente</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">');
    printWindow.document.write('<style>body{font-family: Roboto, sans-serif;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(contenedorClonado.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();

    // Asegurarse de que el contenido se haya cargado completamente antes de imprimir
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };

    // Mostrar el botón de impresión nuevamente después de la impresión
    printWindow.onafterprint = function () {
      btnPrintResults.style.display = '';
    };
  });
}
}
*/






  //anda, con auditoria
  btnViewResults.forEach((opcion) => {
    opcion.addEventListener('click', async (e) => {
      e.preventDefault();
      let id = opcion.getAttribute('id'); // ID de la orden

      const token = localStorage.getItem('token');
      const estadoDeOrden = opcion.getAttribute('data-estado'); // Obtener el estado desde el atributo data-role
      console.log("estadoDeOrden", estadoDeOrden);

      let url = `/orders/resultadosD/${id}?estadoDeOrden=${estadoDeOrden}`; // Pasar el estado en la URL

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los resultados');
        }

        const data = await response.text();

        // Mostrar los resultados en la vista flotante
        const contenedorFlotante = document.querySelector('#contenedor-flotante');
        contenedorFlotante.innerHTML = data;
        divInvisible.classList.remove("invisible");

        // Verificar si hay valores fuera de rango
        setTimeout(() => {
          console.log('HTML renderizado:', contenedorFlotante.innerHTML); // Verifica el HTML renderizado
          const dangerRows = document.querySelectorAll('td.table-danger');
          console.log('Filas fuera de rango:', dangerRows.length); // Verifica la cantidad de filas fuera de rango
          //if (dangerRows.length > 0) {
          //alert('Hay valores fuera de rango.');
          //}
        }, 100); // Ajusta el tiempo según sea necesario

        // Configurar el botón de impresión después de actualizar el DOM
        setupPrintButton(id, estadoDeOrden);

        let btnCerrarFlot = document.getElementById("closeResultsFlotante");
        if (btnCerrarFlot) {
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            enlacesOrder(); // Re-activar los enlaces
          });
        }
      } catch (error) {
        console.error('Error al obtener los resultados:', error);
        alert('Error al obtener los resultados. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  });
  function setupPrintButton(orderId, estadoDeOrden) {
    const btnPrintResults = document.querySelector('#printResults');
    if (btnPrintResults) {
      btnPrintResults.addEventListener('click', async (e) => {
        e.preventDefault();

        // Ocultar el botón de impresión
        btnPrintResults.style.display = 'none';

        // Clonar el contenido del contenedor flotante
        const contenedorClonado = document.querySelector('#contenedor-flotante').cloneNode(true);

        // Crear una nueva ventana para imprimir
        const printWindow = window.open('', '', 'height=600,width=800');

        printWindow.document.write('<html><head><title>Resultados del Paciente</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">');
        printWindow.document.write('<style>body{font-family: Roboto, sans-serif;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(contenedorClonado.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Asegurarse de que el contenido se haya cargado completamente antes de imprimir
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };

        // Mostrar el botón de impresión nuevamente después de la impresión
        printWindow.onafterprint = function () {
          btnPrintResults.style.display = '';
        };

        // Enviar una solicitud de auditoría
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');

        try {
          const response = await fetch('/order/auditoriasGlobales', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              entityId: null,
              entityType: 'Examen',
              userId: userId,
              userName: userName,
              userRole: userRole,
              oldValue: 'N/A', // Puedes ajustar estos valores según corresponda
              newValue: 'Impresión de resultados',
              actionType: 'Impresión de resultados',
              //estadoDeOrden: estadoDeOrden // Agregar el estado de la orden a la auditoría
            })
          });

          if (!response.ok) {
            throw new Error('Error al registrar la auditoría');
          }

          const result = await response.json();
          console.log(result.message);
        } catch (error) {
          console.error('Error al registrar la auditoría:', error);
        }
      });
    }
  }












  /*
  //anda sin auditar
  //version con restricciones
  btnViewResults.forEach((opcion) => {
    opcion.addEventListener('click', (e) => {
      e.preventDefault();
      let id = opcion.getAttribute('id'); // ID de la orden
  
      const token = localStorage.getItem('token');
      const estadoDeOrden = opcion.getAttribute('data-estado'); // Obtener el estado desde el atributo data-role
      console.log("estadoDeOrden",estadoDeOrden);
     
  
      let url = `/orders/resultadosD/${id}?estadoDeOrden=${estadoDeOrden}`; // Pasar el rol en la URL
  
      
  
      fetch(url, {
        method: 'GET',
        headers: {        
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.text())
        .then(data => {
          // Mostrar los resultados en la vista flotante
          const contenedorFlotante = document.querySelector('#contenedor-flotante');
          contenedorFlotante.innerHTML = data;
          divInvisible.classList.remove("invisible");
  
          // Verificar si hay valores fuera de rango
          setTimeout(() => {
            console.log('HTML renderizado:', contenedorFlotante.innerHTML); // Verifica el HTML renderizado
            const dangerRows = document.querySelectorAll('td.table-danger');
            console.log('Filas fuera de rango:', dangerRows.length); // Verifica la cantidad de filas fuera de rango
            //if (dangerRows.length > 0) {
              //alert('Hay valores fuera de rango.');
            //}
          }, 100); // Ajusta el tiempo según sea necesario
  
          // Configurar el botón de impresión después de actualizar el DOM
          setupPrintButton();
  
          let btnCerrarFlot = document.getElementById("closeResultsFlotante");
          if (btnCerrarFlot) {
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              enlacesOrder(); // Re-activar los enlaces
            });
          }
        })
        .catch((error) => {
          console.error('Error al obtener los resultados:', error);
          alert('Error al obtener los resultados. Por favor, inténtalo de nuevo más tarde.');
        });
    });
  });
  
  
  
  
  function setupPrintButton() {
    const btnPrintResults = document.querySelector('#printResults');
    if (btnPrintResults) {
      btnPrintResults.addEventListener('click', (e) => {
        e.preventDefault();
  
        // Ocultar el botón de impresión
        btnPrintResults.style.display = 'none';
  
        // Clonar el contenido del contenedor flotante
        const contenedorClonado = document.querySelector('#contenedor-flotante').cloneNode(true);
  
        // Crear una nueva ventana para imprimir
        const printWindow = window.open('', '', 'height=600,width=800');
  
        printWindow.document.write('<html><head><title>Resultados del Paciente</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css">');
        printWindow.document.write('<style>body{font-family: Roboto, sans-serif;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(contenedorClonado.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
  
        // Asegurarse de que el contenido se haya cargado completamente antes de imprimir
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
  
        // Mostrar el botón de impresión nuevamente después de la impresión
        printWindow.onafterprint = function () {
          btnPrintResults.style.display = '';
        };
      });
    }
  }
  */







  /*
    btnAddResults.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const orderId = button.getAttribute('id');
        const examId = button.getAttribute('data-exam-id');
  
        // Verifica los valores obtenidos
      console.log('Order ID:', orderId);
      console.log('Exam ID:', examId);
  
        fetch(`/orders/addResults/${orderId}/${examId}`, { method: 'GET' })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector('#contenedor-flotante').innerHTML = data;
            divInvisible.classList.remove('invisible');
  
            document.getElementById('btnCloseForm').addEventListener('click', (e) => {
              e.preventDefault();
              divInvisible.classList.add('invisible');
            });
  
            document.getElementById('formAddResults').addEventListener('submit', (e) => {
              e.preventDefault();
              const form = e.target;
              fetch(form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: form.orderId.value,
                  examId: form.examId.value,
                  determinantId: form.determinantId.value,
                  value: form.value.value
                })
              })
              .then((response) => response.json())
              .then((data) => {
                alert(data.message);
                divInvisible.classList.add('invisible');
              })
              .catch((error) => {
                console.error('Error al agregar el resultado:', error);
                alert('Error al agregar el resultado. Por favor, inténtalo de nuevo más tarde.');
              });
            });
          })
          .catch((error) => {
            console.error('Error al obtener el formulario:', error);
            alert('Error al obtener el formulario. Por favor, inténtalo de nuevo más tarde.');
          });
      });
    });
  */



  /*
  btnAddResults.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      let id = button.getAttribute('id');
      
      fetch(`/orders/agregarResultados/${id}`, {
        method: 'GET',
      })
      .then((response) => response.text())
      .then((data) => {
        document.querySelector('#contenedor-flotante').innerHTML = data;
        divInvisible.classList.remove("invisible");
  
        let btnCerrarFlot = document.getElementById("closeResultsFlotante");
        if (btnCerrarFlot) {
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            enlacesOrder(); // Re-activar los enlaces
          });
        }
  
        let formAddResults = document.getElementById("formAddResults");
        if (formAddResults) {
          formAddResults.addEventListener("submit", (e) => {
            e.preventDefault();
            let formData = new FormData(formAddResults);
            let results = Object.fromEntries(formData);
  
            fetch('/orders/guardarResultados', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(results),
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                alert(data.message);
                divInvisible.classList.add("invisible");
                enlacesOrder(); // Actualizar la vista de resultados
              } else {
                alert('Error: ' + data.message);
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('Error al guardar los resultados');
            });
          });
        }
      })
      .catch((error) => {
        console.error('Error al obtener el formulario de resultados:', error);
        alert('Error al obtener el formulario de resultados. Por favor, inténtalo de nuevo más tarde.');
      });
    });
  });
  */



  // Código JavaScript para manejar el envío del formulario
  btnAddResults.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      let id = button.getAttribute('id');

      fetch(`/orders/agregarResultados/${id}`, {
        method: 'GET',

      })
        .then((response) => response.text()) // Cambiado a text() para manejar HTML
        .then((data) => {
          try {
            let jsonData = JSON.parse(data); // Intentar parsear como JSON
            if (jsonData.status === 'not_found') {
              alert(jsonData.message);
              return;
            }
          } catch (e) {
            // Si no es JSON, continuar como HTML
            document.querySelector('#contenedor-flotante').innerHTML = data;
            divInvisible.classList.remove("invisible");

            let btnCerrarFlot = document.getElementById("closeResultsFlotante");
            if (btnCerrarFlot) {
              btnCerrarFlot.addEventListener("click", (e) => {
                e.preventDefault();
                divInvisible.classList.add("invisible");
                enlacesOrder(); // Re-activar los enlaces
              });
            }

            let formAddResults = document.getElementById("formAddResults");
            if (formAddResults) {
              formAddResults.addEventListener("submit", (e) => {
                e.preventDefault();
                let formData = new FormData(formAddResults);
                let results = Object.fromEntries(formData);

                fetch('/orders/guardarResultados', {
                  method: 'POST',
                  headers: {
                    //agregamos el header de authorization pata la auditoria y poder tomar los datos del ususario 
                    //que hace la accion
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(results),
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      alert(data.message);
                      divInvisible.classList.add("invisible");
                      enlacesOrder(); // Actualizar la vista de resultados
                    } else {
                      alert('Error: ' + data.message);
                    }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                    alert('Error al guardar los resultados');
                  });
              });
            }
          }
        })
        .catch((error) => {
          console.error('Error al obtener el formulario de resultados:', error);
          alert('Error al obtener el formulario de resultados. Por favor, inténtalo de nuevo más tarde.');
        });
    });
  });


  /*
    // Código JavaScript para manejar el envío del formulario
    btnAddResults.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        let id = button.getAttribute('id');
  
        fetch(`/orders/agregarResultados/${id}`, {
          method: 'GET',
        })
  
       
          .then((response) => response.text())
          .then((data) => {
           document.querySelector('#contenedor-flotante').innerHTML = data;
            divInvisible.classList.remove("invisible");
  
            let btnCerrarFlot = document.getElementById("closeResultsFlotante");
            if (btnCerrarFlot) {
              btnCerrarFlot.addEventListener("click", (e) => {
                e.preventDefault();
                divInvisible.classList.add("invisible");
                enlacesOrder(); // Re-activar los enlaces
              });
            }
  
            let formAddResults = document.getElementById("formAddResults");
            if (formAddResults) {
              formAddResults.addEventListener("submit", (e) => {
                e.preventDefault();
                let formData = new FormData(formAddResults);
                let results = Object.fromEntries(formData);
  
                fetch('/orders/guardarResultados', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(results),
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      alert(data.message);
                      divInvisible.classList.add("invisible");
                      enlacesOrder(); // Actualizar la vista de resultados
                    } else {
                      alert('Error: ' + data.message);
                    }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                    alert('Error al guardar los resultados');
                  });
              });
            }
          })
          .catch((error) => {
            console.error('Error al obtener el formulario de resultados:', error);
            alert('Error al obtener el formulario de resultados. Por favor, inténtalo de nuevo más tarde.');
          });
      });
    });
  }
  */
}












//ENLACES PARA EXAMENES
function enlacesExam() {
  const linksExams = document.querySelectorAll(".btnExams");
  linksExams.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      const id = enlace.getAttribute("id");
      fetch(`/main/exam/${id}`)
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenido-derecho").innerHTML = data;
          if (id == "exam") {
            enlacesManagerExam();
          } else if (id == "determinant") {
            enlacesDeterminant();
          } else if (id == "sample") {
            enlacesSample();
          }
        });
    });
  });








  //enlaces para examenes/determinantes/valores de referencia
  function enlacesDeterminant() {
    let btnAddDeterminant = document.getElementById("btnAddDeterminant");
    let divInvisible = document.getElementById("invisible");
    let btnViewValueReference = document.querySelectorAll(".btnViewValueReference");
    let btnSearchDeterminant = document.getElementById("btnSearchDeterminant");
    let btnUpdateDeterminant = document.querySelectorAll(".btnUpdateDeterminant");
    let btnDeleteDeterminant = document.querySelectorAll(".btnDeleteDeterminant");
    let btnAddValueReference = document.getElementById("btnAddValueReference");
    let btnUpdateValue = document.querySelectorAll(".btnUpdateValue");
    let btnDeleteValue = document.querySelectorAll(".btnDeleteValue");



    btnSearchDeterminant.addEventListener("click", (e) => {
      let name = document.getElementById("nameDeterminantSearch").value;
      let determinant = {
        name: name,
      };
      fetch("/searchDeterminant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(determinant),
      })
        .then((respose) => respose.text())
        .then((data) => {
          document.querySelector("#tabla-determinants").innerHTML = data;
          document.querySelector("#contenido-value").classList.add("invisible");
          enlacesDeterminant();
        });
    });
    // let buscadorDeterminant = document.getElementById("nameDeterminantSearch")
    // buscadorDeterminant.addEventListener("keyup", searchDeterminant)

    // function searchDeterminant(){
    //     let name = document.getElementById("nameDeterminantSearch").value;
    //     let determinant = {
    //       name: name,
    //     };
    //     fetch("/searchDeterminant", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(determinant),
    //     })
    //       .then((respose) => respose.text())
    //       .then((data) => {
    //         document.querySelector("#tabla-determinants").innerHTML = data;
    //         enlacesDeterminant();
    //       });
    // }

    btnAddDeterminant.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      fetch("/addDeterminant")
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenedor-flotante").innerHTML = data;
          document
            .querySelector("#viewDeterminant")
            .classList.add("opacity-50");

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            document
              .querySelector("#viewDeterminant")
              .classList.remove("opacity-50");
          });

          let btnRegisterDeterminant = document.getElementById(
            "btnRegisterDeterminant"
          );
          let nameDeterminant = document.getElementById("nameDeterminant");
          let abbreviationDeterminant = document.getElementById(
            "abbreviationDeterminant"
          );
          let measurementDeterminant = document.getElementById(
            "measurementDeterminant"
          );
          let detailDeterminant = document.getElementById("detailDeterminant");

          btnRegisterDeterminant.addEventListener("click", (e) => {
            e.preventDefault();
            const determinant = {
              name: nameDeterminant.value,
              abbreviation: abbreviationDeterminant.value,
              measurement: measurementDeterminant.value,
              detail: detailDeterminant.value,
            };
            fetch("/registerDeterminant", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(determinant),
            })
              .then((response) => response.text())
              .then((data) => {
                document
                  .querySelector("#viewDeterminant")
                  .classList.remove("opacity-50");
                document.querySelector("#contenido-derecho").innerHTML = data;
                divInvisible.classList.add("invisible");
                enlacesDeterminant();
              });
          });
        });
    });








    btnViewValueReference.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute("id");
        let determinant = {
          id: id,
        };
        const token = localStorage.getItem('token');

        fetch("/viewValues", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(determinant),
        })
          .then((response) => response.text())
          .then((data) => {
            document
              .querySelector("#contenido-value")
              .classList.remove("invisible");
            document.querySelector("#contenido-value").innerHTML = data;
            enlacesDeterminant();
          });
      });
    });




    btnUpdateDeterminant.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');


        let id = opcion.getAttribute("id");
        let determinant = {
          id: id,
        };
        fetch("/updateDeterminant", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify(determinant),
        })
          .then((response) => response.text())
          .then((data) => {
            divInvisible.classList.remove("invisible");
            document
              .querySelector("#viewDeterminant")
              .classList.add("opacity-50");
            document.querySelector("#contenedor-flotante").innerHTML = data;

            let btnCerrarFlot = document.getElementById("btnCerrarFlot");
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document
                .querySelector("#viewDeterminant")
                .classList.remove("opacity-50");
            });

            let btnRegNewDeterminant = document.getElementById(
              "btnRegNewDeterminant"
            );
            btnRegNewDeterminant.addEventListener("click", (e) => {
              e.preventDefault();
              let active = false;
              if (document.getElementById("active").checked) {
                active = true;
              }
              let newDeterminant = {
                id: document.querySelector("#idNewDeterminant").value,
                name: document.getElementById("nameDeterminant").value,
                abbreviation: document.getElementById("abbreviationDeterminant").value,
                measurement: document.getElementById("measurementDeterminant").value,
                detail: document.getElementById("detailDeterminant").value,
                active: active,
              };
              console.log(newDeterminant);
              fetch("/regUpdateDeterminant", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-type": "application/json",
                },
                body: JSON.stringify(newDeterminant),
              })
                .then((response) => response.text())
                .then((data) => {
                  document.querySelector("#contenido-derecho").innerHTML = data;
                  divInvisible.classList.add("invisible");
                  document
                    .querySelector("#viewDeterminant")
                    .classList.remove("opacity-50");
                  enlacesDeterminant();
                });
            });
          });
      });
    });






    btnDeleteDeterminant.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        const determinant = {
          id: opcion.getAttribute("id"),
        };
        fetch("/deleteDeterminant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(determinant),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#contenido-derecho").innerHTML = data;
            enlacesDeterminant();
          });
      });
    });







    //funciona perfecto
    btnUpdateValue.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        let id = opcion.getAttribute("id");
        let referenceValue = { id: id };
        console.log(id);

        fetch("/updateValue", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(referenceValue),
        })
          .then((response) => response.text())
          .then((data) => {
            divInvisible.classList.remove("invisible");
            document.querySelector("#viewDeterminant").classList.add("opacity-50");
            document.querySelector("#contenedor-flotante").innerHTML = data;

            let btnCerrarFlot = document.getElementById("btnCerrarFlot");
            btnCerrarFlot.addEventListener("click", (e) => {
              e.preventDefault();
              divInvisible.classList.add("invisible");
              document.querySelector("#viewDeterminant").classList.remove("opacity-50");
            });

            let btnRegisterUpdateValue = document.getElementById("btnRegisterUpdateValue");
            btnRegisterUpdateValue.addEventListener("click", (e) => {
              e.preventDefault();
              let active = document.getElementById("active").checked;
              let ageRange = document.getElementById("ageRange").value.split("-");
              let newValue = {
                id: document.getElementById("idNewValue").value,
                gender: document.getElementById("genderValue").value,
                age_min: ageRange[0],
                age_max: ageRange[1],
                pregnant: document.getElementById("pregnant").value,
                max_value: document.getElementById("maxValue").value,
                min_value: document.getElementById("minValue").value,
                max_limit: document.getElementById("maxLimit").value,
                min_limit: document.getElementById("minLimit").value,
                active: active,
                determinantId: document.getElementById("determinantId").value, // Obtener el ID del determinante desde el formulario o contexto
              };

              console.log(newValue);

              fetch("/regUpdateValue", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify(newValue),
              })
                .then((response) => response.text())
                .then((data) => {
                  document.querySelector("#contenido-value").innerHTML = data;
                  divInvisible.classList.add("invisible");
                  document.querySelector("#viewDeterminant").classList.remove("opacity-50");
                  enlacesDeterminant();
                })
                .catch((error) => {
                  console.log("ERROR en el fetch regUpdateValue", error);
                });
            });
          });
      });
    });






    /*
        btnUpdateValue.forEach((opcion) => {
          opcion.addEventListener("click", (e) => {
            e.preventDefault();
            let id = opcion.getAttribute("id");
            let referenceValue = {
              id: id,
            };
            console.log(id);
            fetch("/updateValue", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(referenceValue),
            })
              .then((response) => response.text())
              .then((data) => {
                divInvisible.classList.remove("invisible");
                document
                  .querySelector("#viewDeterminant")
                  .classList.add("opacity-50");
                document.querySelector("#contenedor-flotante").innerHTML = data;
    
                let btnCerrarFlot = document.getElementById("btnCerrarFlot");
                btnCerrarFlot.addEventListener("click", (e) => {
                  e.preventDefault();
                  divInvisible.classList.add("invisible");
                  document
                    .querySelector("#viewDeterminant")
                    .classList.remove("opacity-50");
                });
    
                let btnRegisterUpdateValue = document.getElementById("btnRegisterUpdateValue");
                btnRegisterUpdateValue.addEventListener("click", (e) => {
                  e.preventDefault();
                  let active = false;
                  if (document.getElementById("active").checked) {
                    active = true;
                  }
                  let newValue = {
                    gender: document.getElementById("genderValue").value,
                    age: document.getElementById("ageRange").value,
                    pregnant: document.getElementById("pregnant").value,
                    max_value: document.getElementById("maxValue").value,
                    min_value: document.getElementById("minValue").value,
                    max_limit: document.getElementById("maxLimit").value,
                    min_limit: document.getElementById("minLimit").value,
                    active: active,
                    id: document.getElementById("idNewValue").value,
                    determinantId: document.getElementById("determinantId").value,
                  };
    
                  fetch("/regUpdateValue", {
                    method: "POST",
                    headers: {
                      "Content-type": "application/json",
                    },
                    body: JSON.stringify(newValue),
                  })
                    .then((response) => response.text())
                    .then((data) => {
                      document.querySelector("#contenido-value").innerHTML = data;
                      divInvisible.classList.add("invisible");
                      document
                        .querySelector("#viewDeterminant")
                        .classList.remove("opacity-50");
                      enlacesDeterminant();
                    });
                });
              });
          });
        });
    */

    /*
    //maso
        btnUpdateValue.forEach((opcion) => {
          opcion.addEventListener("click", (e) => {
            e.preventDefault();
            let id = opcion.getAttribute("id");
            let referenceValue = {
              id: id,
            };
            console.log(id);
            fetch("/updateValue", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(referenceValue),
            })
              .then((response) => response.text())
              .then((data) => {
                divInvisible.classList.remove("invisible");
                document
                  .querySelector("#viewDeterminant")
                  .classList.add("opacity-50");
                document.querySelector("#contenedor-flotante").innerHTML = data;
    
                let btnCerrarFlot = document.getElementById("btnCerrarFlot");
                btnCerrarFlot.addEventListener("click", (e) => {
                  e.preventDefault();
                  divInvisible.classList.add("invisible");
                  document
                    .querySelector("#viewDeterminant")
                    .classList.remove("opacity-50");
                });
    
                let btnRegisterUpdateValue = document.getElementById("btnRegisterUpdateValue");
                btnRegisterUpdateValue.addEventListener("click", (e) => {
                  e.preventDefault();
                  let active = false;
                  if (document.getElementById("active").checked) {
                    active = true;
                  }
                  let ageRange = document.getElementById("ageRange").value.split("-");
                  let newValue = {
                      gender: document.getElementById("genderValue").value,
                      age_min: document.getElementById("ageRange").value || ageRange[0], //|| "",  // Usa valores vacíos si no se selecciona un rango
                      age_max: document.getElementById("ageRange").value || ageRange[1], // || "",
                      pregnant: document.getElementById("pregnant").value,
                      max_value: document.getElementById("maxValue").value,
                      min_value: document.getElementById("minValue").value,
                      max_limit: document.getElementById("maxLimit").value,
                      min_limit: document.getElementById("minLimit").value,
                      determinantId: document.getElementById("determinantId").value,
                  };
                  
    
    
                  fetch("/regUpdateValue", {
                    method: "POST",
                    headers: {
                      "Content-type": "application/json",
                    },
                    body: JSON.stringify(newValue),
                  })
                    .then((response) => response.text())
                    .then((data) => {
                      document.querySelector("#contenido-value").innerHTML = data;
                      divInvisible.classList.add("invisible");
                      document
                        .querySelector("#viewDeterminant")
                        .classList.remove("opacity-50");
                      enlacesDeterminant();
                    });
                });
              });
          });
        });
    */








    //funciona perfecto
    btnAddValueReference.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      const token = localStorage.getItem("token");
      //fetch("/addValue")
      fetch("/addValue", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then((response) => response.text())
        .then((data) => {
          document
            .querySelector("#viewDeterminant")
            .classList.add("opacity-50");
          document.querySelector("#contenedor-flotante").innerHTML = data;

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            document
              .querySelector("#viewDeterminant")
              .classList.remove("opacity-50");
          });
          let btnRegisterValue = document.getElementById("btnRegisterValue");
          btnRegisterValue.addEventListener("click", (e) => {
            e.preventDefault();

            let ageRange = document.getElementById("ageRange").value.split("-");
            let reference_value = {
              gender: document.getElementById("genderValue").value,
              age_min: ageRange[0],
              age_max: ageRange[1],
              pregnant: document.getElementById("pregnant").value,
              max_value: document.getElementById("maxValue").value,
              min_value: document.getElementById("minValue").value,
              max_limit: document.getElementById("maxLimit").value,
              min_limit: document.getElementById("minLimit").value,
              determinantId: document.getElementById("determinantId").value,
            };

            console.log(reference_value);
            fetch("/registerValue", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`, // Añadido para el token Bearer
                "Content-type": "application/json",
              },
              body: JSON.stringify(reference_value),
            })
              .then((response) => response.text())
              .then((data) => {
                divInvisible.classList.add("invisible");
                document
                  .querySelector("#viewDeterminant")
                  .classList.remove("opacity-50");
                document.querySelector("#contenido-value").innerHTML = data;
                enlacesDeterminant();
              });
          });
        });
    });

    /*
    btnRegisterValue.addEventListener("click", (e) => {
      e.preventDefault();

      let reference_value = {
        gender: document.getElementById("genderValue").value,
        age: document.getElementById("ageRange").value,
        pregnant: document.getElementById("pregnant").value,
        max_value: document.getElementById("maxValue").value,
        min_value: document.getElementById("minValue").value,
        max_limit: document.getElementById("maxLimit").value,
        min_limit: document.getElementById("minLimit").value,
        determinantId: document.getElementById("determinantId").value,
      };

      console.log(reference_value);
      fetch("/registerValue", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(reference_value),
      })
        .then((response) => response.text())
        .then((data) => {
          divInvisible.classList.add("invisible");
          document
            .querySelector("#viewDeterminant")
            .classList.remove("opacity-50");
          document.querySelector("#contenido-value").innerHTML = data;
          enlacesDeterminant();
        });
    });
  });
});
*/


    btnDeleteValue.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        const valueReference = {
          id: opcion.getAttribute("id"),
          //determinantId: opcion.getAttribute("data-determinant-id"), // Asegúrate de que este atributo esté presente en el botón
          determinantId: document.getElementById("determinantId").value,

        };

        if (confirm("¿Estás seguro de que deseas eliminar este valor de referencia?")) {
          fetch("/deleteValue", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(valueReference),
          })
            .then((response) => response.text())
            .then((data) => {
              document.querySelector("#contenido-value").innerHTML = data;
              enlacesDeterminant();
            })
            .catch((error) => {
              console.error("Error al eliminar el valor de referencia:", error);
            });
        }
      });
    });
  }


  /*
  //no funciona
      btnDeleteValue.forEach((opcion) => {
        opcion.addEventListener("click", (e) => {
          e.preventDefault();
          const valueReference = {
            id: opcion.getAttribute("id"),
          };
          fetch("/deleteValue", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(valueReference),
          })
            .then((response) => response.text())
            .then((data) => {
              document.querySelector("#contenido-value").innerHTML = data;
              enlacesDeterminant();
            });
        });
      });
    }
  */










  //enlaces para examenes/sample
  function enlacesSample() {
    let divInvisible = document.getElementById("invisible");
    let btnAddSample = document.getElementById("btnAddSample");
    let btnSearchSample = document.getElementById("btnSearchSample");
    let btnUpdateSample = document.querySelectorAll(".btnUpdateSample");
    let btnDeleteSample = document.querySelectorAll(".btnDeleteSample");

    btnSearchSample.addEventListener("click", (e) => {
      let name = document.getElementById("nameSampleSearch").value;
      //const token = localStorage.getItem("token");
      let sample = {
        name: name,
      };
      fetch("/searchSample", {
        method: "POST",
        headers: {
          //"Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sample),
      })
        .then((respose) => respose.text())
        .then((data) => {
          document.querySelector("#tabla-samples").innerHTML = data;
          enlacesSample();
        });
    });

    btnAddSample.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      const token = localStorage.getItem("token");


      fetch("/addSample")

        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenedor-flotante").innerHTML = data;
          document.querySelector("#viewSample").classList.add("opacity-50");

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            document
              .querySelector("#viewSample")
              .classList.remove("opacity-50");
          });

          let btnRegisterSample = document.getElementById("btnRegisterSample");

          btnRegisterSample.addEventListener("click", (e) => {
            e.preventDefault();
            const sample = {
              type: document.getElementById("typeSample").value,
              detail: document.getElementById("detailSample").value,
            };
            fetch("/registerSample", {
              method: "POST",
              headers: {
                //"Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(sample),
            })
              .then((response) => response.text())
              .then((data) => {
                document
                  .querySelector("#viewSample")
                  .classList.remove("opacity-50");
                document.querySelector("#contenido-derecho").innerHTML = data;
                divInvisible.classList.add("invisible");
                enlacesSample();
              });
          });
        });
    });









    // Escucha el evento click en cada botón de actualización
    btnUpdateSample.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        let id = button.getAttribute("id");
        //const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local



        fetch(`/order/getMuestraDetails/${id}`)
          /*
          fetch(`/order/getMuestraDetails/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, // Añadido para el token Bearer
              'Content-Type': 'application/json', // Añadido para indicar el tipo de contenido
            }
          })
            */
          .then((response) => response.json())
          .then((Sample) => {
            // Llenar los campos del formulario con los detalles de la orden obtenidos
            document.getElementById("updateMuestraId").value = Sample.id;
            document.getElementById("updateMuestraType").value = Sample.type;
            document.getElementById("updateMuestraDetail").value = Sample.detail;

            /*
                      document.getElementById("updateOrderId").value = order.id;
                      document.getElementById("updateOrderName").value = `${order.User.first_name} ${order.User.last_name}`;
                      document.getElementById("updateOrderDiagnosis").value = order.diagnostic;
                      document.getElementById("updateOrderPregnant").value = order.User.pregnant ? '1' : '0';
                      document.getElementById("updateOrderState").value = order.state;
                      document.getElementById("updateOrderFechaIngreso").value = order.fechaIngreso.substring(0, 10);
                      document.getElementById("updateOrderFechaEntregaResultados").value = order.fechaEntregaResultados.substring(0, 10);
                      document.getElementById("updateOrderObservations").value = order.observations;
            
                      */
            // Mostrar el formulario de actualización
            document.getElementById("containerActualizarMuestra").classList.remove("d-none");
            document.getElementById("formUpdateMuestra").classList.remove("d-none");
          })
          .catch((error) => {
            console.error('Error al obtener detalles de la muestra:', error);
          });
      });
    });


    // Escucha el evento submit del formulario de actualización
    //document.addEventListener('DOMContentLoaded', function () {
    let formUpdateMuestra = document.getElementById("formUpdateMuestra");
    if (formUpdateMuestra) {
      formUpdateMuestra.addEventListener("submit", (e) => {
        e.preventDefault();

        // Construir el objeto con los datos actualizados de la orden
        let updatedMuestra = {
          id: document.getElementById("updateMuestraId").value,

          type: document.getElementById("updateMuestraType").value,
          detail: document.getElementById("updateMuestraDetail").value,
          //state: document.getElementById("updateMuestraState").value,
        };

        console.log('Datos enviados:', updatedMuestra); // Registro de depuración

        // Enviar la solicitud POST para actualizar la orden
        fetch('/order/regUpdateSample', {
          method: 'POST',
          headers: {
            //'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedMuestra),
        })
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('Error al actualizar la muestra');
            }
          })
          .then(data => {
            console.log('Muestra actualizada:', data);
            document.getElementById("formUpdateMuestra").classList.add("d-none");
            // Volver a ocultar el contenedor principal si es necesario
            document.getElementById("containerActualizarMuestra").classList.add("d-none");

            // document.querySelector("#viewOrder").classList.add("opacity-50");
            // document.querySelector("#contenedor-flotante").innerHTML = data;

            // Mostrar una alerta de éxito
            alert('Muestra actualizada exitosamente');
            // Llamar a una función para actualizar la lista de órdenes
            enlacesSample();
          })
          .catch(error => {
            console.error('Error al actualizar la orden:', error);
          });
      });
    }






    /*
        //actualizar una muestra
        btnUpdateSample.forEach((opcion) => {
          opcion.addEventListener("click", (e) => {
            e.preventDefault();
            let id = opcion.getAttribute("id");
            let sample = {
              id: id,
            };
    
            console.log("id de muestra: ",id);
    
            fetch("/updateSample", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify(sample),
            })
              .then((response) => response.text())
              .then((data) => {
                divInvisible.classList.remove("invisible");
                document.querySelector("#viewSample").classList.add("opacity-50");
                document.querySelector("#contenedor-flotante").innerHTML = data;
    
                let btnCerrarFlot = document.getElementById("btnCerrarFlot");
                btnCerrarFlot.addEventListener("click", (e) => {
                  e.preventDefault();
                  divInvisible.classList.add("invisible");
                  document
                    .querySelector("#viewSample")
                    .classList.remove("opacity-50");
                });
    
    
    
    
    
                let btnRegNewSample = document.getElementById("btnRegNewSample");
                btnRegNewSample.addEventListener("click", (e) => {
                  e.preventDefault();
                  let active = false;
                  if (document.getElementById("active").checked) {
                    active = true;
                  }
                  let newSample = {
                    id: document.getElementById("idNewSample").value,
                    type: document.getElementById("typeSample").value,
                    detail: document.getElementById("detailSample").value,
                    active: active,
                  };
                  fetch("/regUpdateSample", {
                    method: "POST",
                    headers: {
                      "Content-type": "application/json",
                    },
                    body: JSON.stringify(newSample),
                  })
                    .then((response) => response.text())
                    .then((data) => {
                      document.querySelector("#contenido-derecho").innerHTML = data;
                      divInvisible.classList.add("invisible");
                      document
                        .querySelector("#viewSample")
                        .classList.remove("opacity-50");
                      enlacesSample();
                    });
                });
              });
          });
        });
    */








    btnDeleteSample.forEach((opcion) => {
      opcion.addEventListener("click", (e) => {
        e.preventDefault();
        const sample = {
          id: opcion.getAttribute("id"),
        };
        fetch("/deleteSample", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sample),
        })
          .then((response) => response.text())
          .then((data) => {
            document.querySelector("#tabla-samples").innerHTML = data;
            enlacesSample();
          });
      });
    });
  }








  //funcionando todo, solo falta el ver determinaciones
  // Función para manejar enlaces y eventos relacionados con los exámenes
  function enlacesManagerExam() {
    let divInvisible = document.getElementById("invisible");
    let btnSearchExam = document.getElementById("btnSearchExam");
    let btnAddExam = document.getElementById("btnAddExam");
    let btnEliminarExam = document.getElementById("btnEliminarExam");
    let btnUpdateExam = document.querySelectorAll(".btnUpdateExam");
    let btnDeleteExam2 = document.querySelectorAll(".btnDeleteExam2");
    let btnViewSamplesDeExamenes = document.getElementById("btnViewSamplesDeExamenes");
    let btnViewDeterminants2 = document.querySelectorAll(".btnViewDeterminants2");






    btnSearchExam.addEventListener("click", (e) => {
      let name = document.getElementById("nameExamSearch").value;
      let exam = {
        name: name,
      };
      fetch("/searchExam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exam),
      })
        .then((respose) => respose.text())
        .then((data) => {
          document.querySelector("#tabla-exams").innerHTML = data;
          enlacesManagerExam(); // Reenlazar eventos después de actualizar la tabla
          //enlacesDeterminant(); // Supongo que esta función está definida en otro lugar
        });
    });



    //anda conn auditar
    btnAddExam.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      const token = localStorage.getItem('token');
      //fetch("/addExam")
      fetch("/addExam", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`, // Agregar el token de autenticación
          "Content-Type": "application/json",
        }
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenedor-flotante").innerHTML = data;
          document.querySelector("#viewExam").classList.add("opacity-50");

          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            document.querySelector("#viewExam").classList.remove("opacity-50");
          });

          let btnRegisterExam = document.getElementById("btnRegisterExam");
          btnRegisterExam.addEventListener("click", (e) => {
            e.preventDefault();

            const exam = {
              //examenes
              name: document.getElementById("nameExam").value,
              abbreviation: document.getElementById("abbreviationExam").value,
              detail: document.getElementById("detailExam").value,

              //muestras(tipos)
              sampleType: document.getElementById("sampleType").value,


              //determinaciones de examenes
              determinants: Array.from(document.getElementById("determinant").selectedOptions).map(option => option.value),

            };
            fetch("/registerExam", {
              method: "POST",
              headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(exam),
            })
              .then((response) => response.text())
              .then((data) => {
                document.querySelector("#viewExam").classList.remove("opacity-50");
                document.querySelector("#contenido-derecho").innerHTML = data;
                divInvisible.classList.add("invisible");
                enlacesManagerExam(); // Reenlazar eventos después de cambios dinámicos
              });
          });
        });
    });


    /*
        // Evento de clic para eliminar exámenes
        btnEliminarExam.addEventListener('click', () => {
          e.preventDefault();
          alert('Usted hizo click aquí');
        });
        enlacesManagerExam();
      }
    */




    /*
    //trabajando con audit
    // Escuchar el evento click en cada botón de actualización
    btnUpdateExam.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        let id = button.getAttribute("id");
        const token = localStorage.getItem('authToken'); // Obtener el token JWT
    
        // Hacer una solicitud para obtener los detalles del examen
        fetch(`/order/getExamenDetails/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Agregar el token de autenticación
          }
        })
        .then(response => response.json())
        .then(exam => {
          // Llenar los campos del formulario con los detalles del examen obtenidos
          document.getElementById("updateExamenId").value = exam.id;
          document.getElementById("updateExamenName").value = exam.name;
          document.getElementById("updateExamenDetail").value = exam.detail;
          document.getElementById("updateExamenAbbreviation").value = exam.abbreviation;
          document.getElementById("updateExamenActive").value = exam.active ? 'true' : 'false';
    
          // Acceder al tipo de muestra de la matriz Samples
          document.getElementById("updateExamenTipoMuestra").value = exam.Samples && exam.Samples.length > 0 ? exam.Samples[0].type : '';
    
          // Cargar los determinantes en el select múltiple
          const determinantesSelect = document.getElementById("updateExamenDeterminants");
          determinantesSelect.innerHTML = ''; // Limpiar el select antes de agregar opciones
          if (exam.Determinants && exam.Determinants.length > 0) {
            exam.Determinants.forEach(determinant => {
              const option = document.createElement('option');
              option.value = determinant.id;
              option.textContent = determinant.name;
              option.selected = true; // Marcar las determinantes existentes como seleccionadas
              determinantesSelect.appendChild(option);
            });
          }
    
          // Hacer una solicitud para obtener todas las determinantes disponibles
          fetch('/order/getAllDeterminants', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Agregar el token de autenticación
            }
          })
          .then(response => response.json())
          .then(determinants => {
            determinants.forEach(determinant => {
              const option = document.createElement('option');
              option.value = determinant.id;
              option.textContent = determinant.name;
              if (!exam.Determinants.some(d => d.id === determinant.id)) {
                determinantesSelect.appendChild(option); // Agregar solo las nuevas determinantes
              }
            });
          })
          .catch(error => {
            console.error('Error al obtener todas las determinantes:', error);
          });
    
          // Mostrar el formulario de actualización
          document.getElementById("containerActualizarExamen").classList.remove("d-none");
          document.getElementById("formUpdateExamen").classList.remove("d-none");
        })
        .catch(error => {
          console.error('Error al obtener detalles del examen:', error);
        });
      });
    });
    
    // Escuchar el evento submit del formulario de actualización
    if (formUpdateExamen) {
      formUpdateExamen.addEventListener("submit", (e) => {
        e.preventDefault();
    
        // Construir el objeto con los datos actualizados del examen
        let updatedExamen = {
          id: document.getElementById("updateExamenId").value,
          name: document.getElementById("updateExamenName").value,
          detail: document.getElementById("updateExamenDetail").value,
          abbreviation: document.getElementById("updateExamenAbbreviation").value,
          active: document.getElementById("updateExamenActive").value === 'true',
          type: document.getElementById("updateExamenTipoMuestra").value,
          determinants: Array.from(document.getElementById("updateExamenDeterminants").selectedOptions).map(option => option.value) // Obtener los determinantes seleccionados
        };
    
        console.log('Datos enviados:', updatedExamen); // Registro de depuración
    
        // Enviar la solicitud POST para actualizar el examen
        fetch('/order/regUpdateExamen', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedExamen),
        })
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error('Error al actualizar examen');
          }
        })
        .then(data => {
          console.log('Examen actualizado:', data);
          document.getElementById("formUpdateExamen").classList.add("d-none");
          document.getElementById("containerActualizarExamen").classList.add("d-none");
    
          // Mostrar una alerta de éxito
          alert('Examen actualizado exitosamente');
          // Llamar a una función para actualizar la lista de exámenes
          enlacesManagerExam();
        })
        .catch(error => {
          console.error('Error al actualizar el examen:', error);
        });
      });
    }
    */








    /*
          //andando eliminar examenes y samples
        btnDeleteExam2.forEach((button) => {
          button.addEventListener("click", (e) => {
            e.preventDefault();
    
            const examId = button.getAttribute("id");
    
            const confirmDelete = confirm("¿Realmente desea eliminar el examen?");
            if (confirmDelete) {
              fetch(`/deleteExam/${examId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                }
              })
                .then((response) => {
                  if (response.ok) {
                    return response.text();
                  } else {
                    throw new Error('Error al eliminar el examen');
                  }
                })
                .then((data) => {
                  alert("¡Examen eliminado correctamente!");
                  document.querySelector("#contenido-derecho").innerHTML = data;
                  enlacesManagerExam(); // Reenlazar eventos después de cambios dinámicos
                })
                .catch((error) => {
                  console.error('Error:', error);
                  alert("Hubo un problema al eliminar el examen.");
                });
            }
          });
        });
    */

    //eliminar examenes asociado a samples y determinaciones
    btnDeleteExam2.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const examId = button.getAttribute("data-id");

        const confirmDelete = confirm("¿Realmente desea eliminar el examen?");
        if (confirmDelete) {
          fetch(`/deleteExam/${examId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          })
            .then((response) => {
              if (response.ok) {
                return response.text();
              } else {
                throw new Error('Error al eliminar el examen');
              }
            })
            .then((data) => {
              alert("¡Examen eliminado correctamente!");
              document.querySelector("#contenido-derecho").innerHTML = data;
              enlacesManagerExam(); // Reenlazar eventos después de cambios dinámicos
            })
            .catch((error) => {
              console.error('Error:', error);
              alert("Hubo un problema al eliminar el examen.");
            });
        }
      });
    });




    /*andando
        // Escucha el evento click en cada botón de actualización
        btnUpdateExam.forEach((button) => {
          button.addEventListener("click", (e) => {
            e.preventDefault();
            let id = button.getAttribute("id");
    
            // Hacer una solicitud para obtener los detalles del examen
            fetch(`/order/getExamenDetails/${id}`)
              .then((response) => response.json())
              .then((Exam) => {
                // Llenar los campos del formulario con los detalles de examen obtenidos
                document.getElementById("updateExamenId").value = Exam.id;
                document.getElementById("updateExamenName").value = Exam.name;
                document.getElementById("updateExamenDetail").value = Exam.detail;
                document.getElementById("updateExamenAbbreviation").value = Exam.abbreviation;
                document.getElementById("updateExamenActive").value = Exam.active ? '1' : '0';
    
                // Acceder al tipo de muestra de la matriz Samples
                if (Exam.Samples && Exam.Samples.length > 0) {
                  document.getElementById("updateExamenTipoMuestra").value = Exam.Samples[0].type;
                } else {
                  document.getElementById("updateExamenTipoMuestra").value = ''; // Valor predeterminado si no hay muestras
                }
    
    
                // Cargar los determinantes en el select múltiple
                const determinantesSelect = document.getElementById("updateExamenDeterminants");
                determinantesSelect.innerHTML = ''; // Limpiar el select antes de agregar opciones
                if (Exam.Determinants && Exam.Determinants.length > 0) {
                  Exam.Determinants.forEach(determinant => {
                    const option = document.createElement('option');
                    option.value = determinant.id;
                    option.textContent = determinant.name;
                    determinantesSelect.appendChild(option);
                  });
                }
    
                // Mostrar el formulario de actualización
                document.getElementById("containerActualizarExamen").classList.remove("d-none");
                document.getElementById("formUpdateExamen").classList.remove("d-none");
              })
              .catch((error) => {
                console.error('Error al obtener detalles del examen:', error);
              });
          });
        });
    
    
        // Escucha el evento submit del formulario de actualización
        let formUpdateExamen = document.getElementById("formUpdateExamen");
        if (formUpdateExamen) {
          formUpdateExamen.addEventListener("submit", (e) => {
            e.preventDefault();
    
            // Construir el objeto con los datos actualizados de la orden
            let updatedExamen = {
              id: document.getElementById("updateExamenId").value,
              name: document.getElementById("updateExamenName").value,
              detail: document.getElementById("updateExamenDetail").value,
              abbreviation: document.getElementById("updateExamenAbbreviation").value,
              active: document.getElementById("updateExamenActive").value,
              type: document.getElementById("updateExamenTipoMuestra").value,
              determinants: Array.from(document.getElementById("updateExamenDeterminants").selectedOptions).map(option => option.value) // Obtener los determinantes seleccionados
    
              //state: document.getElementById("updateMuestraState").value,
            };
    
            console.log('Datos enviados:', updatedExamen); // Registro de depuración
    
            // Enviar la solicitud POST para actualizar el examen
            fetch('/order/regUpdateExamen', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedExamen),
            })
              .then(response => {
                if (response.ok) {
                  return response.text();
                } else {
                  throw new Error('Error al actualizar examen');
                }
              })
              .then(data => {
                console.log('examen actualizado:', data);
                document.getElementById("formUpdateExamen").classList.add("d-none");
                // Volver a ocultar el contenedor principal si es necesario
                document.getElementById("containerActualizarExamen").classList.add("d-none");
    
                // document.querySelector("#viewOrder").classList.add("opacity-50");
                // document.querySelector("#contenedor-flotante").innerHTML = data;
    
                // Mostrar una alerta de éxito
                alert('Examen actualizado exitosamente');
                // Llamar a una función para actualizar la lista de órdenes
                enlacesManagerExam();
              })
              .catch(error => {
                console.error('Error al actualizar el examen:', error);
              });
          });
        }
    */

    // Escucha el evento click en cada botón de actualización
    btnUpdateExam.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        let id = button.getAttribute("id");

        // Hacer una solicitud para obtener los detalles del examen
        fetch(`/order/getExamenDetails/${id}`)
          .then((response) => response.json())
          .then((Exam) => {
            // Llenar los campos del formulario con los detalles de examen obtenidos
            document.getElementById("updateExamenId").value = Exam.id;
            document.getElementById("updateExamenName").value = Exam.name;
            document.getElementById("updateExamenDetail").value = Exam.detail;
            document.getElementById("updateExamenAbbreviation").value = Exam.abbreviation;
            //document.getElementById("updateExamenActive").value = Exam.active ? '1' : '0';
            document.getElementById("updateExamenActive").value = Exam.active ? 'true' : 'false';

            // Acceder al tipo de muestra de la matriz Samples
            if (Exam.Samples && Exam.Samples.length > 0) {
              document.getElementById("updateExamenTipoMuestra").value = Exam.Samples[0].type;
            } else {
              document.getElementById("updateExamenTipoMuestra").value = ''; // Valor predeterminado si no hay muestras
            }




            // Cargar los determinantes en el select múltiple
            const determinantesSelect = document.getElementById("updateExamenDeterminants");
            determinantesSelect.innerHTML = ''; // Limpiar el select antes de agregar opciones
            if (Exam.Determinants && Exam.Determinants.length > 0) {
              Exam.Determinants.forEach(determinant => {
                const option = document.createElement('option');
                option.value = determinant.id;
                option.textContent = determinant.name;
                option.selected = true; // Marcar las determinantes existentes como seleccionadas
                determinantesSelect.appendChild(option);
              });
            }

            // Hacer una solicitud para obtener todas las determinantes disponibles
            fetch(`/order/getAllDeterminants`)
              .then((response) => response.json())
              .then((determinants) => {
                determinants.forEach(determinant => {
                  const option = document.createElement('option');
                  option.value = determinant.id;
                  option.textContent = determinant.name;
                  if (!Exam.Determinants.some(d => d.id === determinant.id)) {
                    determinantesSelect.appendChild(option); // Agregar solo las nuevas determinantes
                  }
                });
              })
              .catch((error) => {
                console.error('Error al obtener todas las determinantes:', error);
              });

            // Mostrar el formulario de actualización
            document.getElementById("containerActualizarExamen").classList.remove("d-none");
            document.getElementById("formUpdateExamen").classList.remove("d-none");
          })
          .catch((error) => {
            console.error('Error al obtener detalles del examen:', error);
          });
      });
    });

    // Escucha el evento submit del formulario de actualización
    let formUpdateExamen = document.getElementById("formUpdateExamen");
    if (formUpdateExamen) {
      formUpdateExamen.addEventListener("submit", (e) => {
        e.preventDefault();

        // Construir el objeto con los datos actualizados de la orden
        let updatedExamen = {
          id: document.getElementById("updateExamenId").value,
          name: document.getElementById("updateExamenName").value,
          detail: document.getElementById("updateExamenDetail").value,
          abbreviation: document.getElementById("updateExamenAbbreviation").value,
          //active: document.getElementById("updateExamenActive").value,
          active: document.getElementById("updateExamenActive").value === 'true',
          type: document.getElementById("updateExamenTipoMuestra").value,
          determinants: Array.from(document.getElementById("updateExamenDeterminants").selectedOptions).map(option => option.value) // Obtener los determinantes seleccionados
        };

        console.log('Datos enviados:', updatedExamen); // Registro de depuración

        // Enviar la solicitud POST para actualizar el examen
        fetch('/order/regUpdateExamen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedExamen),
        })
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('Error al actualizar examen');
            }
          })
          .then(data => {
            console.log('examen actualizado:', data);
            document.getElementById("formUpdateExamen").classList.add("d-none");
            // Volver a ocultar el contenedor principal si es necesario
            document.getElementById("containerActualizarExamen").classList.add("d-none");

            // Mostrar una alerta de éxito
            alert('Examen actualizado exitosamente');
            // Llamar a una función para actualizar la lista de órdenes
            enlacesManagerExam();
          })
          .catch(error => {
            console.error('Error al actualizar el examen:', error);
          });
      });
    }




    btnViewDeterminants2.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        alert("hola");
      });
    });
  }

}



/*
  //enlaces para examenes
  function enlacesManagerExam() {
    let divInvisible = document.getElementById("invisible");
    let btnSearchExam = document.getElementById("btnSearchExam");
    let btnAddExam = document.getElementById("btnAddExam");
    //let btnDeleteExam = document.getElementById("btnDeleteExam");
 
 
    btnSearchExam.addEventListener("click", (e) => {
      let name = document.getElementById("nameExamSearch").value;
      let exam = {
        name: name,
      };
      fetch("/searchExam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exam),
      })
        .then((respose) => respose.text())
        .then((data) => {
          document.querySelector("#tabla-exams").innerHTML = data;
          // document.querySelector("#contenido-determinant").classList.add("invisible");
          enlacesDeterminant();
        });
    });
 
 
 
 
 
 
    btnAddExam.addEventListener("click", (e) => {
      e.preventDefault();
      divInvisible.classList.remove("invisible");
      fetch("/addExam")
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#contenedor-flotante").innerHTML = data;
          document.querySelector("#viewExam").classList.add("opacity-50");
 
          let btnCerrarFlot = document.getElementById("btnCerrarFlot");
          btnCerrarFlot.addEventListener("click", (e) => {
            e.preventDefault();
            divInvisible.classList.add("invisible");
            document.querySelector("#viewExam").classList.remove("opacity-50");
          });
 
          let btnRegisterExam = document.getElementById("btnRegisterExam");
 
          btnRegisterExam.addEventListener("click", (e) => {
            e.preventDefault();
            const exam = {
              name: document.getElementById("nameExam").value,
              abbreviation: document.getElementById("abbreviationExam").value,
              detail: document.getElementById("detailExam").value,
            };
            fetch("/registerExam", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(exam),
            })
              .then((response) => response.text())
              .then((data) => {
                document
                  .querySelector("#viewExam")
                  .classList.remove("opacity-50");
                document.querySelector("#contenido-derecho").innerHTML = data;
                divInvisible.classList.add("invisible");
                enlacesManagerExam();
              });
          });
        });
    });
 
 
 
 
 
  }
}
*/







// probando, el de arriba anda bien.








/*
 
function enlacesManagerExam() {
  let divInvisible = document.getElementById("invisible");
  let btnSearchExam = document.getElementById("btnSearchExam");
  let btnAddExam = document.getElementById("btnAddExam");
  let btnDeleteExam = document.getElementsByClassName("btnDeleteExam");
 
  btnSearchExam.addEventListener("click", (e) => {
    e.preventDefault();
    let name = document.getElementById("nameExamSearch").value;
    let exam = { name: name };
    fetch("/searchExam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exam),
    })
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("#tabla-exams").innerHTML = data;
        addDeleteExamEventListeners(); // Volver a agregar los event listeners después de actualizar la tabla
      });
  });
 
  btnAddExam.addEventListener("click", (e) => {
    e.preventDefault();
    divInvisible.classList.remove("invisible");
    fetch("/addExam")
      .then((response) => response.text())
      .then((data) => {
        document.querySelector("#contenedor-flotante").innerHTML = data;
        document.querySelector("#viewExam").classList.add("opacity-50");
 
        let btnCerrarFlot = document.getElementById("btnCerrarFlot");
        btnCerrarFlot.addEventListener("click", (e) => {
          e.preventDefault();
          divInvisible.classList.add("invisible");
          document.querySelector("#viewExam").classList.remove("opacity-50");
        });
 
        let btnRegisterExam = document.getElementById("btnRegisterExam");
        btnRegisterExam.addEventListener("click", (e) => {
          e.preventDefault();
          const exam = {
            name: document.getElementById("nameExam").value,
            abbreviation: document.getElementById("abbreviationExam").value,
            detail: document.getElementById("detailExam").value,
          };
          fetch("/registerExam", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exam),
          })
            .then((response) => response.text())
            .then((data) => {
              document.querySelector("#viewExam").classList.remove("opacity-50");
              document.querySelector("#contenido-derecho").innerHTML = data;
              divInvisible.classList.add("invisible");
              addDeleteExamEventListeners(); // Volver a agregar los event listeners después de actualizar la tabla
            });
        });
      });
  });
 
  btnDeleteExam.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      let id = button.getAttribute("id");
      let exam = { id: id };
      fetch("/deleteExam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exam),
      })
        .then((response) => response.text())
        .then((data) => {
          document.querySelector("#tabla-exams").innerHTML = data;
          enlacesManagerExam(); // Volver a inicializar los event listeners después de eliminar el examen
        });
    });
  });
}
 
//enlacesManagerExam(); // Llamar a la función principal para inicializar todo
 
}
 
*/







//FUNCIONES DE ENLACES PARA pacientes
function nuevosEnlacesPatient() {
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
      let clave = document.getElementById("clave").value;
      let gender = document.getElementById("gender").value;
      let location = document.getElementById("location").value;
      let birthdate = document.getElementById("birthdate").value;
      let diagnostic = document.getElementById("diagnostic").value;
      let direction = document.getElementById("direction").value;
      let patient = {
        dni: dni,
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        clave: clave,
        gender: gender,
        location: location,
        direction: direction,
        diagnostic: diagnostic,
        birthdate: birthdate,
      };

      console.log(patient);

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
            enlaceUpdate();
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
        //let diagnostic = document.getElementById("diagnostic").value;
        //let direction = document.getElementById("direction").value;
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
          //direction: direction,
          //diagnostic: diagnostic,
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












// Asegúrate de que el botón de imprimir esté disponible y de que el contenedor de resultados esté correctamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const printButton = document.getElementById('printResults');
  if (printButton) {
    printButton.addEventListener('click', () => {
      window.print(); // Abre el diálogo de impresión del navegador
    });
  }
});
