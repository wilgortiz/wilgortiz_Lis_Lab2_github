var express = require("express");
var router = express.Router();
const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const authToken = require("../middleware/auth");






router.post("/user/searchUser", async (req, res) => {
  try {
    let users = await User.findAll({
      where: {
        dni: {
          [Op.like]: "%" + req.body.dni+ "%",
        },
        rol: { [Op.ne]: "patient" },
      },
    });
    res.render("menus/mainUser/tablaUsers.pug", {
      users: users,
    });
  } catch {
    console.log("error search user");
  }
});

router.get("/user/addUser", async (req, res) => {
  console.log("hola");
  res.render("menus/mainUser/flotantes/flotAddUser.pug");
});









router.post("/user/registerUser", async (req, res) => {
  try {
    //hacer validar que no exista
    // validar que los campos sean correctos

    const newUser = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      active: true,
      dni: req.body.dni,
      email: req.body.email,
      key: "1234",
      rol: req.body.rol,
    });

    //una vez creado generamos un salt con bcrypt
    const salt = await bcrypt.genSalt(10);
    //ahora hasheamos el salt con la clave del usuario
    newUser.key = await bcrypt.hash(newUser.key, salt);
    //guardamos en DB
    newUser.save();

    let users = await User.findAll({
      where: {
        rol: { [Op.ne]: "patient" },
      },
    });
    res.render("menus/mainUser.pug", { users: users });
  } catch {
    console.error(error);
    res.status(500).send("Error al registrar el usuario.");
  }
});









router.post("/user/updateUser", async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.render("menus/mainUser/flotantes/flotUpdateUser.pug", {
      user: user,
    });
  } catch {
    console.log(error);
  }
});











router.post("/user/regUpdateUser", async (req, res) => {
  try {
    const id = req.body.id;
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      user.first_name = req.body.first_name;
      user.last_name = req.body.last_name;
      user.email = req.body.email;
      user.dni = req.body.dni;
      user.rol = req.body.rol;
      user.active = req.body.active;

      await user.save();
      let users = await User.findAll({
        where: {
          rol: { [Op.ne]: "patient" },
        },
      });
      res.render("menus/mainUser.pug", { users: users });
    }
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("ERROR in determinant update.");
  }
});





router.post("/user/deleteUser", async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (user) {
      user.active = false;
      await user.save();
      let users = await User.findAll({
        where: {
          rol: { [Op.ne]: "patient" },
        },
      });
      res.render("menus/mainUser.pug", { users: users });
    }
  } catch {
    res.status(500).send("Error al borrar el usuario.");
  }
});

module.exports = router;
