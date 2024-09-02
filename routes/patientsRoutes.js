// patientsRoutes.js
var express = require("express");
var router = express.Router();
const { User } = require("../models");
const { Order } = require("../models");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const authToken = require('../middleware/auth')
const logAudit = require('../utils/auditLogger');  // Importar la función de auditoría

router.use(express.static("public"));
router.use(bodyParser.urlencoded({ extended: true }));



/*
//no anda
router.get("/main/patient/:id", async (req, res) => {
  const id = req.params.id;
  let users = [];
  const admin = req.user; // Suponiendo que 'req.user' contiene la información del admin

  //lógica para determinar qué plantilla renderizar según el 'id'
  switch (id) {
    case "add":
      if (admin && admin.first_name && admin.last_name && admin.rol) {
        res.render("menus/mainsPatient/addPatient.pug", { admin });
      } else {
        res.redirect('/login'); // Redirigir si el admin no está autenticado
      }
      break;
    case "search":
      try {
        users = await User.findAll();
        res.render("menus/mainsPatient/searchPatient.pug", { users: users });
      } catch (error) {
        console.error(error);
        res.status(500).send("ERROR in patient search.");
      }
      break;
    default:
      res.render("error.pug");
      break;
  }
});
*/

//funciona bien, no tiene la cabecera
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

/*
//no se si funcion
router.post("/registerUser", async (req, res) => {
  try {
    //hacer validar que no exista
    // validar que los campos sean correctos

    const newUser = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      active: true,
      dni: req.body.dni,
      phone: req.body.phone,
      email: req.body.email,
      adress: req.body.adress,
      key: req.body.clave,
      location: req.body.location,
      direction: req.body.direction,
      diagnostic: req.body.diagnostic,
      birthdate: req.body.birthdate,
      rol: "patient",
    });
    
    //una vez creado generamos un salt con bcrypt
    const salt = await bcrypt.genSalt(10);
    //ahora hasheamos el salt con la clave del usuario
    newUser.key = await bcrypt.hash(newUser.key,salt)
    //guardamos en DB
    newUser.save()


    res.render("messages/messPatient/messAddPatient.pug");
  } catch {
    console.error(error);
    res.status(500).send("Error al registrar el usuario.");
  }
});
*/


/*
//probando guardar un usuario paciente
router.post("/registerUser", async (req, res) => {
  try {
    // Validar que los campos sean correctos (esto es un ejemplo, debes ajustar según tus necesidades)
    const { first_name, last_name, gender, dni, phone, email, adress, clave, location, direction, diagnostic, birthdate } = req.body;
    if (!first_name || !last_name || !dni || !phone || !email || !clave || !gender || !location || !direction || !diagnostic || !birthdate) {
      return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Validar que no exista un usuario con el mismo DNI o email
    const existingUser = await User.findOne({ where: { dni } });
    if (existingUser) {
      return res.status(400).send("Ya existe un usuario con ese DNI.");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).send("Ya existe un usuario con ese email.");
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      first_name,
      last_name,
      gender,
      active: true,
      dni,
      phone,
      email,
      adress,
      location,
      direction,
      diagnostic,
      birthdate,
      rol: "patient",
    });

    // Generar un salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    newUser.key = await bcrypt.hash(clave, salt);

    // Guardar el usuario con la contraseña hasheada
    await newUser.save();






    // Registrar en la auditoría
    await logAudit(
      newUser.id,
      'Paciente',
      req.usuario.id,  // Cambiado de `req.user.id` a `req.usuario.id`
      `${req.usuario.first_name} ${req.usuario.last_name}`,  // Cambiado de `req.user.first_name` y `req.user.last_name`
      req.usuario.rol,  // Cambiado de `req.user.rol` a `req.usuario.rol`
      null,
      JSON.stringify(newUser),
      'Creación'
    );







    // Redirigir a la vista de éxito o enviar una respuesta adecuada
    res.render("messages/messPatient/messAddPatient.pug");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario.");
  }
});
*/


/*
router.post("/registerUser", authToken, async (req, res) => {
  res.status(200).json({ message: 'Acceso autorizado' });

  try {
    // Verifica si req.usuario está definido
    console.log("req.usuario:", req.usuario);
    if (!req.usuario) {
      return res.status(401).send("No se ha encontrado el usuario en el token.");
    }

    // Validar que los campos sean correctos
    const { first_name, last_name, gender, dni, phone, email, adress, clave, location, direction, diagnostic, birthdate } = req.body;
    if (!first_name || !last_name || !dni || !phone || !email || !clave || !gender || !location || !direction || !diagnostic || !birthdate) {
      return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Validar que no exista un usuario con el mismo DNI o email
    const existingUser = await User.findOne({ where: { dni } });
    if (existingUser) {
      return res.status(400).send("Ya existe un usuario con ese DNI.");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).send("Ya existe un usuario con ese email.");
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      first_name,
      last_name,
      gender,
      active: true,
      dni,
      phone,
      email,
      adress,
      location,
      direction,
      diagnostic,
      birthdate,
      rol: "patient",
    });

    // Generar un salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    newUser.key = await bcrypt.hash(clave, salt);

    // Guardar el usuario con la contraseña hasheada
    await newUser.save();

    
    // Registrar en la auditoría
    await logAudit(
      newUser.id,
      'Paciente',
      req.usuario.id, // ID del usuario que hace la auditoría
      req.usuario.username, // Username del usuario que hace la auditoría
      req.usuario.rol, // Rol del usuario que hace la auditoría
      null,
      JSON.stringify(newUser),
      'Creación'
    );


    // Redirigir a la vista de éxito o enviar una respuesta adecuada
    res.render("messages/messPatient/messAddPatient.pug");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario.");
  }
});
*/






/*
router.post("/registerUser", authToken, async (req, res) => {
  try {
    // Verifica si req.usuario está definido
    console.log("req.usuario:", req.usuario);
    if (!req.usuario) {
      return res.status(401).send("No se ha encontrado el usuario en el token.");
    }

    // Validar que los campos sean correctos
    const { first_name, last_name, gender, dni, phone, email, adress, clave, location, direction, diagnostic, birthdate } = req.body;
    if (!first_name || !last_name || !dni || !phone || !email || !clave || !gender || !location || !direction || !diagnostic || !birthdate) {
      return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Validar que no exista un usuario con el mismo DNI o email
    const existingUser = await User.findOne({ where: { dni } });
    if (existingUser) {
      return res.status(400).send("Ya existe un usuario con ese DNI.");
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).send("Ya existe un usuario con ese email.");
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      first_name,
      last_name,
      gender,
      active: true,
      dni,
      phone,
      email,
      adress,
      location,
      direction,
      diagnostic,
      birthdate,
      rol: "patient",
    });

    // Generar un salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    newUser.key = await bcrypt.hash(clave, salt);

    // Guardar el usuario con la contraseña hasheada
    await newUser.save();

    // Registrar en la auditoría
    await logAudit(
      newUser.id,
      'Paciente',
      req.usuario.id, // ID del usuario que hace la auditoría
      req.usuario.username, // Username del usuario que hace la auditoría
      req.usuario.rol, // Rol del usuario que hace la auditoría
      null,
      //JSON.stringify(newUser),
      null,
      'Creación'
    );

    //entityId,
    //entityType,
    //userId,
    //userName,
    //userRole,
    //oldValue,
    //newValue,
    //actionTime: new Date(),
    //actionType


    // Enviar respuesta de éxito
    res.json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario.");
  }
});
*/

router.post("/registerUser", authToken, async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "No se ha encontrado el usuario en el token." });
    }
    //saque a diagnostic
    const { first_name, last_name, gender, dni, phone, email, adress, clave, location, direction, birthdate } = req.body;
    if (!first_name || !last_name || !dni || !phone || !email || !clave || !gender || !location || !direction || !birthdate) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const existingUser = await User.findOne({ where: { dni } });
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe un usuario con ese DNI." });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Ya existe un usuario con ese email." });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      gender,
      active: true,
      dni,
      phone,
      email,
      adress,
      location,
      direction,
      //diagnostic,
      birthdate,
      rol: "patient",
    });

    const salt = await bcrypt.genSalt(10);
    newUser.key = await bcrypt.hash(clave, salt);
    await newUser.save();

    await logAudit(
      newUser.id,
      'Paciente',
      req.usuario.id,
      req.usuario.username,
      req.usuario.rol,
      null,
      null,
      'Creación'
    );

    res.json({ message: 'Registro exitoso' });
    
    
    
    

    //probando
   // let users = await User.findAll();
   // res.render("menus/mainsPatient/searchPatient.pug", { users: users });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el usuario." });
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




//update de usuario
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
      patient.diagnostic = req.body.diagnostic;
      patient.direction = req.body.direction;
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
