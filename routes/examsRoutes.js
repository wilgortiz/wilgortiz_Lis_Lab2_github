var express = require("express");
var router = express.Router();
const { Exam } = require("../models");
const { Determinant } = require("../models");
const { Value_reference } = require("../models");
const { Sample } = require("../models");
const { Op } = require("sequelize");
const{User}=require('../models');
const authToken = require("../middleware/auth");
const{admin}=require('../models');
const jwt = require('jsonwebtoken');
const logAudit = require('../utils/auditLogger');  // Importar la función de auditoría



/*
// GET Exams listing. sin sus relaciones 
router.get("/main/exam/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  switch (id) {
    case "exam":

      let exams = await Exam.findAll();
      res.render("menus/mainsExam/viewExam.pug", { exams: exams });
      break;







    case "determinant":
      let determinants = await Determinant.findAll();
      res.render("menus/mainsExam/viewDeterminant.pug", {
        determinants: determinants,
      });

      break;
    case "sample":
      let samples = await Sample.findAll();
      res.render("menus/mainsExam/viewSamples.pug", {
        samples: samples,
      });

      break;
    default:
      console.log("error");
      break;
  }
});
*/


/*
//este anda bien... tomarlo de base
router.get("/main/exam/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  switch (id) {
    case "exam":
      try {
        let exams = await Exam.findAll({
          include: [{
            model: Sample,
            through: { attributes: [] }, // No incluir atributos de la tabla intermedia
            attributes: ['type'] // Atributos que deseas mostrar de Sample
          }]
        });
        res.render("menus/mainsExam/viewExam.pug", { exams: exams });
      } catch (error) {
        console.error('Error al obtener examenes:', error);
        res.status(500).send('Error al obtener examenes');
      }
      break;

    case "sample":
      let samples = await Sample.findAll();
      res.render("menus/mainsExam/viewSamples.pug", {
        samples: samples,
      });
      break;



    case "determinant":
      //let determinants = await Determinant.findAll();
      let determinants = await Determinant.findAll({
        attributes: ['id', 'name', 'abbreviation', 'measurement', 'detail'],
      });
      console.log(determinants);
      res.render("menus/mainsExam/viewDeterminant.pug", {
        determinants: determinants,
      });
      console.log(determinants);

      break;
    default:
      res.status(404).send('Recurso no encontrado');
  }
});
*/




router.get("/main/exam/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  switch (id) {
    case "exam":
      try {
        let exams = await Exam.findAll({


          include: [{
            model: Sample,
            through: { attributes: [] },
            attributes: ['type']
          },
          {
            model: Determinant,
            through: { attributes: [] },
            attributes: ['name']
          }],
        });




        if (!exams) {
          return res.status(404).send("Examen no encontrado");
        }

        res.render("menus/mainsExam/viewExam.pug", { exams: exams });

      } catch (error) {
        console.error('Error al obtener examen:', error);
        res.status(500).send('Error al obtener examen');
      }
      break;

    case "sample":
      let samples = await Sample.findAll();
      res.render("menus/mainsExam/viewSamples.pug", {
        samples: samples,
      });
      break;



    case "determinant":
      //let determinants = await Determinant.findAll();
      let determinants = await Determinant.findAll({
        attributes: ['id', 'name', 'abbreviation', 'measurement', 'detail', 'active'],
      });
      console.log(determinants);
      res.render("menus/mainsExam/viewDeterminant.pug", {
        determinants: determinants,
      });
      console.log(determinants);

      break;
    default:
      res.status(404).send('Recurso no encontrado');
  }
});






/*
//VER MUESTRAS DE LA ORDEN
router.post("/order/viewSamples", async (req, res) => {
  try {

    let order = await Order.findOne({
      where: {
        id: req.body.id,
      },
      include: User,
    });

    let exams = await order.getExams();

    let samples = [];
    for (const exam of exams) {
      const examSamples = await exam.getSamples();
      samples = samples.concat(examSamples);
    }

    res.render("menus/mainsOrder/viewSamples.pug", {
      order: order,
      exams: exams,
      samples: samples,
    });
  } catch {
    console.log("error view values");
  }
});
*/
/*
router.get("/main/exam/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  
  if (id === "exam") {
    try {
      let exams = await Exam.findAll({
        include: {
          model: Sample,
          through: {
            model: ExamSample,
            // Opcionalmente, puedes agregar atributos adicionales de la tabla intermedia aquí si es necesario
          }
        }
      });
      
      res.render("menus/mainsExam/viewExam.pug", { exams: exams });
    } catch (error) {
      console.error("Error fetching exams and samples:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(404).send("Not Found");
  }
});
*/

/*
router.post('/main/exam/:id', async (req, res) => {
  try {
    const { id } = req.body;
    
    // Buscar el examen por su id e incluir las muestras asociadas
    let exam = await Exam.findOne({
      where: { id },
      include: {
        model: Sample,
        through: {
          attributes: []
        }
      }
    });

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Renderizar la vista con la información del examen y las muestras
    res.render('menus/mainsExam/viewExam.pug', {
      exam: exam,
      samples: exam.Samples
    });
  } catch (error) {
    console.log('Error view values', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
*/







/*
//VER MUESTRAS DE CADA EXAMEN
router.post("/main/exam/", async (req, res) => {
  try {

    let exam = await Exam.findOne({
      where: {
        id: req.body.id,
      },
      include: Sample,
    });
    //let exams = await Exam.findAll();
   // res.render("menus/mainsExam/viewExam.pug", { exams: exams });
    let exams = await exam.getExams();

    let samples = [];
    for (const exam of exams) {
      const examSamples = await exam.getSamples();
      samples = samples.concat(examSamples);
    }

    res.render("menus/mainsOrder/viewSamples.pug", {
      order: order,
      exams: exams,
      samples: samples,
    });
  } catch {
    console.log("error view values");
  }
});
*/






//ROUTES OF DETERMINANTS

//Add determinant
router.get("/addDeterminant", (req, res) => {
  try {
    res.render("menus/mainsExam/flotantes/flotanteAddDeterminant.pug");
  } catch {
    console.log(error);
  }
});





/*
//register determinant
router.post("/registerDeterminant", async (req, res) => {
  await Determinant.create({
    name: req.body.name,
    abbreviation: req.body.abbreviation,
    measurement: req.body.measurement,
    detail: req.body.detail,
    active: true,
  });

  let determinants = await Determinant.findAll();
  res.render("menus/mainsExam/viewDeterminant.pug", {
    determinants: determinants,
  });
});
*/



router.post("/registerDeterminant", async (req, res) => {
  try {
    await Determinant.create({
      name: req.body.name,
      abbreviation: req.body.abbreviation,
      measurement: req.body.measurement,
      detail: req.body.detail,
      active: true,
    });

    let determinants = await Determinant.findAll({
      attributes: ['id', 'name', 'abbreviation', 'measurement', 'detail', 'active', 'createdAt', 'updatedAt'],
    });

    res.render("menus/mainsExam/viewDeterminant.pug", {
      determinants: determinants,
    });
  } catch (error) {
    console.error('Error al registrar el determinante:', error);
    res.status(500).send('Error al registrar el determinante');
  }
});






//search determinant

router.post("/searchDeterminant", async (req, res) => {
  try {
    let determinants = await Determinant.findAll({
      where: {
        name: {
          [Op.like]: "%" + req.body.name + "%",
        },
      },
    });
    res.render("menus/mainsExam/tablaDeterminants.pug", {
      determinants: determinants,
    });
  } catch {
    console.log("error search determinant");
  }
});






/*
//sin auditar
//update determinant
router.post("/updateDeterminant", async (req, res) => {
  try {
    let determinant = await Determinant.findOne({
      where: {
        id: req.body.id,
      },
      attributes: { exclude: ['ExamSubGroupId'] } // Excluir ExamSubGroupId del resultado
    });
    res.render("menus/mainsExam/flotantes/flotanteUpdateDeterminant.pug", {
      determinant: determinant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener el determinante');
  }
});
*/



//con auditar
//update determinant
router.post("/updateDeterminant",authToken, async (req, res) => {
  try {
    let determinant = await Determinant.findOne({
      where: {
        id: req.body.id,
      },
      attributes: { exclude: ['ExamSubGroupId'] } // Excluir ExamSubGroupId del resultado
    });
    res.render("menus/mainsExam/flotantes/flotanteUpdateDeterminant.pug", {
      determinant: determinant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener el determinante');
  }
});







// Con auditar
router.post("/regUpdateDeterminant", authToken, async (req, res) => {
  try {
    const id = req.body.id;
    
    // Buscar el determinante original
    const oldDeterminant = await Determinant.findOne({
      where: { id: id },
      attributes: { exclude: ['ExamSubGroupId'] } // Excluir ExamSubGroupId del resultado
    });

    if (oldDeterminant) {
      // Clonar los valores antiguos para la auditoría
      const oldValues = {
        name: oldDeterminant.name,
        abbreviation: oldDeterminant.abbreviation,
        measurement: oldDeterminant.measurement,
        detail: oldDeterminant.detail,
        active: oldDeterminant.active
      };

      // Actualizar el determinante
      oldDeterminant.name = req.body.name;
      oldDeterminant.abbreviation = req.body.abbreviation;
      oldDeterminant.measurement = req.body.measurement;
      oldDeterminant.detail = req.body.detail;
      oldDeterminant.active = req.body.active;

      await oldDeterminant.save();

      // Clonar los valores nuevos para la auditoría
      const newValues = {
        name: oldDeterminant.name,
        abbreviation: oldDeterminant.abbreviation,
        measurement: oldDeterminant.measurement,
        detail: oldDeterminant.detail,
        active: oldDeterminant.active
      };

      // Obtener detalles del usuario para la auditoría
      const userId = req.usuario.id;
      const user = await User.findByPk(userId); // Cargar el usuario completo
      const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido'; // Concatenar nombres
      const userRole = req.usuario.rol;

      // Verifica los detalles del usuario
      if (!userId || !userName || !userRole) {
        console.error('Detalles del usuario no disponibles para auditoría', { userId, userName, userRole });
        return res.status(500).json({ error: 'Detalles del usuario no disponibles' });
      }

      // Llamar a la función de auditoría
      await logAudit(
        null,                    // entityId
        'Determinaciones',        // entityType
        userId,                // userId
        userName,              // userName
        userRole,              // userRole
        JSON.stringify(oldValues),   // oldValue
        JSON.stringify(newValues),   // newValue
        'Actualizar una determinacion'  
      );

      // Obtener todos los determinantes después de la actualización
      let determinants = await Determinant.findAll({
        attributes: { exclude: ['ExamSubGroupId'] } // Excluir ExamSubGroupId del resultado
      });

      // Renderizar la vista con los determinantes actualizados
      res.render("menus/mainsExam/viewDeterminant.pug", {
        determinants: determinants,
      });
    } else {
      res.status(404).send("Determinante no encontrado.");
    }
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("ERROR en la actualización del determinante.");
  }
});



/*
//sin auditar
//register Update Determinant, funcionando
router.post("/regUpdateDeterminant", async (req, res) => {
  try {
    const id = req.body.id;
    const determinant = await Determinant.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ['ExamSubGroupId'] } // Excluir ExamSubGroupId del resultado
    });
    if (determinant) {
      determinant.name = req.body.name;
      determinant.abbreviation = req.body.abbreviation;
      determinant.measurement = req.body.measurement;
      determinant.detail = req.body.detail;
      determinant.active = req.body.active;

      await determinant.save();
      //let determinants = await Determinant.findAll();
      let determinants = await Determinant.findAll({
        attributes: { exclude: ['ExamSubGroupId'] } // Excluir ExamSubGroupId del resultado
      });

      res.render("menus/mainsExam/viewDeterminant.pug", {
        determinants: determinants,
      });

    }
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("ERROR in determinant update.");
  }
});
*/





//delete determinant

router.post("/deleteDeterminant", async (req, res) => {
  try {
    let determinant = await Determinant.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (determinant) {
      (determinant.active = false), await determinant.save();
      let determinants = await Determinant.findAll();
      res.render("menus/mainsExam/viewDeterminant.pug", {
        determinants: determinants,
      });
    }
  } catch {
    res.status(500).send("Error al borrar el usuario.");
  }
});







/*
//view reference_values
router.post("/viewValues", async (req, res) => {
  try {
    let determinant = await Determinant.findOne({
      where: {
        id: req.body.id,
      },
    });

    let reference_values = await determinant.getValue_references();

    res.render("menus/mainsExam/viewValues.pug", {
      reference_values: reference_values,
      determinant: determinant,
    });
  } catch {
    console.log("error view values");
  }
});
*/





//con audit
//ver los valores de referencia de la determinacion
router.post("/viewValues",authToken, async (req, res) => {
  try {
    // Recuperar determinante por ID
    const determinant = await Determinant.findOne({
      where: {
        id: req.body.id,
      },
      attributes: { // Excluir 'ExamSubGroupId'
        exclude: ['ExamSubGroupId'],
      },
      include: [{
        model: Value_reference,
      }],
    });

    if (!determinant) {
      // Manejar caso donde no se encuentra el determinante
      return res.status(404).send("Determinante no encontrado");
    }

    // Los valores de referencia ya deberían estar incluidos en el objeto 'determinant'
    const referenceValues = determinant.Value_references || []; // Asegurarse de que es un arreglo

    // Renderizar la vista con datos
    res.render("menus/mainsExam/viewValues.pug", {
      referenceValues,
      determinant, // Aquí también se excluye 'ExamSubGroupId'
    });
  } catch (error) {
    console.error("Error al recuperar determinante o valores de referencia:", error);
    // Opcionalmente, registrar un mensaje más amigable para el cliente
    res.status(500).send("Ocurrió un error. Inténtalo de nuevo más tarde.");
  }
});



/*
//sin audit
//ver los valores de referencia de la determinacion
router.post("/viewValues", async (req, res) => {
  try {
    // Recuperar determinante por ID
    const determinant = await Determinant.findOne({
      where: {
        id: req.body.id,
      },
      attributes: { // Excluir 'ExamSubGroupId'
        exclude: ['ExamSubGroupId'],
      },
      include: [{
        model: Value_reference,
      }],
    });

    if (!determinant) {
      // Manejar caso donde no se encuentra el determinante
      return res.status(404).send("Determinante no encontrado");
    }

    // Los valores de referencia ya deberían estar incluidos en el objeto 'determinant'
    const referenceValues = determinant.Value_references || []; // Asegurarse de que es un arreglo

    // Renderizar la vista con datos
    res.render("menus/mainsExam/viewValues.pug", {
      referenceValues,
      determinant, // Aquí también se excluye 'ExamSubGroupId'
    });
  } catch (error) {
    console.error("Error al recuperar determinante o valores de referencia:", error);
    // Opcionalmente, registrar un mensaje más amigable para el cliente
    res.status(500).send("Ocurrió un error. Inténtalo de nuevo más tarde.");
  }
});
*/






/*
//sin auditar
//add Value
router.get("/addValue", (req, res) => {
  try {
    res.render("menus/mainsExam/flotantes/flotanteAddValue.pug");
  } catch {
    console.log(error);
  }
});
*/


//con auditar
//add Value
router.get("/addValue",authToken, (req, res) => {
  try {
    res.render("menus/mainsExam/flotantes/flotanteAddValue.pug");
  } catch {
    console.log(error);
  }
});







// Con auditar
router.post("/registerValue", authToken, async (req, res) => {
  try {
    // Crear el nuevo valor de referencia
    let valueReference = await Value_reference.create({
      gender: req.body.gender,
      age_min: req.body.age_min,
      age_max: req.body.age_max,
      pregnant: req.body.pregnant,
      max_value: req.body.max_value,
      min_value: req.body.min_value,
      max_limit: req.body.max_limit,
      min_limit: req.body.min_limit,
      active: true,
    });

    // Buscar el determinante
    let determinant = await Determinant.findOne({
      where: {
        id: req.body.determinantId,
      },
      attributes: [
        'id',
        'name',
        'abbreviation',
        'detail',
        'measurement',
        'active',
        'createdAt',
        'updatedAt'
      ]
    });

    // Asociación
    await determinant.addValue_reference(valueReference);
    // Buscar valores de referencia
    let reference_values = await determinant.getValue_references();

    // Obtener detalles del usuario para la auditoría
    const userId = req.usuario.id;
    const user = await User.findByPk(userId); // Cargar el usuario completo
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido'; // Concatenar nombres
    const userRole = req.usuario.rol;

    // Verifica los detalles del usuario
    console.log('Detalles del usuario:', { userId, userName, userRole });

    if (!userId || !userName || !userRole) {
      console.error('Detalles del usuario no disponibles para auditoría', { userId, userName, userRole });
      return res.status(500).json({ error: 'Detalles del usuario no disponibles' });
    }

    // Construir los valores actuales para la auditoría
    const newOrderValues = {
      gender: req.body.gender,
      age_min: req.body.age_min,
      age_max: req.body.age_max,
      pregnant: req.body.pregnant,
      max_value: req.body.max_value,
      min_value: req.body.min_value,
      max_limit: req.body.max_limit,
      min_limit: req.body.min_limit,
      active: true,
    };

    // Llamar a la función de auditoría
    await logAudit(
      null,                  // entityId
      'Determinacion',       // entityType
      userId,                // userId
      userName,              // userName
      userRole,              // userRole
      null,                  // oldValue
      JSON.stringify(newOrderValues),   // newValue
      'Agregar un nuevo valor de referencia'  
    );

    // Renderizar la vista
    res.render("menus/mainsExam/viewValues.pug", {
      referenceValues: reference_values,
      determinant: determinant,
    });
  } catch (error) {
    console.log("error register new value and view values of determinants", error);
  }
});


/*
//sin auditar
//funciona perfecto registrar valores de referencia
router.post("/registerValue", async (req, res) => {
  try {
    let valueReference = await Value_reference.create({
      gender: req.body.gender,
      age_min: req.body.age_min,
      age_max: req.body.age_max,
      pregnant: req.body.pregnant,
      max_value: req.body.max_value,
      min_value: req.body.min_value,
      max_limit: req.body.max_limit,
      min_limit: req.body.min_limit,
      active: true,
    });

    let determinant = await Determinant.findOne({
      where: {
        id: req.body.determinantId,
      },
      attributes: [
        'id',
        'name',
        'abbreviation',
        'detail',
        'measurement',
        'active',
        'createdAt',
        'updatedAt'
      ]
    });

    // Asociación
    await determinant.addValue_reference(valueReference);
    // Buscar valores de referencia
    let reference_values = await determinant.getValue_references();
    res.render("menus/mainsExam/viewValues.pug", {
      referenceValues: reference_values,
      //reference_values: reference_values,
      determinant: determinant,
    });
  } catch (error) {
    console.log("error register new value and view values of determinants", error);
  }
});
*/






/*
//register Value-reference
router.post("/registerValue", async (req, res) => {
  try {
    let valueReference = await Value_reference.create({
      gender: req.body.gender,
      age: req.body.age,
      pregnant: req.body.pregnant,
      max_value: req.body.max_value,
      min_value: req.body.min_value,
      max_limit: req.body.max_limit,
      min_limit: req.body.min_limit,
      active: true,
    });

    let determinant = await Determinant.findOne({
      where: {
        id: req.body.determinantId,
      },
    });

    //asociation
    await determinant.addValue_reference(valueReference);
    //search children ('s')
    let reference_values = await determinant.getValue_references();
    res.render("menus/mainsExam/viewValues.pug", {
      reference_values: reference_values,
      determinant: determinant,
    });
  } catch {
    console.log("error register new value and view values of determinants");
  }
});
*/




//update reference value
router.post("/updateValue", async (req, res) => {
  try {
    let referenceValue = await Value_reference.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.render("menus/mainsExam/flotantes/flotanteUpdateValue.pug", {
      referenceValue: referenceValue,
    });
  } catch (error) {
    console.log(error);
  }
});
//register Update reference value
router.post("/regUpdateValue", async (req, res) => {
  try {
    const id = req.body.id;
    const determinantId = req.body.determinantId; // Asegurarte de obtener correctamente el ID del determinante
    const referenceValue = await Value_reference.findOne({
      where: {
        id: id,
      },
    });

    if (referenceValue) {
      referenceValue.gender = req.body.gender;
      referenceValue.age_min = req.body.age_min;
      referenceValue.age_max = req.body.age_max;
      referenceValue.pregnant = req.body.pregnant;
      referenceValue.max_value = req.body.max_value;
      referenceValue.min_value = req.body.min_value;
      referenceValue.max_limit = req.body.max_limit;
      referenceValue.min_limit = req.body.min_limit;
      referenceValue.active = req.body.active;

      await referenceValue.save();

      let determinant = await Determinant.findOne({
        where: {
          id: determinantId, // Asegurarte de que el ID del determinante sea correcto
        },
        attributes: [
          'id',
          'name',
          'abbreviation',
          'detail',
          'measurement',
          'active',
          'createdAt',
          'updatedAt'
        ]
      });

      if (determinant) {
        let reference_values = await determinant.getValue_references();
        res.render("menus/mainsExam/viewValues.pug", {
          referenceValues: reference_values,
          determinant: determinant,
        });
      } else {
        console.error("Determinant not found with id:", determinantId);
        res.status(404).send("Determinant not found.");
      }
    } else {
      console.error("Reference value not found with id:", id);
      res.status(404).send("Reference value not found.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("ERROR in determinant update.");
  }
});




/*
//maso
//update reference value
router.post("/updateValue", async (req, res) => {
  try {
    let referenceValue = await Value_reference.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.render("menus/mainsExam/flotantes/flotanteUpdateValue.pug", {
      referenceValue: referenceValue,
    });
  } catch {
    console.log(error);
  }
});

//probando

//register Update reference value
router.post("/regUpdateValue", async (req, res) => {
  try {
    const id = req.body.id;
    const referenceValue = await Value_reference.findOne({
      where: {
        id: id,
      },
    });
    if (referenceValue) {
      (referenceValue.gender = req.body.gender),
        //(referenceValue.age = req.body.age),
        (referenceValue.age_min = req.body.age_min),
        (referenceValue.age_max = req.body.age_max),
        (referenceValue.pregnant = req.body.pregnant),
        (referenceValue.max_value = req.body.max_value),
        (referenceValue.min_value = req.body.min_value),
        (referenceValue.max_limit = req.body.max_limit),
        (referenceValue.min_limit = req.body.min_limit),
        (referenceValue.active = req.body.active),

        await referenceValue.save();
        let determinant = await Determinant.findOne({
          where: {
            id: req.body.determinantId,
          },
          attributes: [
            'id',
            'name',
            'abbreviation',
            'detail',
            'measurement',
            'active',
            'createdAt',
            'updatedAt'
          ]
        });
      let reference_values = await determinant.getValue_references();
      res.render("menus/mainsExam/viewValues.pug", {
        referenceValues: reference_values,
        determinant: determinant,
      });
    }
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("ERROR in determinant update.");
  }
});
*/

/*
//register Update reference value
router.post("/regUpdateValue", async (req, res) => {
  try {
    const id = req.body.id;
    const referenceValue = await Value_reference.findOne({
      where: {
        id: id,
      },
    });
    if (referenceValue) {
      (referenceValue.gender = req.body.gender),
        (referenceValue.age = req.body.age),
        (referenceValue.pregnant = req.body.pregnant),
        (referenceValue.max_value = req.body.max_value),
        (referenceValue.min_value = req.body.min_value),
        (referenceValue.max_limit = req.body.max_limit),
        (referenceValue.min_limit = req.body.min_limit),
        (referenceValue.active = req.body.active),
        await referenceValue.save();
        let determinant = await Determinant.findOne({
          where: {
            id: req.body.determinantId,
          },
          attributes: [
            'id',
            'name',
            'abbreviation',
            'detail',
            'measurement',
            'active',
            'createdAt',
            'updatedAt'
          ]
        });
      let reference_values = await determinant.getValue_references();
      res.render("menus/mainsExam/viewValues.pug", {
        referenceValues: reference_values,
        determinant: determinant,
      });
    }
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("ERROR in determinant update.");
  }
});
*/



router.post("/deleteValue", async (req, res) => {
  console.log(req.body); // Verifica el contenido de req.body
  try {
    //const determinantId = req.body.determinantId; // Asegurarte de obtener correctamente el ID del determinante

    // Eliminar el valor de referencia
    const result = await Value_reference.destroy({
      where: {
        id: req.body.id,
      },
    });

    if (result === 1) {
      // Obtener el determinante asociado para actualizar la vista
      
    let determinant = await Determinant.findOne({
      where: {
        id: req.body.determinantId,
      },
      attributes: [
        'id',
        'name',
        'abbreviation',
        'detail',
        'measurement',
        'active',
        'createdAt',
        'updatedAt'
      ]
    });

      if (determinant) {
        // Obtener las referencias de valor actualizadas
        const reference_values = await determinant.getValue_references();
        res.render("menus/mainsExam/viewValues.pug", {
          determinant: determinant,
          referenceValues: reference_values,
        });
      } else {
        res.status(404).send("Determinante no encontrado.");
      }
    } else {
      res.status(404).send("Referencia de valor no encontrada.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el valor de referencia.");
  }
});

/*
//delete reference value
//borrado logico, activo o inactivo
router.post("/deleteValue", async (req, res) => {
  try {
    let valueReference = await Value_reference.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (valueReference) {
      (valueReference.active = false), await valueReference.save();

      let determinant = await Determinant.findOne({
        where: {
          id: valueReference.DeterminantId,
        },
      });

      let reference_values = await determinant.getValue_references();
      console.log(reference_values);
      res.render("menus/mainsExam/viewValues.pug", {
        determinant: determinant,
        reference_values: reference_values,
      });
    }
  } catch {
    res.status(500).send("Error al borrar el usuario.");
  }
});
*/









//ROUTES SAMPLES



//sin auditar
//search Sample
router.post("/searchSample", async (req, res) => {
  try {
    let samples = await Sample.findAll({
      where: {
        type: {
          [Op.like]: "%" + req.body.name + "%",
        },
      },
    });

    res.render("menus/mainsExam/tablaSamples.pug", {
      samples: samples,
    });
  } catch {
    console.log("error search sample");
  }
});



//Add sample

router.get("/addSample", (req, res) => {
  try {
    res.render("menus/mainsExam/flotantes/flotanteAddSample.pug");
  } catch {
    console.log('error');
  }
});



/*
//con auditar
//search Sample
router.post("/searchSample",authToken, async (req, res) => {
  try {
    let samples = await Sample.findAll({
      where: {
        type: {
          [Op.like]: "%" + req.body.name + "%",
        },
      },
    });

    res.render("menus/mainsExam/tablaSamples.pug", {
      samples: samples,
    });
  } catch {
    console.log("error search sample");
  }
});
*/

/*
//con auditar
//Add sample
router.get("/addSample",authToken, (req, res) => {
  try {
    res.render("menus/mainsExam/flotantes/flotanteAddSample.pug");
  } catch {
    console.log('error');
  }
});
*/





//register sample
router.post("/registerSample", async (req, res) => {
  await Sample.create({
    type: req.body.type,
    detail: req.body.detail,
    active: true,
  });

  let samples = await Sample.findAll();
  res.render("menus/mainsExam/viewSamples.pug", {
    samples: samples,
  });
});

/*
//sin auditar
//Add sample
router.get("/addSample", (req, res) => {
  try {
    res.render("menus/mainsExam/flotantes/flotanteAddSample.pug");
  } catch {
    console.log('error');
  }
});


//register sample

router.post("/registerSample", async (req, res) => {
  await Sample.create({
    type: req.body.type,
    detail: req.body.detail,
    active: true,
  });

  let samples = await Sample.findAll();
  res.render("menus/mainsExam/viewSamples.pug", {
    samples: samples,
  });
});
*/



//update sample
router.post("/updateSample", async (req, res) => {
  try {
    let sample = await Sample.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.render("menus/mainsExam/flotantes/flotanteUpdateSample.pug", {
      sample: sample,
    });
  } catch {
    console.log('error');
  }
});

//register Update sample
router.post("/regUpdateSample", async (req, res) => {
  try {
    const id = req.body.id;
    const sample = await Sample.findOne({
      where: {
        id: id,
      },
    });
    if (sample) {
      sample.type = req.body.type;
      sample.detail.abbreviation = req.body.detail;
      sample.active = req.body.active;

      await sample.save();
      let samples = await Sample.findAll();
      res.render("menus/mainsExam/viewSamples.pug", {
        samples: samples,
      });
    }
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send("ERROR in sample update.");
  }
});
//delete sample
router.post("/deleteSample", async (req, res) => {
  try {
    let sample = await Sample.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (sample) {
      (sample.active = false), await sample.save();
      let samples = await Sample.findAll();
      res.render("menus/mainsExam/tablaSamples.pug", {
        samples: samples,
      });
    }
  } catch {
    res.status(500).send("Error al borrar el usuario.");
  }
});











//RUTAS para los EXAMENES

/*
//search exam
router.post("/searchExam", async (req, res) => {
  try {
    let exams = await Exam.findAll({
      where: {
        name: {
          [Op.like]: "%" + req.body.name + "%",
        },
      },
    });
    res.render("menus/mainsExam/tablaExams.pug", {
      exams: exams,
    });
  } catch {
    console.log("error search exam");
  }
});
*/

//probando search examn
router.post("/searchExam", async (req, res) => {
  try {
    let exams = await Exam.findAll({
      where: {
        name: {
          [Op.like]: "%" + req.body.name + "%",
        },
      },
      include: [
        {
          model: Sample,
          attributes: ['type'] // Asegúrate de incluir los atributos necesarios
        },
        {
          model: Determinant,
          through: { attributes: [] },
          attributes: ['name']
        }
      ]
    });
    res.render("menus/mainsExam/tablaExams.pug", {
      exams: exams,
    });
  } catch (error) {
    console.log("error search exam", error);
  }
});







/*
//Add Exam
router.get("/addExam", (req, res) => {
  try {
    res.render("menus/mainsExam/flotantes/flotanteAddExam.pug");
  } catch {
    console.log('error');
  }
});
*/
/*
//ANDANDO
router.get("/addExam", async (req, res) => {
  try {
    let samples = await Sample.findAll({
      attributes: ['id', 'type']
    });
    res.render("menus/mainsExam/flotantes/flotanteAddExam.pug", { samples: samples });
  } catch (error) {
    console.error('Error al obtener tipos de muestra:', error);
    res.status(500).send('Error al obtener tipos de muestra');
  }
});
*/



//probando, agregando determinaciones
router.get("/addExam",authToken, async (req, res) => {
  try {
    let samples = await Sample.findAll({
      attributes: ['id', 'type']
    });
    let determinants = await Determinant.findAll({
      attributes: ['id', 'name']
    });
    res.render("menus/mainsExam/flotantes/flotanteAddExam.pug", { samples: samples, determinants: determinants });
  } catch (error) {
    console.error('Error al obtener tipos de muestra o determinaciones:', error);
    res.status(500).send('Error al obtener tipos de muestra o determinaciones');
  }
});



/*
//register exam
router.post("/registerExam", async (req, res) => {
  await Exam.create({
    name: req.body.name,
    abbreviation: req.body.abbreviation,
    detail: req.body.detail,
    active: true,
  });

  let exams = await Exam.findAll();
  res.render("menus/mainsExam/viewExam.pug", {
    exams: exams,
  });
});
*/



/*
//ANDANDO
router.post("/registerExam", async (req, res) => {
  try {
    const { name, abbreviation, detail, sampleType } = req.body;

    // Crear el nuevo examen
    const newExam = await Exam.create({
      name: name,
      abbreviation: abbreviation,
      detail: detail,
      active: true,
    });

    // Asociar el tipo de muestra con el nuevo examen
    if (sampleType) {
      const sample = await Sample.findByPk(sampleType);
      if (sample) {
        await newExam.addSample(sample);
      }
    }

    // Obtener todos los exámenes para renderizar la vista actualizada
    let exams = await Exam.findAll({
      include: [{
        model: Sample,
        through: { attributes: [] }, // No incluir atributos de la tabla intermedia
        attributes: ['type'] // Atributos que deseas mostrar de Sample
      }]
    });

    res.render("menus/mainsExam/viewExam.pug", { exams: exams });
  } catch (error) {
    console.error('Error al registrar el examen:', error);
    res.status(500).send('Error al registrar el examen');
  }
});
*/


//anda con audit
router.post("/registerExam",authToken, async (req, res) => {
  try {
    const { name, abbreviation, detail, sampleType, determinants } = req.body;

    const newExam = await Exam.create({
      name: name,
      abbreviation: abbreviation,
      detail: detail,
      active: true,
    });

    if (sampleType) {
      const sample = await Sample.findByPk(sampleType);
      if (sample) {
        await newExam.addSample(sample);
      }
    }

    if (determinants && determinants.length > 0) {
      const determinantInstances = await Determinant.findAll({
        attributes: ['id', 'name', 'abbreviation', 'detail', 'measurement', 'active', 'createdAt', 'updatedAt'],
        where: {
          id: {
            [Op.in]: determinants,
          },
        },
      });
      await newExam.addDeterminants(determinantInstances);
    }

    let exams = await Exam.findAll({
      include: [{
        model: Sample,
        through: { attributes: [] },
        attributes: ['type'],
      }, {
        model: Determinant,
        through: { attributes: [] },
        attributes: ['name'],
      }]
    });

    // Obtener detalles del usuario para la auditoría
    const userId = req.usuario.id;
    const user = await User.findByPk(userId); // Cargar el usuario completo
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido'; // Concatenar nombres
    const userRole = req.usuario.rol;

    // Verifica los detalles del usuario
    console.log('Detalles del usuario:', { userId, userName, userRole });

    if (!userId || !userName || !userRole) {
      console.error('Detalles del usuario no disponibles para auditoría', { userId, userName, userRole });
      return res.status(500).json({ error: 'Detalles del usuario no disponibles' });
    }

    // Llamar a la función de auditoría
    await logAudit(
      null,                      // entityId (ID del nuevo examen)
      'Examen',                       // entityType
      userId,                         // userId
      userName,                       // userName
      userRole,                       // userRole
      null,                           // oldValue (no hay valor anterior en este caso)
      JSON.stringify({
        name: newExam.name,
        abbreviation: newExam.abbreviation,
        detail: newExam.detail,
        sampleType: sampleType || 'N/A',
        determinants: determinants || 'N/A'
      }),                            // newValue
      'Registro de un nuevo examen'    // actionType
    );




    
    res.render("menus/mainsExam/viewExam.pug", { exams: exams });
  } catch (error) {
    console.error('Error al registrar el examen:', error);
    res.status(500).send('Error al registrar el examen');
  }
});




/*
//anda sin auditar
//PROBANDO AGREGANDO DETERMINANTES
router.post("/registerExam", async (req, res) => {
  try {
    const { name, abbreviation, detail, sampleType, determinants } = req.body;

    const newExam = await Exam.create({
      name: name,
      abbreviation: abbreviation,
      detail: detail,
      active: true,
    });

    if (sampleType) {
      const sample = await Sample.findByPk(sampleType);
      if (sample) {
        await newExam.addSample(sample);
      }
    }

    if (determinants && determinants.length > 0) {
      const determinantInstances = await Determinant.findAll({
        attributes: ['id', 'name', 'abbreviation', 'detail', 'measurement', 'active', 'createdAt', 'updatedAt'],
        where: {
          id: {
            [Op.in]: determinants,
          },
        },
      });
      await newExam.addDeterminants(determinantInstances);
    }

    let exams = await Exam.findAll({
      include: [{
        model: Sample,
        through: { attributes: [] },
        attributes: ['type'],
      }, {
        model: Determinant,
        through: { attributes: [] },
        attributes: ['name'],
      }]
    });

    res.render("menus/mainsExam/viewExam.pug", { exams: exams });
  } catch (error) {
    console.error('Error al registrar el examen:', error);
    res.status(500).send('Error al registrar el examen');
  }
});
*/











/*
// Eliminar examen
router.delete("/deleteExam/:id", async (req, res) => {
  try {
    const examId = req.params.id;
    await Exam.destroy({ where: { id: examId } });

    let exams = await Exam.findAll();
    res.render("menus/mainsExam/viewExam.pug", {
      exams: exams,
    });
  } catch (error) {
    console.log("error delete exam", error);
    res.status(500).send("Error deleting exam");
  }
});
*/




/*
//probando
// Eliminar examen asociado a sample
router.delete("/deleteExam/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Encontrar el examen
    const exam = await Exam.findByPk(id, {
      include: [{
        model: Sample,
        through: { attributes: [] }
      }]
    });

    if (exam) {
      // Eliminar las asociaciones en la tabla intermedia
      await exam.setSamples([]);

      // Eliminar el examen
      await exam.destroy();

      // Obtener todos los exámenes para renderizar la vista actualizada
      let exams = await Exam.findAll({
        include: [{
          model: Sample,
          through: { attributes: [] },
          attributes: ['type']
        }]
      });

      res.render("menus/mainsExam/viewExam.pug", { exams: exams });
    } else {
      res.status(404).send('Examen no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar el examen:', error);
    res.status(500).send('Error al eliminar el examen');
  }
});
*/


/*
//sin auditar
//probando eliminar examen asociado a determinants y samples
// Eliminar examen
router.delete("/deleteExam/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Encontrar el examen
    const exam = await Exam.findByPk(id, {
      include: [{
        model: Sample,
        through: { attributes: [] }
      }, {
        model: Determinant,
        through: { attributes: [] },
        attributes: ['name'],
      }]
    });

    if (exam) {
      // Eliminar las asociaciones en la tabla intermedia con muestras
      await exam.setSamples([]);

      // Eliminar las asociaciones en la tabla intermedia con determinaciones
      await exam.setDeterminants([]);

      // Eliminar el examen
      await exam.destroy();

      // Obtener todos los exámenes para renderizar la vista actualizada
      let exams = await Exam.findAll({
        include: [{
          model: Sample,
          through: { attributes: [] },
          attributes: ['type']
        }, {
          model: Determinant,
          through: { attributes: [] },
          attributes: ['name']
        }]
      });

      res.render("menus/mainsExam/viewExam.pug", { exams: exams });
    } else {
      res.status(404).send('Examen no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar el examen:', error);
    res.status(500).send('Error al eliminar el examen');
  }
});
*/




//con aduitoria
// Ruta para eliminar un examen
router.delete("/deleteExam/:id", authToken, async (req, res) => {
  try {
    const id = req.params.id;

    // Encontrar el examen
    const exam = await Exam.findByPk(id, {
      include: [{
        model: Sample,
        through: { attributes: [] }
      }, {
        model: Determinant,
        through: { attributes: [] },
        attributes: ['name'],
      }]
    });

    if (exam) {
      // Eliminar las asociaciones en la tabla intermedia con muestras
      await exam.setSamples([]);

      // Eliminar las asociaciones en la tabla intermedia con determinaciones
      await exam.setDeterminants([]);

      // Eliminar el examen
      await exam.destroy();

      // Obtener todos los exámenes para renderizar la vista actualizada
      let exams = await Exam.findAll({
        include: [{
          model: Sample,
          through: { attributes: [] },
          attributes: ['type']
        }, {
          model: Determinant,
          through: { attributes: [] },
          attributes: ['name']
        }]
      });




      // Obtener detalles del usuario para la auditoría
    const userId = req.usuario.id;
    const user = await User.findByPk(userId); // Cargar el usuario completo
    const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido'; // Concatenar nombres
    const userRole = req.usuario.rol;

    // Verifica los detalles del usuario
    console.log('Detalles del usuario:', { userId, userName, userRole });

    if (!userId || !userName || !userRole) {
      console.error('Detalles del usuario no disponibles para auditoría', { userId, userName, userRole });
      return res.status(500).json({ error: 'Detalles del usuario no disponibles' });
    }

    // Llamar a la función de auditoría
    await logAudit(
      null,                  // entityId
      'Examen',              // entityType
      userId,               // userId
      userName,             // userName
      userRole,             // userRole
      JSON.stringify({ id }),  // oldValue (solo ID del examen eliminado)
      null,   
      'Eliminacion de un examen'  
    );
      res.render("menus/mainsExam/viewExam.pug", { exams: exams });
    } else {
      res.status(404).send('Examen no encontrado');
    }
  } catch (error) {
    console.error('Error al eliminar el examen:', error);
    res.status(500).send('Error al eliminar el examen');
  }
});







// router.post("/addExam", async (req, res) => {
//   try {
//     const exam = await Exam.create({
//       name: req.body.name,
//       detail: req.body.detail,
//       active: true,
//     });
//     res.render("messages/messExam/messAddExam.pug", { exam: exam });
//   } catch {
//     console.error(error);
//     res.status(500).send("Error al registrar el usuario.");
//   }
// });

// router.get("/addExamSubGroup", function (req, res) {
//   res.render("menus/mainsExam/flotantes/flotanteAddExamSubGroup.pug");
// });

// router.post("/registerExamSubGroup", async (req, res) => {
//   //busco el padre
//   let exam = await Exam.findOne({
//     where: {
//       id: req.body.examId,
//     },
//   });
//   //creo el hijo
//   let examSubGroup = await Exam_sub_group.create({
//     name: req.body.name,
//     detail: req.body.detail,
//     active: true,
//   });
//   //relaciono hijo con padre
//   await exam.addExam_sub_group(examSubGroup);
//   //busco hijos de padre para que aparezan en la tabla del render acordarse de la 's'
//   let children = await exam.getExam_sub_groups();

//   res.render("menus/mainsExam/addExamSubGroup.pug", {
//     children: children,
//   });
// });

// router.post("/deleteExamSubGroup", async (req, res) => {
//   try {
//     //busco el examSubGroup
//     let examSubGroup = await Exam_sub_group.findOne({
//       where: {
//         id: req.body.id,
//       },
//     });
//     //busco el examen padre
//     let idExam = examSubGroup.ExamId;
//     let exam = await Exam.findOne({
//       where: {
//         id: idExam,
//       },
//     });
//     //borro el exam sub group pero antes sus determinantes asociados

//     let determinants = await examSubGroup.getDeterminants();
//     determinants.forEach((determinant) => {
//       determinant.destroy();
//     });
//     // await exam.removeExam_sub_group(examSubGroup)
//     await examSubGroup.destroy();
//     //busco hijos de padre para que aparezan en la tabla del render acordarse de la 's'
//     let children = await exam.getExam_sub_groups();

//     res.render("menus/mainsExam/addExamSubGroup.pug", {
//       children: children,
//     });
//   } catch {
//     res.status(500).send("Error al borrar el usuario.");
//   }
// });

// router.post("/viewDeterminants", async (req, res) => {
//   try {
//     let examSubGroup = await Exam_sub_group.findOne({
//       where: {
//         id: req.body.id,
//       },
//     });

//     if (examSubGroup) {
//       res.render("menus/mainsExam/viewDeterminant.pug", {
//         examSubGroup: examSubGroup,
//       });
//     } else {
//     }
//   } catch {
//     console.error(error);
//     res.status(500).send("Error al registrar el usuario.");
//   }
// });

// router.get("/addDeterminant", function (req, res) {
//   res.render("menus/mainsExam/flotantes/flotanteAddDeterminant.pug");
// });

// router.get("/determinant",(req,res) => {
//   res.render('menus/mainsExam/Determinant/viewDeterminant.pug')
// })
module.exports = router;
