var express = require("express");
var router = express.Router();
const { User } = require("../models");
const { Order } = require("../models");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");

router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Laboratorio" });
// });

// router.get("/login", function (req, res, next) {
//   res.render("login");
// });

// router.get("/", function (req, res, next) {
//   res.render("menu");
// });

// Ruta para renderizar la otra plantilla cuando se hace click en una opción del menú
router.get("/main/:id", async (req, res) => {
  const id = req.params.id;
  //lógica para determinar qué plantilla renderizar según el 'id'
  switch (id) {
    case "patient":
      res.render("menus/mainPatient.pug");
      break;
    case "order":

      let orders = await Order.findAll({
        include: User,
      })
      if(orders){

        res.render("menus/mainOrder.pug",{orders:orders});
      }
      break;
    case "result":
      res.render("menus/mainResult.pug");
      break;
    case "exam":
      res.render("menus/mainExam.pug");
      break;
    case "sample":
      res.render("menus/mainSample.pug");
      break;
    case "user":
      res.render("menus/mainUser.pug");
      break;
    case "audit":
      res.render("menus/mainAudit.pug");
      break;

    default:
      res.render("error.pug");
      break;
  }
});

router.get("/main/patient/:id", async (req, res) => {
  const id = req.params.id;
  let users = [];
  //lógica para determinar qué plantilla renderizar según el 'id'
  switch (id) {
    case "add":
      res.render("menus/mainsPatient/addPatient.pug");
      break;
    case "search":
      try {
        users = await User.findAll();
        res.render("menus/mainsPatient/searchPatient.pug", { users: users });
      } catch {
        console.error(error);
        res.status(500).send("ERROR in patient search.");
      }
      break;
    default:
      res.render("error.pug");
      break;
  }
});
router.post("/registerUser", async (req, res) => {
  try {
    const newUser = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      active: true,
      dni: req.body.dni,
      phone: req.body.phone,
      email: req.body.email,
      adress: req.body.adress,
      clave: req.body.clave,
      location: req.body.location,
      birthdate: req.body.birthdate,
      rol: "patient",
    });
    console.log(newUser);
    res.render("messages/messPatient/messAddPatient.pug");
  } catch {
    console.error(error);
    res.status(500).send("Error al registrar el usuario.");
  }
});

router.post("/searchUser", async (req, res) => {
  let dni = req.body.dni;
  let last_name = req.body.last_name;
  let email = req.body.email;

  // let users = await User.findAll({
  //   where: {
  //     dni: dni,
  //   },
  // });

  let users = await User.findAll({
    where: {
      [Op.or]: [{ dni: dni }, { email: email }, { last_name: last_name }],
    },
  });

  let marcador = 1;
  res.render("menus/mainsPatient/searchPatient.pug", {
    users: users,
    marcador: marcador,
  });
});

router.post("/main/patient/updateUser", async (req, res) => {
  let id = req.body.id;
  let users = await User.findAll({
    where: {
      id: id,
    },
  });
  res.render("menus/mainsPatient/updatePatient.pug", { users: users });
});

router.post("/main/patient/deleteUser", async (req, res) => {
  try {
    let id = req.body.id;
    let users = await User.findOne({
      where: {
        id: id,
      },
    });
    if (users) {
      users.active = false;
      await users.save();
    }

    res.render("messages/messPatient/messDeletePatient.pug");
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("Error en la actualización del usuario.");
  }
});

router.post("/main/patient/updateUser/newUser", async (req, res) => {
  try {
    const id = req.body.id;
    const patient = await User.findOne({
      where: {
        id: id,
      },
    });
    if (patient) {
      patient.first_name = req.body.first_name;
      patient.last_name = req.body.last_name;
      patient.gender = req.body.gender;
      patient.dni = req.body.dni;
      patient.phone = req.body.phone;
      patient.email = req.body.email;
      patient.clave = req.body.clave;
      patient.location = req.body.location;
      patient.birthdate = req.body.birthdate;
      if (req.body.active) {
        patient.active = true;
      }

      await patient.save(); // Guardar los cambios en la base de datos
    }

    res.render("messages/messPatient/messUpdatePatient.pug");
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("ERROR in patient update.");
  }
});

module.exports = router;
