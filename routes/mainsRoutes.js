var express = require("express");
var router = express.Router();
const { User } = require("../models");
const { Order } = require("../models");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const authToken = require("../middleware/auth");
const moment = require("moment"); // Importa moment
require('moment/locale/es'); // Importa el locale en español
const{Audit}=require('../models');
const{admin}=require('../models');
// Configura moment para usar el idioma español
moment.locale('es');



/* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Laboratorio" });
// });



router.get("/main/:id", authToken, async (req, res) => {
  const id = req.params.id;
  // Obtén los datos del usuario administrador desde el token o de la base de datos
  const adminId = req.usuario.id; // Suponiendo que el ID del usuario está en el token
  const admin = await User.findByPk(adminId);

  switch (id) {
    case "patient":
      res.render("menus/mainPatient.pug");
      break;
    case "order":
      let orders = await Order.findAll({
        include: User,
      });

      orders = orders.map(order => {
        order.fechaIngresoFormatted = moment(order.fechaIngreso).format('LLLL');
        return order;
      });

      if (orders) {
        res.render("menus/mainOrder.pug", { orders: orders, admin });
      }
      break;
    case "exam":
      res.render("menus/mainExam.pug");
      break;
    case "user":
      let users = await User.findAll({
        where: {
          rol: { [Op.ne]: "patient" }
        }
      });
      res.render("menus/mainUser.pug", { users: users });
      break;

    case "audit":
      let audits = await Audit.findAll();
      if (audits) {
        res.render("menus/mainAudit.pug", { audits: audits });
      } else {
        res.render("menus/mainAudit.pug", { audits: [] });
      }
      break;

    default:
      res.render("error.pug");
      break;
  }
});


/*
// Ruta para renderizar la otra plantilla cuando se hace click en una opción del menú
router.get("/main/:id", authToken, async (req, res) => {
  const id = req.params.id;
  //lógica para determinar qué plantilla renderizar según el 'id'
  switch (id) {
    case "patient":
      res.render("menus/mainPatient.pug");
      break;
    case "order":
      // console.log(req.usuario) puedo ver los datos del token ahi
      let orders = await Order.findAll({
        include: User,
      });



      // Formatea la fecha de ingreso con fecha y hora en castellano antes de renderizar
      orders = orders.map(order => {
        order.fechaIngresoFormatted = moment(order.fechaIngreso).format('LLLL');
        return order;
      });



      if (orders) {
        //res.render("menus/mainOrder.pug", { orders: orders });

        res.render("menus/mainOrder.pug", { orders: orders });
      }
      break;
    case "exam":
      res.render("menus/mainExam.pug");
      break;
    case "user":
      let users = await User.findAll({
        where:{
            rol: { [Op.ne]: "patient" }
        }
      })
      res.render("menus/mainUser.pug", {users: users});
      break;

      case "audit":
        let audits = await Audit.findAll();
        if (audits) {
          res.render("menus/mainAudit.pug", { audits: audits });
        } else {
          res.render("menus/mainAudit.pug", { audits: [] });
        }
        break;

    //case "audit":
      //res.render("menus/mainAudit.pug");
      //break;

    default:
      res.render("error.pug");
      break;
  }
});
*/
module.exports = router;
