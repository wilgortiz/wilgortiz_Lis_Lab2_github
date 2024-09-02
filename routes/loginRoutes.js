//funciona perfecto
/*
var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const { User } = require("../models");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const authToken = require("../middleware/auth");

router.get("/", function (req, res, next) {
  res.render("login");
});

router.post("/getinto", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  let admin = await User.findOne({
    where: {
      email: body.email,
      rol: { [Op.ne]: "patient" },
    },
  });

  if (admin) {
    const validPassword = await bcrypt.compare(body.key, admin.key); //comparo la clave ingresada un la hasheada en ese usuario
    if (validPassword) {
      //validado el password creo un token de autenticacion para poder navegar por la pagina sin tener q estar logenadose en todo momento con jwt
      let token = jwt.sign(
        { id: admin.id, username: admin.last_name, rol: admin.rol },
        "laboratoryDario",
        { expiresIn: "24h" }
      );
      res.json({ token });
    } else {
      res.status(401).json({ mensaje: "Key/email incorrect" });
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/main", authToken, async (req, res) => {
  let token = req.usuario;
  if (token) {
    let admin = await User.findOne({
      where: {
        id: token.id,
        rol: { [Op.ne]: "patient" },
      },
    });
    if (admin) {

      res.render("menu.pug", { token: token, admin: admin });
    }
  }


});


module.exports = router;
*/





// loginRoutes.js
var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const { User, Order, Result, Determinant,OrderExam, Exam, Sample, ExamSample, ExamDeterminant,Value_reference } = require("../models");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const authToken = require("../middleware/auth");

router.get("/", function (req, res, next) {
  res.render("login");
});





router.post("/getinto", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  let user = await User.findOne({
    where: {
      email: body.email,
    },
  });

  if (user) {
    const validPassword = await bcrypt.compare(body.key, user.key);
    if (validPassword) {
      let token = jwt.sign(
        { id: user.id, username: user.last_name, rol: user.rol },
        "wilgonzaLab2",
        { expiresIn: "24h" }
      );
      
      if (user.rol === 'patient') {
        res.json({ userId: user.id, redirect: '/portal' });
      } else {
        res.json({ token });
      }
    } else {
      res.status(401).json({ mensaje: "Key/email incorrect" });
    }
  } else {
    res.status(401).json({ mensaje: "User not found" });
  }
});

router.get("/main", authToken, async (req, res) => {
  let token = req.usuario;
  if (token) {
    let admin = await User.findOne({
      where: {
        id: token.id,
        rol: { [Op.ne]: "patient" },
      },
    });
    if (admin) {
      res.render("menu.pug", { token: token, admin: admin });
    } else {
      res.status(403).send("Forbidden");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
});






//ruta para mostrar los resultados del paciente
router.get('/portal/:userId', async (req, res) => {
  try {
    const patient = await User.findByPk(req.params.userId, {
      attributes: ['id', 'first_name', 'last_name', 'birthdate', 'gender'],
      include: [{
        model: Order,
        attributes: ['id', 'createdAt'],
        include: [{
          model: OrderExam,
          include: [
            {
              model: Exam,
              include: [
                {
                  model: Determinant,
                  attributes: ['name', 'measurement', 'id', 'abbreviation'],
                  through: { attributes: [] },
                  include: [
                    {
                      model: Value_reference,
                      attributes: ['gender', 'age_min', 'age_max', 'max_value', 'min_value']
                    }
                  ]
                }
              ]
            },
            {
              model: Result,
              attributes: ['value', 'orderExamId', 'examDeterminantId'],
            }
          ]
        }]
      }]
    });

    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    const patientAge = getAge(patient.birthdate);

    const results = patient.Orders.flatMap(order => 
      order.OrderExams.map(orderExam => {
        const exam = orderExam.Exam;
        const determinants = exam.Determinants.map(determinant => {
          const filteredReferences = determinant.Value_references.filter(reference => 
            reference.gender === patient.gender &&
            reference.age_min <= patientAge &&
            reference.age_max >= patientAge
          );

          return {
            ...determinant.toJSON(),
            Value_references: filteredReferences
          };
        });

        return {
          ...orderExam.toJSON(),
          Order: order,
          Exam: {
            ...exam.toJSON(),
            Determinants: determinants
          }
        };
      })
    );

    res.render('PortalPaciente.pug', { 
      patient, 
      results, 
      patientAge,
      hasResults: results.length > 0
    });
  } catch (error) {
    console.error('Error fetching patient results:', error);
    res.status(500).send('Error fetching patient results');
  }
});

// Función auxiliar para calcular la edad
function getAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}






/*
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login'); // Redirigir al login después de cerrar sesión
  });
});
*/

router.get('/logout', function(req, res) {
  // Solo redirige al login
  res.redirect('/login');
});
module.exports = router;









//no anda
/*

var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
const { User, Order, Exam, ExamDeterminant, Result } = require("../models");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const authToken = require("../middleware/auth");

// Página de login
router.get("/", function (req, res, next) {
  res.render("login");
});

// Manejo del login
router.post("/getinto", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  let user = await User.findOne({
    where: {
      email: body.email,
    },
  });

  if (user) {
    const validPassword = await bcrypt.compare(body.key, user.key);
    if (validPassword) {
      if (user.rol !== "patient") {
        // Usuarios que no son pacientes, se les asigna un token
        let token = jwt.sign(
          { id: user.id, username: user.last_name, rol: user.rol },
          "laboratoryDario",
          { expiresIn: "24h" }
        );
        res.json({ token });
      } else {
        // Pacientes no usan token, se guarda la sesión
        req.session.user = user;
        res.redirect("/patient");
      }
    } else {
      res.status(401).json({ mensaje: "Key/email incorrect" });
    }
  } else {
    res.redirect("/login");
  }
});

// Página principal para usuarios autenticados
router.get("/main", authToken, async (req, res) => {
  let token = req.usuario;
  if (token) {
    let admin = await User.findOne({
      where: {
        id: token.id,
        rol: { [Op.ne]: "patient" },
      },
    });
    if (admin) {
      res.render("menu.pug", { token: token, admin: admin });
    }
  } else {
    res.redirect("/login");
  }
});

// Ruta para el portal del paciente
router.get("/patient", async (req, res) => {
  let user = req.session.user;
  if (user && user.rol === "patient") {
    let patient = await User.findOne({
      where: {
        id: user.id,
        rol: "patient",
      },
    });
    if (patient) {
      let resultados = await Order.findAll({
        where: {
          userId: patient.id,
        },
        include: [
          {
            model: Exam,
            include: [
              {
                model: ExamDeterminant,
                include: [
                  {
                    model: Result,
                  },
                ],
              },
            ],
          },
        ],
      });

      res.render("PortalPaciente.pug", { patient: patient, resultados: resultados });
    }
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
*/