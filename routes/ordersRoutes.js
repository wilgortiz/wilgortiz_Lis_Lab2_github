var express = require("express");
var router = express.Router();
const { Exam } = require("../models");
const { Sample } = require("../models");
const { User } = require("../models");
const { Order } = require("../models");
const { OrderExam } = require("../models");
const { OrderSample } = require("../models");
const { Op } = require("sequelize");
const { ExamDeterminant } = require("../models");
const { Determinant } = require("../models");
const { sequelize } = require('../models'); // Importar sequelize
const { ExamSample } = require("../models");
const { Result } = require("../models");
const { Value_reference } = require("../models");
const moment = require('moment');
require('moment/locale/es');
const authToken = require("../middleware/auth");
const{admin}=require('../models');
const jwt = require('jsonwebtoken');
const logAudit = require('../utils/auditLogger');  // Importar la función de auditoría


// Configura moment para usar el idioma español
moment.locale('es');
//route GET add patient

router.get("/order/addPatient", async (req, res) => {
  let patients = await User.findAll({
    where: {
      rol: "patient",
      active: true,
    },
  });
  res.render("menus/mainsOrder/flotantes/flotanteAddOrder.pug", {
    patients: patients,
  });
});





/*
//agregar orden. addOrder POST
router.post("/order/addOrder", async (req, res) => {
  let patient = await User.findOne({
    where: {
      id: req.body.id,
    },
  });

  let newOrder = await Order.create({
    state: "Esperando toma de muestra",
    //state:"inicial",
    active: true,
    createdAt: fechaPredefinida,      // Asigna la fecha actual como createdAt
    entregedAt: fechaPredefinida,    // Asigna la fecha actual como entregedAt 
  });

  await patient.addOrder(newOrder);

  let patients = await User.findAll({
    where: {
      rol: "patient",
      active: true,
    },
  });
  let orders = await Order.findAll({
    include: User,
  });
  res.render("menus/mainOrder.pug", { orders: orders });
});
*/



/*
//FUNCIONA BIEN, HAY QUE MEJORAR LA FECHA DE CREACION DE ORDEN
router.post("/order/addOrder", async (req, res) => {
  let patient = await User.findOne({
    where: {
      id: req.body.id,
    },
  });


  let newOrder = await Order.create({
    state: "Esperando toma de muestra",
    active: true,
    fechaIngreso: "2024-07-10", // Asigna la fecha actual como createdAt
    //fechaEntregaResultados: "2024-07-10" // Asigna la fecha actual como entregedAt
  fechaEntregaResultados: "null",
  });

  await patient.addOrder(newOrder);

  let patients = await User.findAll({
    where: {
      rol: "patient",
      active: true,
    },
  });
  let orders = await Order.findAll({
    include: User,
  });
  res.render("menus/mainOrder.pug", { orders: orders });
});
*/

/*
//anda perfecto fecha en ingles
router.post("/order/addOrder", async (req, res) => {
  try {
    // Encuentra al paciente
    let patient = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    // Crea la nueva orden
    let newOrder = await Order.create({
      state: "Esperando toma de muestra",
      active: true,
      fechaEntregaResultados: null, // O 'null', si quieres mantenerlo como null
    });

    // Asigna la fecha de creación a fechaIngreso
    newOrder.fechaIngreso = newOrder.createdAt;
    await newOrder.save();

    // Asocia la orden con el paciente
    await patient.addOrder(newOrder);

    // Obtén la lista de pacientes y órdenes para renderizar
    let patients = await User.findAll({
      where: {
        rol: "patient",
        active: true,
      },
    });
    let orders = await Order.findAll({
      include: User,
    });

    // Renderiza la vista con las órdenes
    res.render("menus/mainOrder.pug", { orders: orders });
  } catch (error) {
    console.error("Error al agregar la orden:", error);
    res.status(500).send("Error al agregar la orden");
  }
});
*/

//ruta para auditar
router.post('/order/auditoriasGlobales',authToken, async (req, res) => {
  const { oldValue, newValue, entityId, entityType, actionType } = req.body;

  try { // Obtener detalles del usuario para la auditoría
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
      entityId,                  // entityId
      entityType,              // entityType
      userId,               // userId
      userName,             // userName
      userRole,             // userRole
      oldValue,   // oldValue
      newValue,   // newValue
      actionType   // actionType
    );

    res.status(200).json({ message: 'Auditoría registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar la auditoría:', error);
    res.status(500).json({ error: 'Error al registrar la auditoría' });
  }
});







router.post("/order/addOrder", async (req, res) => {
  try {
    // Encuentra al paciente
    let patient = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    // Crea la nueva orden
    let newOrder = await Order.create({
      state: "Esperando toma de muestra",
      active: true,
      fechaEntregaResultados: "null", // O 'null', si quieres mantenerlo como null
    });

    // Asigna la fecha de creación a fechaIngreso
    newOrder.fechaIngreso = newOrder.createdAt;
    await newOrder.save();

    // Asocia la orden con el paciente
    await patient.addOrder(newOrder);

    // Obtén la lista de pacientes y órdenes para renderizar
    let patients = await User.findAll({
      where: {
        rol: "patient",
        active: true,
      },
    });
    let orders = await Order.findAll({
      include: User,
    });

    // Formatea la fecha de ingreso con fecha y hora en castellano antes de renderizar
    orders = orders.map(order => {
      order.fechaIngresoFormatted = moment(order.fechaIngreso).format('LLLL');
      return order;
    });

    // Renderiza la vista con las órdenes
    res.render("menus/mainOrder.pug", { orders: orders });
  } catch (error) {
    console.error("Error al agregar la orden:", error);
    res.status(500).send("Error al agregar la orden");
  }
});



/*
//intentando fecha en castellano, aun no funciona
router.post("/order/addOrder", async (req, res) => {
  try {
    // Encuentra al paciente
    let patient = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    // Crea la nueva orden
    let newOrder = await Order.create({
      state: "Esperando toma de muestra",
      active: true,
      fechaEntregaResultados: null, // O 'null', si quieres mantenerlo como null
    });

    // Convierte createdAt a un objeto Date
    let createdAtDate = new Date(newOrder.createdAt);
    console.log('CreatedAt:', createdAtDate);

    // Asegúrate de que createdAt es una fecha válida
    if (!isNaN(createdAtDate.getTime())) {
      // Formatea la fecha y hora para datetime en español (Argentina)
      let options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric', 
        timeZoneName: 'short' 
      };
      let fechaIngreso = createdAtDate.toLocaleDateString('es-AR', options);
      newOrder.fechaIngreso = fechaIngreso;
    } else {
      throw new Error('Fecha de creación no válida');
    }

    // Guarda la orden con la fecha formateada
    await newOrder.save();

    // Asocia la orden con el paciente
    await patient.addOrder(newOrder);

    // Obtén la lista de pacientes y órdenes para renderizar
    let patients = await User.findAll({
      where: {
        rol: "patient",
        active: true,
      },
    });
    let orders = await Order.findAll({
      include: User,
    });

    // Renderiza la vista con las órdenes
    res.render("menus/mainOrder.pug", { orders: orders });
  } catch (error) {
    console.error("Error al agregar la orden:", error);
    res.status(500).send("Error al agregar la orden");
  }
});
*/


/*
//ruta para borrar la orden de la base de datos definitivamente,sin auditoria
router.post("/order/cancelOrderDef", async (req, res) => {
  const { id } = req.body;

  try {
    const deletedOrder = await Order.destroy({
      where: { id: id }
    });

    if (deletedOrder === 0) {
      return res.status(404).json({ success: false, message: "Orden no encontrada" });
    }

    res.json({ success: true, message: "Orden eliminada con éxito" });
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    res.status(500).json({ success: false, message: "Error al eliminar la orden" });
  }
});
*/

//ruta para borrar la orden de la base de datos definitivamente,con auditoria
router.post("/order/cancelOrderDef",authToken, async (req, res) => {
  const { id } = req.body;

  try {
    const deletedOrder = await Order.destroy({
      where: { id: id }
    });

    if (deletedOrder === 0) {
      return res.status(404).json({ success: false, message: "Orden no encontrada" });
    }


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
  'Orden',              // entityType
  userId,               // userId
  userName,             // userName
  userRole,             // userRole
  JSON.stringify({orderId: id}), // oldValue (Detalles de la orden eliminada, si es necesario)
  null,          
  'Eliminacion de Orden'  
);


console.log('Registrando auditoría con:', {
  entityId: null,
  entityType: 'Orden',
  userId,
  userName,
  userRole,
  oldValue: JSON.stringify({orderId: id}),
  newValue: null,
  actionType: 'Eliminacion de Orden'
});

    res.json({ success: true, message: "Orden eliminada con éxito" });
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    res.status(500).json({ success: false, message: "Error al eliminar la orden" });
  }
});




//probando, cancelar orden, borrado logico, cuando la orden sea completada y no se muestre en la tabla principal
router.post("/order/cancelOrder", async (req, res) => {
  let order = await Order.findOne({
    where: {
      id: req.body.id,
    },
    include: User,
  });
  if (!order) {
    return res.status(404).send("Order not found");
  }
  order.active = false;
  await order.save();
  res.redirect("/orders");
});





//view exams of order
/*
router.post("/order/viewExams", async (req, res) => {
  try {
    let order = await Order.findOne({
      where: {
        id: req.body.id,
      },
      include: User,
    });

    let exams = await order.getExams();

    res.render("menus/mainsOrder/viewExams.pug", {
      order: order,
      exams: exams,
    });
  } catch {
    console.log("error view values");
  }
});
*/

//probando
router.post("/order/viewExams", async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        User,
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              attributes: ['name']
            }
          ]
        }
      ],
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    // Los exámenes estarán incluidos en los OrderExams del objeto order
    const exams = order.OrderExams.map(orderExam => orderExam.Exam);

    res.render("menus/mainsOrder/viewExams.pug", {
      order: order,
      exams: exams,
    });
  } catch (err) {
    console.error("Error viewing exams:", err);
    res.status(500).send("Error viewing exams");
  }
});


/*anda
router.post("/order/viewExams", async (req, res) => {
  try {
    let order = await Order.findOne({
      where: {
        id: req.body.id,
      },
      include: User,
    });

    if (!order) {
      return res.status(404).send("Order not found");
    }

    //let exams = await order.getExams();

    res.render("menus/mainsOrder/viewExams.pug", {
      order: order,
      exams: exams,
    });
  } catch (err) {
    console.error("Error viewing exams:", err);
    res.status(500).send("Error viewing exams");
  }
});
*/



/*
//route add exam
router.post("/order/addExam", async (req, res) => {
  let orderId = req.body.id;
  let exams = await Exam.findAll({
    where: {
      [Op.or]: [
        {
          "$Orders.id$": null, // Exámenes no asociados a ninguna orden
        },
        {
          "$Orders.id$": { [Op.ne]: orderId }, // Exámenes no asociados a la orden con id de la order
        },
      ],
    },
    include: {
      model: Order,
      required: false,
    },
  });
  res.render("menus/mainsOrder/flotantes/flotanteAddExam.pug", {
    exams: exams,
  });
});


//route add exams of order
router.post("/order/regExams", async (req, res) => {
  console.log(req.body)
  try {
    let asociacion = await OrderExam.create({
      OrderId: req.body.orderId,
      ExamId: req.body.id,
    });

    console.log(asociacion)

    let orderId = req.body.orderId;
    let exams = await Exam.findAll({
      where: {
        [Op.or]: [
          {
            "$Orders.id$": null, // Exámenes no asociados a ninguna orden
          },
          {
            "$Orders.id$": { [Op.ne]: orderId }, // Exámenes no asociados a la orden con id de la order
          },
        ],
      },
      include: {
        model: Order,
        required: false,
      },
    });
    res.render("menus/mainsOrder/flotantes/flotanteAddExam.pug", {
      exams: exams,
    });
  } catch {
    console.log("error generate asociation exam and order");
  }
});
*/








/*
//probando
router.post("/order/addExam", async (req, res) => {
  let orderId = req.body.id;
  let exams = await Exam.findAll({
    where: {
      [Op.or]: [
        {
          "$Orders.id$": null, // Exámenes no asociados a ninguna orden
        },
        {
          "$Orders.id$": { [Op.ne]: orderId }, // Exámenes no asociados a la orden con id de la order
        },
      ],
    },
    include: {
      model: Order,
      required: false,
    },
  });
  res.render("menus/mainsOrder/flotantes/flotanteAddExam.pug", {
    exams: exams,
  });
});
router.post('/order/regExams', async (req, res) => {
  try {
    const { examId, orderId } = req.body;

    // Verifica que la orden exista
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    // Verifica que el examen exista
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(400).json({ error: 'Exam not found' });
    }

    // Crea la asociación
    const orderExam = await OrderExam.create({
      ExamId: examId,
      OrderId: orderId
    });

    res.status(201).json({ message: 'Exam added to order successfully', orderExam });
  } catch (error) {
    console.error('Error generating association between exam and order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/

















// detalles de orden
router.get('/order/getOrderDetails/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        //attributes: ['first_name', 'last_name', 'diagnostic', 'pregnant'] // Incluye el diagnóstico
      }]
    });
    if (order) {
      console.log('Detalles de la orden:', order.toJSON());
      //res.render('menus/mainsOrder/flotantes/flotanteUpdateOrder.pug');
      res.json(order);
    } else {
      res.status(404).send('Orden no encontrada');
    }
  } catch (error) {
    res.status(500).send('Error al obtener detalles de la orden');
  }
});




/*
//probar para estado de orden
// detalles de orden, para actualizar estado de orden
router.get('/order/getStateOrderDetails/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
      include: [{
        model: User,
        //attributes: ['first_name', 'last_name', 'diagnostic', 'pregnant'] // Incluye el diagnóstico
      }]
    });
    if (order) {
      console.log('Detalles de la orden:', order.toJSON());
      //res.render('menus/mainsOrder/flotantes/flotanteUpdateOrder.pug');
      res.json(order);
    } else {
      res.status(404).send('Orden no encontrada');
    }
  } catch (error) {
    res.status(500).send('Error al obtener detalles de la orden');
  }
});
*/




router.post("/order/removeExamen2", async (req, res) => {
  try {
    let orderId = req.body.orderId;
    let examId = req.body.id;

    // Eliminar la asociación entre el examen y la orden
    const numDestroyed = await OrderExam.destroy({
      where: {
        OrderId: orderId,
        ExamId: examId,
      },
    });

    if (numDestroyed === 0) {
      return res.status(404).json({ success: false, message: 'No se encontró la asociación entre la orden y el examen.' });
    }

    res.status(200).json({ success: true, message: 'Examen eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar el examen de la orden:", error);
    res.status(500).json({ success: false, message: "Error al eliminar el examen de la orden." });
  }
});










/*
// Ruta para obtener detalles de la orden por ID
router.get('/order/getOrderDetails/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({
      where: { id: orderId },
      include: [{ model: User }]
    });

    if (!order) {
      return res.status(404).send('Orden no encontrada');
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los detalles de la orden');
  }
});
*/



/*
//anda, sin auditar
router.post('/order/regUpdateOrder', async (req, res) => {
  try {
    const { id, patient_name, diagnostic, pregnant, state, fechaIngreso, fechaEntregaResultados, observations } = req.body;

    console.log('Datos recibidos:', req.body);

    // Buscar la orden por ID
    const order = await Order.findByPk(id, {
      include: User // Incluir el modelo User
    });

    if (!order) {
      console.error('Orden no encontrada con ID:', id);
      return res.status(404).send('Orden no encontrada');
    }

    // Actualizar los campos de la orden
    order.patient_name = patient_name;
    order.diagnostic = diagnostic;
    order.state = state;
    order.fechaIngreso = fechaIngreso;
    order.fechaEntregaResultados = fechaEntregaResultados;
    order.observations = observations;

    // Verificar si el usuario está asociado a la orden
    if (order.User) {
      order.User.pregnant = parseInt(pregnant, 10); // Asegurarse de que sea un número entero (0 o 1)
      await order.User.save(); // Guardar los cambios en el usuario
    }

    await order.save(); // Guardar los cambios en la orden
    res.status(200).send('Orden actualizada exitosamente');


    // Enviar respuesta JSON indicando éxito
    //res.json({ success: true });

    //res.send('Orden actualizada con éxito');
    //res.redirect("menus/mainOrder.pug", { orders: order });

    // Renderizar la vista con los datos actualizados
    //res.render("menus/mainOrder.pug", { order }); // Pasar el objeto de orden actualizado a la vista
    //res.render('menus/mainOrder.pug', { order, message: '¡La orden se ha actualizado exitosamente!' });
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).send('Error al actualizar la orden');
  }
});
*/






//anda, con auditar// Ruta para registrar y actualizar una orden
router.post('/order/regUpdateOrder', authToken, async (req, res) => {
  try {
    const { id, patient_name, diagnostic, pregnant, state, fechaIngreso, fechaEntregaResultados, observations } = req.body;

    console.log('Datos recibidos:', req.body);

    // Buscar la orden por ID
    const order = await Order.findByPk(id, {
      include: User // Incluir el modelo User
    });

    if (!order) {
      console.error('Orden no encontrada con ID:', id);
      return res.status(404).send('Orden no encontrada');
    }

    // Guardar los valores anteriores para la auditoría
    const oldOrderValues = {
      patient_name: order.patient_name,
      diagnostic: order.diagnostic,
      state: order.state,
      fechaIngreso: order.fechaIngreso,
      fechaEntregaResultados: order.fechaEntregaResultados,
      observations: order.observations,
      pregnant: order.User ? order.User.pregnant : null
    };

    // Actualizar los campos de la orden
    order.patient_name = patient_name;
    order.diagnostic = diagnostic;
    order.state = state;
    order.fechaIngreso = fechaIngreso;
    order.fechaEntregaResultados = fechaEntregaResultados;
    order.observations = observations;

    // Verificar si el usuario está asociado a la orden
    if (order.User) {
      order.User.pregnant = parseInt(pregnant, 10); // Asegurarse de que sea un número entero (0 o 1)
      await order.User.save(); // Guardar los cambios en el usuario
    }

    await order.save(); // Guardar los cambios en la orden

    // Guardar los valores nuevos para la auditoría
    const newOrderValues = {
      patient_name: order.patient_name,
      diagnostic: order.diagnostic,
      state: order.state,
      fechaIngreso: order.fechaIngreso,
      fechaEntregaResultados: order.fechaEntregaResultados,
      observations: order.observations,
      pregnant: order.User ? order.User.pregnant : null
    };




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
      'Orden',              // entityType
      userId,               // userId
      userName,             // userName
      userRole,             // userRole
      JSON.stringify(oldOrderValues),   // oldValue
      JSON.stringify(newOrderValues),   // newValue
      'Actualizar Orden'  
    );



    res.status(200).send('Orden actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).send('Error al actualizar la orden');
  }
});




/*
//probar actualizar estado de la orden
// Ruta para actualizar la orden
router.post('/order/regUpdateStateOrder', async (req, res) => {
  try {
    const { id, patient_name, diagnostic, pregnant, state, fechaIngreso, fechaEntregaResultados, observations } = req.body;

    console.log('Datos recibidos:', req.body);

    // Buscar la orden por ID
    const order = await Order.findByPk(id, {
      include: User // Incluir el modelo User
    });

    if (!order) {
      console.error('Orden no encontrada con ID:', id);
      return res.status(404).send('Orden no encontrada');
    }

    // Actualizar los campos de la orden
    //order.patient_name = patient_name;
    //order.diagnostic = diagnostic;
    order.state = state;
    //order.fechaIngreso = fechaIngreso;
    //order.fechaEntregaResultados = fechaEntregaResultados;
    //order.observations = observations;

    // Verificar si el usuario está asociado a la orden
    //if (order.User) {
      //order.User.pregnant = parseInt(pregnant, 10); // Asegurarse de que sea un número entero (0 o 1)
      //await order.User.save(); // Guardar los cambios en el usuario
    //}

    await order.save(); // Guardar los cambios en la orden
    res.status(200).send('Orden actualizada exitosamente');


    // Enviar respuesta JSON indicando éxito
    //res.json({ success: true });

    //res.send('Orden actualizada con éxito');
    //res.redirect("menus/mainOrder.pug", { orders: order });

    // Renderizar la vista con los datos actualizados
    //res.render("menus/mainOrder.pug", { order }); // Pasar el objeto de orden actualizado a la vista
    //res.render('menus/mainOrder.pug', { order, message: '¡La orden se ha actualizado exitosamente!' });
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).send('Error al actualizar la orden');
  }
});
*/









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


router.post("/order/deliverSamples", async (req, res) => {
  const { orderId, userId, sampleId } = req.body;

  // Verifica que todos los valores necesarios estén presentes
  if (!orderId || !userId || !sampleId) {
    return res.status(400).send('Faltan datos necesarios');
  }

  try {
    // Busca la orden y el usuario
    const order = await Order.findOne({ where: { id: orderId } });
    const user = await User.findOne({ where: { id: userId } });
    const sample = await Sample.findOne({ where: { id: sampleId } });

    // Verifica que la orden, el usuario y la muestra existan
    if (!order || !user || !sample) {
      return res.status(404).send('Orden, usuario o muestra no encontrado');
    }

    // Crea la entrada en la tabla intermedia OrderSamples
    const orderSample = await OrderSample.create({
      OrderId: orderId,
      SampleId: sampleId,
    });

    // Renderiza la vista con los datos actualizados
    res.render('menus/mainsOrder/etiquetaSample.pug', {
      orderSample: orderSample,
      order: order,
      user: user
    });
  } catch (error) {
    console.error("Error al entregar muestra:", error);
    res.status(500).send("Error en el servidor");
  }
});


/*
//route deliver sample
router.post("/order/deliverSamples", async (req, res) => {
  let order = await Order.findOne({
    where: {
      id: req.body.orderId
    }
  })

  let user = await User.findOne({
    where: {
      id: req.body.userId
    }
  })

  let sample = await Sample.findAll({
    where: {
      id: req.body.sampleId
    }
  })

  let orderSample = await OrderSample.create({
    OrderId: req.body.orderId,
    SampleId: req.body.sampleId,
  })

  res.render('menus/mainsOrder/etiquetaSample.pug', {
    orderSample: orderSample,
    order: order,
    user: user
  })


})
*/





//sin auditar
// detalles de una muestra
router.get('/order/getMuestraDetails/:id', async (req, res) => {
  try {
    const muestra = await Sample.findOne({
      where: { id: req.params.id },
      //include: [{
      //model: User,
      //attributes: ['first_name', 'last_name', 'diagnostic', 'pregnant'] // Incluye el diagnóstico
      //}]
    });
    if (muestra) {
      console.log('Detalles de la muestra:', muestra.toJSON());
      //res.render('menus/mainsOrder/flotantes/flotanteUpdateOrder.pug');
      res.json(muestra);
    } else {
      res.status(404).send('Muestra no encontrada');
    }
  } catch (error) {
    res.status(500).send('Error al obtener detalles de la muestra');
  }
});



/*
//con auditar
// detalles de una muestra
router.get('/order/getMuestraDetails/:id',authToken, async (req, res) => {
  try {
    const muestra = await Sample.findOne({
      where: { id: req.params.id },
      //include: [{
      //model: User,
      //attributes: ['first_name', 'last_name', 'diagnostic', 'pregnant'] // Incluye el diagnóstico
      //}]
    });
    if (muestra) {
      console.log('Detalles de la muestra:', muestra.toJSON());
      //res.render('menus/mainsOrder/flotantes/flotanteUpdateOrder.pug');
      res.json(muestra);
    } else {
      res.status(404).send('Muestra no encontrada');
    }
  } catch (error) {
    res.status(500).send('Error al obtener detalles de la muestra');
  }
});
*/




/*
// Con auditar
router.post('/order/regUpdateSample', authToken, async (req, res) => {
  try {
    const { id, type, detail } = req.body;

    console.log('Datos recibidos:', req.body);

    // Buscar la muestra por ID
    const oldSample = await Sample.findByPk(id);

    if (!oldSample) {
      console.error('Muestra no encontrada con ID:', id);
      return res.status(404).send('Muestra no encontrada');
    }

    // Clonar los valores antiguos para la auditoría
    const oldValues = {
      type: oldSample.type,
      detail: oldSample.detail
    };

    // Actualizar los campos de la muestra
    oldSample.type = type;
    oldSample.detail = detail;

    await oldSample.save(); // Guardar los cambios en la muestra

    // Clonar los valores nuevos para la auditoría
    const newValues = {
      type: oldSample.type,
      detail: oldSample.detail
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
      null,                      // entityId
      'Muestra',               // entityType
      userId,                  // userId
      userName,                // userName
      userRole,                // userRole
      JSON.stringify(oldValues),   // oldValue
      JSON.stringify(newValues),   // newValue
      'Actualizar una muestra'  
    );

    console.log('Muestra actualizada:', oldSample.toJSON()); // Verificar en consola que los cambios se aplicaron correctamente
    res.status(200).send('Muestra actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la muestra:', error);
    res.status(500).send('Error al actualizar la muestra');
  }
});
*/



//sin auditar
// Ruta para actualizar muestras
router.post('/order/regUpdateSample', async (req, res) => {
  try {
    const { id, type, detail } = req.body;

    console.log('Datos recibidos:', req.body);

    // Buscar la muestra por ID
    const muestra = await Sample.findByPk(id);

    if (!muestra) {
      console.error('Muestra no encontrada con ID:', id);
      return res.status(404).send('Muestra no encontrada');
    }

    // Actualizar los campos de la muestra utilizando setDataValue
    muestra.type = type;
    muestra.detail = detail;
    //muestra.setDataValue('type', type);
    //muestra.setDataValue('detail', detail);

    await muestra.save(); // Guardar los cambios en la muestra
    console.log('Muestra actualizada:', muestra.toJSON()); // Verificar en consola que los cambios se aplicaron correctamente
    res.status(200).send('Muestra actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la muestra:', error);
    res.status(500).send('Error al actualizar la muestra');
  }
});








//anda sin auditar
router.post('/order/regUpdateExamen', async (req, res) => {
  const { id, name, detail, abbreviation, active, type, determinants } = req.body;

  try {
    // Encontrar y actualizar el examen
    const examen = await Exam.findByPk(id);
    if (!examen) {
      return res.status(404).send('Examen no encontrado');
    }
    examen.name = name;
    examen.detail = detail;
    examen.abbreviation = abbreviation;
    examen.active = active;
    await examen.save();

    // Actualizar las muestras asociadas
    await examen.setSamples([]); // Desasociar todas las muestras actuales
    const samples = await Sample.findAll({ where: { type: type } });
    await examen.setSamples(samples); // Asociar la muestra seleccionada

    // Actualizar las determinantes asociadas
    await examen.setDeterminants([]); // Desasociar todas las determinantes actuales
    if (determinants && determinants.length > 0) {
      const selectedDeterminants = await Determinant.findAll({
        where: { id: determinants },
        //attributes: { exclude: ['ExamSubGroupId'] } // Excluir la columna ExamSubGroupId
      attributes: ['id', 'name', 'abbreviation', 'active','detail','measurement'],
      });
      await examen.setDeterminants(selectedDeterminants); // Asociar las determinantes seleccionadas
    }

    res.send('Examen actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el examen:', error);
    res.status(500).send('Error al actualizar el examen');
  }
});


/*
//con audit
router.post('/order/regUpdateExamen', authToken, async (req, res) => {
  const { id, name, detail, abbreviation, active, type, determinants } = req.body;

  try {
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

    // Encontrar y actualizar el examen
    const examen = await Exam.findByPk(id);
    if (!examen) {
      return res.status(404).send('Examen no encontrado');
    }

    // Obtener los valores anteriores para auditoría
    const oldValues = {
      name: examen.name,
      detail: examen.detail,
      abbreviation: examen.abbreviation,
      active: examen.active,
      type: (await examen.getSamples()).map(sample => sample.type), // Obtener tipos de muestra asociados
      determinants: (await examen.getDeterminants()).map(determinant => determinant.name) // Obtener nombres de determinantes asociados
    };

    // Actualizar los valores del examen
    examen.name = name;
    examen.detail = detail;
    examen.abbreviation = abbreviation;
    examen.active = active;
    await examen.save();

    // Actualizar las muestras asociadas
    await examen.setSamples([]); // Desasociar todas las muestras actuales
    const samples = await Sample.findAll({ where: { type: type } });
    await examen.setSamples(samples); // Asociar la muestra seleccionada

    // Actualizar las determinantes asociadas
    await examen.setDeterminants([]); // Desasociar todas las determinantes actuales
    if (determinants && determinants.length > 0) {
      const selectedDeterminants = await Determinant.findAll({
        where: { id: determinants },
        attributes: ['id', 'name', 'abbreviation', 'active', 'detail', 'measurement'],
      });
      await examen.setDeterminants(selectedDeterminants); // Asociar las determinantes seleccionadas
    }

    // Obtener los valores nuevos para auditoría
    const newValues = {
      name: examen.name,
      detail: examen.detail,
      abbreviation: examen.abbreviation,
      active: examen.active,
      type: (await examen.getSamples()).map(sample => sample.type), // Obtener tipos de muestra asociados
      determinants: (await examen.getDeterminants()).map(determinant => determinant.name) // Obtener nombres de determinantes asociados
    };

    // Llamar a la función de auditoría
    await logAudit(
      null,                           // entityId (ID del examen actualizado)
      'Examen',                     // entityType
      userId,                       // userId
      userName,                     // userName
      userRole,                     // userRole
      JSON.stringify(oldValues),    // oldValue (valores anteriores)
      JSON.stringify(newValues),    // newValue (valores nuevos)
      'Actualización de un examen'  // actionType
    );

    res.send('Examen actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el examen:', error);
    res.status(500).send('Error al actualizar el examen');
  }
});
*/

/*
//MASO
router.post('/order/regUpdateExamen', async (req, res) => {
  const { id, name, detail, abbreviation, active, type } = req.body;
  let { determinants } = req.body;

  if (!Array.isArray(determinants)) {
    determinants = [determinants]; // Asegurarse de que determinants sea un array
  }

  try {
    // Encontrar y actualizar el examen
    const examen = await Exam.findByPk(id);
    if (!examen) {
      return res.status(404).send('Examen no encontrado');
    }
    examen.name = name;
    examen.detail = detail;
    examen.abbreviation = abbreviation;
    examen.active = active;
    await examen.save();

    // Actualizar las muestras y determinaciones asociadas
    await examen.setSamples([]); // Desasociar todas las muestras actuales
    const samples = await Sample.findAll({ where: { type: type } });
    await examen.setSamples(samples); // Asociar la muestra seleccionada

    await examen.setDeterminants([]); // Desasociar todas las determinantes actuales
    const selectedDeterminants = await Determinant.findAll({
      where: { id: determinants },
      attributes: { exclude: ['ExamSubGroupId'] } // Excluir la columna ExamSubGroupId
    });
    await examen.setDeterminants(selectedDeterminants); // Asociar las determinantes seleccionadas

    res.send('Examen actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el examen:', error);
    res.status(500).send('Error al actualizar el examen');
  }
});
*/




/*
// detalles de un examen, este anda bien
router.get('/order/getExamenDetails/:id', async (req, res) => {
  try {
    const examen = await Exam.findOne({
      where: { id: req.params.id },
      //include: [{
        //model: User,
        //attributes: ['first_name', 'last_name', 'diagnostic', 'pregnant'] // Incluye el diagnóstico
      //}]
    });
    if (examen) {
      console.log('Detalles del examen:', examen.toJSON());
      //res.render('menus/mainsOrder/flotantes/flotanteUpdateOrder.pug');
      res.json(examen);
    } else {
      res.status(404).send('Examen no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al obtener detalles del examen');
  }
});
*/


/*
//ANDANDO
router.get('/order/getExamenDetails/:id', async (req, res) => {
  try {
    const examen = await Exam.findOne({
      where: { id: req.params.id },
      include: [{
        model: Sample,
        through: { attributes: [] }, // No incluir atributos de la tabla intermedia
        attributes: ['type'] // Atributos que deseas mostrar de Sample
      }]
    });
    if (examen) {
      console.log('Detalles del examen:', examen.toJSON());
      res.json(examen);
    } else {
      res.status(404).send('Examen no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener detalles del examen:', error);
    res.status(500).send('Error al obtener detalles del examen');
  }
});
*/



/*
//con auditoria
//PROBANDO CON DETERMINCIONES Y MUESTRAS
router.get('/order/getExamenDetails/:id',authToken, async (req, res) => {
  try {
    const examen = await Exam.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Sample,
          through: { attributes: [] },
          attributes: ['type']
        },
        {
          model: Determinant, // Asegúrate de incluir los determinantes
          through: { attributes: [] },
          attributes: ['name', 'id', 'abbreviation'] // Atributos que deseas mostrar de Determinant
        }
      ]
    });
    if (examen) {
      res.json(examen);
    } else {
      res.status(404).send('Examen no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener detalles del examen:', error);
    res.status(500).send('Error al obtener detalles del examen');
  }
});
*/

//sin ausitra
//PROBANDO CON DETERMINCIONES Y MUESTRAS
router.get('/order/getExamenDetails/:id', async (req, res) => {
  try {
    const examen = await Exam.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Sample,
          through: { attributes: [] },
          attributes: ['type']
        },
        {
          model: Determinant, // Asegúrate de incluir los determinantes
          through: { attributes: [] },
          attributes: ['name', 'id', 'abbreviation'] // Atributos que deseas mostrar de Determinant
        }
      ]
    });
    if (examen) {
      res.json(examen);
    } else {
      res.status(404).send('Examen no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener detalles del examen:', error);
    res.status(500).send('Error al obtener detalles del examen');
  }
});



//sin auditar
// Obtener todas las determinaciones disponibles
router.get('/order/getAllDeterminants', async (req, res) => {
  try {
    const determinants = await Determinant.findAll({
      attributes: ['id', 'name', 'abbreviation', 'active']
    });
    res.json(determinants);
  } catch (error) {
    console.error('Error al obtener todas las determinaciones:', error);
    res.status(500).send('Error al obtener todas las determinaciones');
  }
});




/*
//con auditar
// Obtener todas las determinaciones disponibles
router.get('/order/getAllDeterminants',authToken, async (req, res) => {
  try {
    const determinants = await Determinant.findAll({
      attributes: ['id', 'name', 'abbreviation', 'active']
    });
    res.json(determinants);
  } catch (error) {
    console.error('Error al obtener todas las determinaciones:', error);
    res.status(500).send('Error al obtener todas las determinaciones');
  }
});
*/




















/*
// Ruta para actualizar muestras
router.post('/order/regUpdateExamen', async (req, res) => {
  try {
    const { id, name, detail, abbreviation,active, type } = req.body;

    console.log('Datos recibidos:', req.body);

    // Buscar la muestra por ID
    const examen = await Exam.findByPk(id);

    if (!examen) {
      console.error('Examen no encontrado con ID:', id);
      return res.status(404).send('Examen no encontrada');
    }

    // Actualizar los campos de la muestra utilizando setDataValue
    examen.abbreviation = abbreviation;
    examen.name = name;
    examen.detail = detail;
    examen.active = active;
    examen.type = type;
    //muestra.setDataValue('type', type);
    //muestra.setDataValue('detail', detail);

    await examen.save(); // Guardar los cambios en examen
    console.log('examen actualizado:', examen.toJSON()); // Verificar en consola que los cambios se aplicaron correctamente
    res.status(200).send('examen actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el examen:', error);
    res.status(500).send('Error al actualizar el examen');
  }
});
*/

/*
//probando actualizarle muestras y determinaciones.prueba 1 andando
router.post('/order/regUpdateExamen', async (req, res) => {
  try {
    const { id, name, abbreviation, detail, active, sampleType, determinants } = req.body;

    const exam = await Exam.findOne({
      where: { id: id },
      include: [
        {
          model: Sample,
          through: { attributes: [] },
        },
        {
          model: Determinant,
          through: { attributes: [] },
          attributes: ['name', 'id', 'abbreviation', 'detail', 'measurement', 'active', 'createdAt', 'updatedAt'], // Atributos específicos de Determinant
        }
      ],
    });

    if (exam) {
      exam.name = name;
      exam.abbreviation = abbreviation;
      exam.detail = detail;
      exam.active = active;
      await exam.save();

      if (sampleType) {
        const sample = await Sample.findByPk(sampleType);
        if (sample) {
          await exam.setSamples([sample]);
        }
      }



      let determinantInstances = []; // Definir como array vacío o null inicialmente
      if (determinants && determinants.length > 0) {
        const determinantInstances = await Determinant.findAll({
          where: { id: determinants },
          attributes: ['id', 'name', 'abbreviation', 'detail', 'measurement', 'active', 'createdAt', 'updatedAt'], // Atributos específicos de Determinant sin ExamSubGroupId
        });
        await exam.setDeterminants(determinantInstances);
      }

      let exams = await Exam.findAll({
        include: [
          {
            model: Sample,
            through: { attributes: [] },
            attributes: ['type'],
          },
          {
            model: Determinant,
            through: { attributes: [] },
            attributes: ['name', 'id', 'abbreviation', 'detail', 'measurement', 'active', 'createdAt', 'updatedAt'], // Atributos específicos de Determinant
          },
        ],
      });

      res.render("menus/mainsExam/viewExam.pug", { exams: exams, determinants: determinantInstances });
    }
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).send('Error updating exam');
  }
});
*/

//probando actualizarle muestras y determinaciones. prueba 2









/*
// Ruta para actualizar la orden
router.post('/order/regUpdateOrder', async (req, res) => {
  try {
    const { id, patient_name, diagnostic, pregnant, state,fechaIngreso,fechaEntregaResultados } = req.body;

    console.log('Datos recibidos:', req.body);

    const order = await Order.findByPk(id);
    if (!order) {
      console.error('Orden no encontrada con ID:', id);
      return res.status(404).send('Orden no encontrada');
    }

    // Actualizar los campos de la orden
    order.patient_name = patient_name;
    //order.User.diagnostic = diagnostic;
    order.diagnostic = diagnostic;
    //order.pregnant = pregnant;
    order.pregnant = parseInt(pregnant); // Asegurarse de que sea un número entero (0 o 1)
    order.state = state;
    //order.date = date;
    //order.createAt = createAt;
    order.fechaIngreso=fechaIngreso;
    order.fechaEntregaResultados=fechaEntregaResultados;
    //order.entregedAt = entregedAt;

    await order.save();
    res.status(200).send('Orden actualizada exitosamente');

    //agregar un cartel de que se actualizo la orden
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).send('Error al actualizar la orden');
  }
});
*/


/*
router.post('/order/regUpdateOrder', async (req, res) => {
  try {
      const { id, patient_name, diagnostic, pregnant, state, fechaIngreso, fechaEntregaResultados } = req.body;

      console.log('Datos recibidos:', req.body);

      const order = await Order.findByPk(id);
      if (!order) {
          console.error('Orden no encontrada con ID:', id);
          return res.status(404).send('Orden no encontrada');
      }

      // Actualizar los campos de la orden
      order.patient_name = patient_name;
      order.diagnostic = diagnostic;
      order.User.pregnant = parseInt(pregnant, 10); // Asegurarse de que sea un número entero (0 o 1)
      order.state = state;
      order.fechaIngreso = fechaIngreso;
      order.fechaEntregaResultados = fechaEntregaResultados;

      await order.save();
      res.status(200).send('Orden actualizada exitosamente');
  } catch (error) {
      console.error('Error al actualizar la orden:', error);
      res.status(500).send('Error al actualizar la orden');
  }
});
*/







/*
// Ruta para actualizar la orden
router.post('/order/regUpdateOrder', async (req, res) => {
  try {
    const { id, patient_name, diagnostic, pregnant, state, fechaIngreso, fechaEntregaResultados } = req.body;

    console.log('Datos recibidos:', req.body);

    // Buscar la orden y cargar el usuario asociado
    const order = await Order.findByPk(id, {
      include: 'User' // Asegúrate de que 'User' es el nombre del modelo definido en tu Sequelize
    });

    if (!order) {
      console.error('Orden no encontrada con ID:', id);
      return res.status(404).send('Orden no encontrada');
    }

    // Verificar y actualizar las propiedades de la orden y del usuario asociado
    if (patient_name) {
      order.patient_name = patient_name;
    }
    if (diagnostic) {
      order.User.diagnostic = diagnostic;
    }
    if (pregnant !== undefined) {
      order.pregnant = pregnant;
    }
    if (state) {
      order.state = state;
    }
    if (fechaIngreso) {
      order.fechaIngreso = fechaIngreso;
    }
    if (fechaEntregaResultados) {
      order.fechaEntregaResultados = fechaEntregaResultados;
    }

    await order.save(); // Guardar los cambios

    console.log('Orden actualizada:', order);
    res.status(200).send('Orden actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar la orden:', error);
    res.status(500).send('Error al actualizar la orden');
  }
});
*/


/*----------------------rutas para los resultados de los examenes------------------*/



// routes/order.js
/*
router.post('/order/viewResults', async (req, res) => {

  
  
  //const { id } = req.body;
  try {
    let order = await Order.findOne( {
      where: { id: req.body.id },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              attributes: { exclude: ['ExamSubGroupId'] } // Excluir la columna ExamSubGroupId
            }
          ]
        }
      ]
    });
    if (order) {
      res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { order });
    } else {
      res.status(404).send('Orden no encontrada');
    }
  } catch (error) {
    console.error('Error al obtener los resultados del examen:', error);
    res.status(500).send('Error al obtener los resultados del examen');
  }
});
*/


/*
//guardar los resultados del analisis
router.post('/order/saveResults', async (req, res) => {
  const { order_id, exam_id, determinant_id, result_value } = req.body;

  try {
    // Primero, encuentra la determinación específica que se va a actualizar
    let specificDeterminant = await Determinant.findByPk(determinant_id, {
      attributes: { exclude: ['ExamSubGroupId'] } // Excluir la columna ExamSubGroupId
    });

    if (specificDeterminant) {
      // Actualiza el valor del resultado para esta determinación
      specificDeterminant.result_value = result_value;

      // Guarda los cambios en la base de datos
      await specificDeterminant.save();

      // Crea un nuevo registro en la tabla 'results' con los datos pertinentes
      await Result.create({
        orderId: order_id,
        examId: exam_id,
        determinantId: determinant_id,
        value: result_value
      });

      res.status(200).send('Resultado guardado exitosamente');
    } else {
      res.status(404).send('Determinación no encontrada');
    }
  } catch (error) {
    console.error('Error al guardar el resultado:', error);
    res.status(500).send('Error al guardar el resultado');
  }
});
*/


/*
//andando solo que no muestra los valores del analisis
router.post('/order/viewResults', async (req, res) => {
  const { id } = req.body;

  try {
    // Obtener la orden junto con los exámenes y determinaciones
    let order = await Order.findByPk(id, {
      include: [{
        model: Exam,
        include: [{
          model: Determinant,
          attributes: { exclude: ['ExamSubGroupId'] }, // Excluir ExamSubGroupId
          include: [{
            model: Result,
            where: { orderId: id },
            required: false // Permitir determinaciones sin resultados
          }]
        }]
      }]
    });

    if (order) {
      res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { order });
    } else {
      res.status(404).send('Orden no encontrada');
    }
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).send('Error al obtener los resultados');
  }
});
*/



//probando que muestre los valores de los analisis, funciona para las mismas det y mismos examenes
router.post('/order/viewResults', async (req, res) => {
  console.log('Solicitud POST recibida en /order/viewResults');
  const { id } = req.body;

  try {
    // Obtener la orden junto con los exámenes y determinaciones
    let order = await Order.findByPk(id, {
      include: [{
        model: Exam,
        include: [{
          model: Determinant,
          attributes: { exclude: ['ExamSubGroupId'] }, // Excluir ExamSubGroupId
          include: [{
            model: Result // Incluir los resultados de las determinaciones
          }]
        }]
      }]
    });

    console.log("datos de la orden completa: " + order);

    if (order) {
      // Muestra los datos de la orden completa por consola
      console.log("Datos de la orden completa:", JSON.stringify(order, null, 2));
      res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { order });
    } else {
      res.status(404).send('Orden no encontrada');
    }
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).send('Error al obtener los resultados');
  }
});





//probando que muestre los valores de los analisis

//probando que muestre los valores de los analisis, funciona para las mismas det y mismos examenes
router.post('/order/viewResults2', async (req, res) => {
  console.log('Solicitud POST recibida en /order/viewResults');
  const { id } = req.body;

  try {
    // Obtener la orden junto con los exámenes y determinaciones
    let order = await Order.findByPk(id, {
      include: [{
        model: Exam,
        include: [{
          model: Determinant,
          attributes: { exclude: ['ExamSubGroupId'] }, // Excluir ExamSubGroupId
          include: [{
            model: Result // Incluir los resultados de las determinaciones
          }]
        }]
      }]
    });

    console.log("datos de la orden completa: " + order);

    if (order) {
      // Muestra los datos de la orden completa por consola
      console.log("Datos de la orden completa:", JSON.stringify(order, null, 2));
      res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { order });
    } else {
      res.status(404).send('Orden no encontrada');
    }
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).send('Error al obtener los resultados');
  }
});







router.post('/order/saveResults', async (req, res) => {
  const { results } = req.body;

  try {
    for (let key in results) {
      const { order_id, exam_id, determinant_id, result_value } = results[key];

      // Encuentra o crea el registro de resultado
      await Result.upsert({
        orderId: order_id,
        examId: exam_id,
        determinantId: determinant_id,
        value: result_value
      });

      // También actualiza el valor del resultado en la determinación
      await Determinant.update(
        { result_value: result_value },
        {
          where: { id: determinant_id },
          attributes: { exclude: ['ExamSubGroupId'] } // Excluir ExamSubGroupId
        }
      );
    }

    res.redirect(`/order/viewResults/${results[0].order_id}`);
  } catch (error) {
    console.error('Error al guardar los resultados:', error);
    res.status(500).send('Error al guardar los resultados');
  }
});





/*
//no anda
router.get('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              include: [
                {
                  model: ExamDeterminant,
                  include: [
                    {
                      model: Determinant,
                      attributes: ['name', 'abbreviation', 'measurement']
                    }
                  ]
                }
              ]
            },
            {
              model: Result,
              attributes: ['value'],
              include: [
                {
                  model: ExamDeterminant,
                  attributes: ['id']
                }
              ]
            }
          ]
        }
      ]
    });

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
*/




/*
//probando, no funca
// Ruta para obtener los resultados de un examen específico
router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  
  try {
    // Obtener los resultados asociados a la orden
    const results = await Result.findAll({
      include: [
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              attributes: ['name']
            }
          ],
          where: { orderId: orderId }
        },
        {
          model: ExamDeterminant,
          attributes: ['name']
        }
      ]
    });

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { results });
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).send('Error al obtener los resultados');
  }
});
*/




/*
router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      attributes: [
        'id',
        'userId', // Assuming you have a userId in the Order model
        // ... other attributes you want from Order
      ],
      include: [
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              attributes: ['id', 'name'],
            },
            {
              model: ExamDeterminant,
              attributes: ['id'],
              include: {
                model: Determinant,
                attributes: ['id', 'name'],
              },
            },
            {
              model: Result,
              attributes: ['value', 'createdAt', 'updatedAt'],
              where: {
                [Op.or]: [
                  { OrderExamId: OrderExam.id }, // Assuming 'id' is the primary key of OrderExam
                  { ExamDeterminantId: ExamDeterminant.id }, // Assuming 'id' is the primary key of ExamDeterminant
                ],
              },
              required: false, // Allow OrderExam to exist without a matching Result
            },
          ],
        },
        // Include other models as needed (e.g., User, OrderSample)
      ],
      where: {
        id: orderId, // Filter by the specific order ID
      },
    });

    if (order) {
      res.json(order.toJSON()); // Send the order data as JSON
    } else {
      res.status(404).send('No order found with ID ' + orderId); // Handle order not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error'); // Handle server errors
  }
});
*/




//anda pero no me tira los valores
/*
router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      attributes: [
        'id',
        'userId', // Assuming you have a userId in the Order model
        // ... other attributes you want from Order
      ],
      include: [
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              attributes: ['id', 'name'],
              include: {
                model: ExamDeterminant,
                attributes: ['id'],
                include: [
                  {
                    model: Determinant,
                    attributes: ['id', 'name'],
                  },
                  {
                    model: Result,
                    attributes: ['value'],
                    required: false, // Allow ExamDeterminant to exist without a matching Result
                  },
                ],
              },
            },
          ],
        },
        // Include other models as needed (e.g., User, OrderSample)
      ],
      where: {
        id: orderId, // Filter by the specific order ID
      },
    });

    if (order) {
      console.log(order.toJSON());
      res.json(order.toJSON()); // Send the order data as JSON
    } else {
      res.status(404).send('No order found with ID ' + orderId); // Handle order not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error'); // Handle server errors
  }
});
*/

/*
//probando
router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      attributes: [
        'id',
        'userId', // Assuming you have a userId in the Order model
        // ... other attributes you want from Order
      ],
      include: [
        {
          model: OrderExam,
          include: [
            {
              model: Result,
              attributes: ['value'],
              required: false, // Allow ExamDeterminant to exist without a matching Result
            },
            {
              model: Exam,
              attributes: ['id', 'name'],
              include: {
                model: ExamDeterminant,
                attributes: ['id'],
                include: [
                  {
                    model: Determinant,
                    attributes: ['id', 'name'],
                  },
                  {
                    model: Result,
                    attributes: ['value'],
                    required: false, // Allow ExamDeterminant to exist without a matching Result
                  },
                ],
              },
            },
          ],
        },
        // Include other models as needed (e.g., User, OrderSample)
      ],
      where: {
        id: orderId, // Filter by the specific order ID
      },
    });

    if (order) {
      console.log(order.toJSON());
      res.json(order.toJSON()); // Send the order data as JSON
    } else {
      res.status(404).send('No order found with ID ' + orderId); // Handle order not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error'); // Handle server errors
  }
});
*/




router.get('/results/:orderId', async (req, res) => {
  console.log('Fetddddddd:');
  try {
    const orderId = req.params.orderId;

    const results = await Order.findAll({
      attributes: ['id'],
      where: { id: orderId },
      include: [
        {
          model: Exam,
          attributes: ['id'],
          include: [
            {
              model: OrderExam,
              attributes: ['id', 'name'],
              include: [
                {
                  model: ExamDeterminant,
                  attributes: ['id'],
                  include: [
                    {
                      model: Determinant,
                      attributes: ['id', 'name']
                    }
                  ]
                }
              ]
            },
            {
              model: Result,
              attributes: ['value'],
              required: false // LEFT JOIN
            }
          ]
        }
      ]
    });

    const formattedResults = results.map(order => {
      return order.OrderExams.map(orderExam => {
        return orderExam.Exam.ExamDeterminants.map(examDeterminant => {
          return {
            orderId: order.id,
            examId: orderExam.Exam.id,
            examName: orderExam.Exam.name,
            determinantId: examDeterminant.Determinant.id,
            determinantName: examDeterminant.Determinant.name,
            resultValue: orderExam.Results.find(result => result.OrderExamId === orderExam.id && result.ExamDeterminantId === examDeterminant.id)?.value || null
          };
        });
      }).flat();
    }).flat();

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'An error occurred while fetching results' });
  }
});


/*
//probando
router.get('/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      attributes: [
        'id',
        'userId',
        'state',
        'diagnostic'
      ],
      include: [
        {
          model: OrderExam,
          attributes: ['id', 'examId', 'createdAt', 'updatedAt'],
          include: [
            {
              model: Result,
              attributes: ['id', 'value', 'createdAt', 'updatedAt'],
              required: false,
              where: {
                OrderExamId: 
              }
            },
            {
              model: Exam,
              attributes: ['id', 'name'],
              include: {
                model: ExamDeterminant,
                attributes: ['id', 'determinantId'],
                include: [
                  {
                    model: Result,
                    attributes: ['id', 'value', 'createdAt', 'updatedAt'],
                    required: false
                  },
                  {
                    model: Determinant,
                    attributes: ['id', 'name'],
                  },
                ]
              }
            }
          ]
        }
      ],
      where: {
        id: orderId,


      }
    });

    if (order) {
      console.log(order.toJSON());
      res.json(order.toJSON());
    } else {
      res.status(404).send('No order found with ID ' + orderId);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});
*/



router.get('/orders/1/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const ordenDelExamen = await OrderExam.findOne({
      attributes: [], // No seleccionar ningún atributo de OrderExam directamente
      include: [
        {
          model: Result,
          attributes: ['value', 'orderExamId', 'createdAt', 'updatedAt'],
        },
        {
          model: ExamDeterminant,
          attributes: [],
          include: [
            {
              model: Determinant,
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: Result,
          attributes: ['value', 'orderExamId', 'createdAt', 'updatedAt'],
        },
      ],
      where: {
        id: orderId,
      },
    });

    if (ordenDelExamen) {
      console.log(ordenDelExamen.toJSON());
      res.json(ordenDelExamen.toJSON());
    } else {
      res.status(404).send('No se encontró ninguna orden con el ID ' + orderId);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});







/* 
//prueba 50, funciona
router.get('/orders/:id', async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    const detalleOrden = await Order.findAll({
      attributes: [
        
        //['id', 'orderId'],
        //[sequelize.fn('CONCAT', sequelize.col('User.first_name'), ' ', sequelize.col('User.last_name')), 'userName'],
        //[sequelize.col('Exam.name'), 'examName'],
        //[sequelize.col('Determinant.name'), 'determinantName'],
        //[sequelize.col('Result.value'), 'resultValue'],
        //[sequelize.col('Determinant.measurement'), 'unit'],
        //['Result.id', 'resultUniqueId']
        
      ],
      include: [
        {
          model: User,
          attributes: [], // No necesitas atributos específicos del modelo User
        },
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              attributes: ['name']
            },
            {
              model: Result,
              attributes: ['value', 'id'],
              include: [
                {
                  model: ExamDeterminant,
                  include: [
                    {
                      model: Determinant,
                      attributes: ['name', 'measurement']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      where: { id: orderId }
    });

    if (detalleOrden.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

   // res.json(detalleOrden);
    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { detalleOrden });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/




//mejorando prueba 50
router.get('/orders/:id', async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    const detalleOrden = await Order.findOne({
      include: [
        {
          model: User,
          attributes: [], // No necesitas atributos específicos del modelo User
        },
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              attributes: ['name']
            },
            {
              model: Result,
              attributes: ['value', 'id'],
              include: [
                {
                  model: ExamDeterminant,
                  include: [
                    {
                      model: Determinant,
                      exclude: ['ExamSubGroupId'],
                      // attributes: ['name', 'measurement']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      where: { id: orderId }
    });

    if (!detalleOrden) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(detalleOrden);
    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { detalleOrden });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});












//muestra los resultados de las determinaciones por orden, para postamn funciona perfecto
router.get('/orders/resultados/:orderId', async (req, res) => {
  try {
    const results = await OrderExam.findAll({
      attributes: ['orderId'],
      include: [
        {
          model: Exam,
          attributes: ['id', 'name'],
          include: [
            {
              model: Determinant,
              attributes: ['name', 'measurement'],
              through: { attributes: [] }, // Excluir atributos de la tabla de unión
            }
          ]
        },
        {
          model: Order,
          attributes: ['userId'],
          include: [
            {
              model: User,
              attributes: ['first_name']
            }
          ]
        },
        {
          model: Result,
          attributes: ['value']
        }
      ],
      where: { orderId: req.params.orderId }
    });

    res.json(results);

    //res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { results });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/*
//ANDAAA PARA UN SOLO RESULTADO
// Obtener resultados de las determinaciones por orden, para la vista FRONT
router.get('/orders/resultadosD/:orderId', async (req, res) => {
  try {
    const results = await OrderExam.findAll({
      attributes: ['orderId'],
      include: [
        {
          model: Exam,
          attributes: ['id', 'name'],
          include: [
            {
              model: Determinant,
              attributes: ['name', 'measurement'],
              through: { attributes: [] },
            }
          ]
        },
        {
          model: Order,
          attributes: ['userId'],
          include: [
            {
              model: User,
              attributes: ['first_name', 'last_name']
            }
          ]
        },
        {
          model: Result,
          attributes: ['value']
        }
      ],
      where: { orderId: req.params.orderId }
    });

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { results });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
  */


/*
//este anda de diez
router.get('/orders/resultadosD/:orderId', async (req, res) => {
  try {
    const results = await OrderExam.findAll({
      attributes: ['orderId'],
      include: [
        {
          model: Exam,
          attributes: ['id', 'name'],
          include: [
            {
              model: Determinant,
              attributes: ['name', 'measurement'],
              through: { attributes: [] },
            }
          ]
        },
        {
          model: Order,
          attributes: ['userId'],
          include: [
            {
              model: User,
              attributes: ['first_name', 'last_name']
            }
          ]
        },
        {
          model: Result,
          attributes: ['value', 'orderExamId', 'examDeterminantId'],
        }
      ],
      where: { orderId: req.params.orderId }
    });
    console.log('Results:', JSON.stringify(results, null, 2));

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { results });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/


/*
//trae con todos los valores de referencia
router.get('/orders/resultadosD/:orderId', async (req, res) => {
  try {
    const results = await OrderExam.findAll({
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
                  //attributes: ['gender', 'age_min', 'age_max', 'value']
                }
              ]
            }
          ]
        },
        {
          model: Order,
          include: [
            {
              model: User,
            }
          ]
        },
        {
          model: Result,
          attributes: ['value', 'orderExamId', 'examDeterminantId'],
        }
      ],
      where: { orderId: req.params.orderId }
    });
    console.log('Results:', JSON.stringify(results, null, 2));

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { results });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/


//anda sin auditar
router.get('/orders/resultadosD/:orderId', async (req, res) => {
  const estadoDeOrden = req.query.estadoDeOrden; // Obtener el rol de la consulta
  console.log('estado de orden:', estadoDeOrden);
  
  try {
    const results = await OrderExam.findAll({
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              attributes: ['name', 'measurement', 'id', 'abbreviation', 'active'],	
              through: { attributes: [] },
              include: [
                {
                  model: Value_reference,
                  attributes: ['gender', 'age_min', 'age_max', 'max_value', 'min_value','pregnant','max_limit','min_limit']	,
                }
              ]
            }
          ]
        },
        {
          model: Order,
          include: [
            {
              model: User,
            }
          ]
        },
        {
          model: Result,
          attributes: ['value', 'orderExamId', 'examDeterminantId'],
        }
      ],
      where: { orderId: req.params.orderId }
    });

    // Inspeccionar la estructura de los datos obtenidos
    console.log('Results:', JSON.stringify(results, null, 2));

    // Extraer la información del usuario
    const user = results[0].Order.User;
    const userAge = getAge(user.birthdate);
    const userGender = user.gender;


//probando
const userPregnant = user.pregnant;








//funciona pero no aplica filtro para embarazadas
    // Filtrar valores de referencia según la edad y el género del usuario
    //const filteredResults = results.map(result => {
      //const exam = result.Exam;
      //const determinants = exam.Determinants.map(determinant => {
        //const filteredReferences = determinant.Value_references.filter(reference => {
          //return reference.gender === userGender && reference.age_min <= userAge && reference.age_max >= userAge;
        //});




// Filtrar valores de referencia según la edad, género y embarazo del usuario
const filteredResults = results.map(result => {
  const exam = result.Exam;
  const determinants = exam.Determinants.map(determinant => {
    const filteredReferences = determinant.Value_references.filter(reference => {
      return (
        reference.gender === userGender && 
        reference.age_min <= userAge && 
        reference.age_max >= userAge &&
        (userGender !== 'femenino' || reference.pregnant === userPregnant)
      );
    });

        return {
          ...determinant.toJSON(),
          Value_references: filteredReferences
        };
      });

      return {
        ...result.toJSON(),
        Exam: {
          ...exam.toJSON(),
          Determinants: determinants
        }
      };
    });

    console.log('Filtered Results:', JSON.stringify(filteredResults, null, 2));

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', {
      results: filteredResults,
      patientAge: userAge,
      estadoDeOrden
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Función para calcular la edad a partir de la fecha de nacimiento
function getAge(birthdate) {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}













//anda con auditar




/*
router.get('/orders/resultadosD/:orderId', async (req, res) => {
  try {
    const results = await OrderExam.findAll({
      attributes: ['orderId'],
      include: [
        {
          model: Exam,
          attributes: ['id', 'name'],
          include: [
            {
              model: Determinant,
              attributes: ['name', 'measurement'],
              through: { attributes: [] },
            },
            {
              model: Value_reference,
              attributes: ['value', 'gender']
            }
          ]
        },
        {
          model: Order,
          attributes: ['userId'],
          include: [
            {
              model: User,
              attributes: ['first_name', 'last_name']
            }
          ]
        },
        {
          model: Result,
          attributes: ['value','orderExamId', 'examDeterminantId'],
        }
      ],
      where: { orderId: req.params.orderId }
    });
    console.log('Results:', JSON.stringify(results, null, 2));

    

    const user = orderExams[0].Order.User;
    const birthDate = new Date(user.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    orderExams.forEach(orderExam => {
      orderExam.Exam.Determinants.forEach(determinant => {
        if (determinant.Value_references) {
          determinant.Value_references = determinant.Value_references.filter(vr =>
            vr.gender === user.gender &&
            age >= vr.age_min &&
            age <= vr.age_max
          );
        }
      });
    });

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { orderExams, user, age });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/





/*
//probando con value reference
router.get('/orders/resultadosD/:orderId', async (req, res) => {
  try {
    const results = await OrderExam.findAll({
      attributes: ['orderId'],
      include: [
        {
          model: Exam,
          attributes: ['id', 'name'],
          include: [
            {
              model: Determinant,
              attributes: ['name', 'measurement'],
              through: { attributes: [] },
              include: [
                {
                  model: Value_reference,
                  attributes: ['gender', 'age_min', 'age_max', 'min_value', 'max_value']
                }
              ]
            }
          ]
        },
        {
          model: Order,
          attributes: ['userId', 'createdAt'],
          include: [
            {
              model: User,
              attributes: ['first_name', 'last_name', 'gender', 'birthdate']
            }
          ]
        },
        {
          model: Result,
          attributes: ['value', 'orderExamId', 'examDeterminantId'],
        }
      ],
      where: { orderId: req.params.orderId }
    });

    // Calcular la edad del paciente
    if (results.length > 0 && results[0].Order.User.birthdate) {
      const birthDate = new Date(results[0].Order.User.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      results[0].Order.User.age = age;
    }

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { results });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/





/*
//examenes asociados a la orden, funciona perfecto en postman
router.get('/order/examenesDeLaOrden/:orderId', async (req, res) => {
  try {
    const orderExams = await OrderExam.findAll({
      where: { OrderId: req.params.orderId },
      include: [
        {
          model: Exam,
          attributes: ['id', 'name'],
        },
        {
          model: Order,
          include: [
            {
              model: User,
              attributes: ['id', 'first_name'],
            },
          ],
        },
      ],
      attributes: ['OrderId'],
    });

   // res.json(orderExams);
console.log(orderExams);
    // Pasar los datos a la vista Pug
    res.render('menus/mainsOrder/viewExams.pug', { orderExams });
  } catch (error) {
    console.error('Error fetching order exams:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/


/*
// Obtener exámenes asociados a una orden
router.get('/order/examenesDeLaOrden/:orderId', async (req, res) => {
  try {
    const orderExams = await OrderExam.findAll({
      where: { OrderId: req.params.orderId },
      include: [
        {
          model: Exam,
          attributes: ['id', 'name', 'abbreviation', 'detail', 'active'],
        },
        {
          model: Order,
          include: [
            {
              model: User,
              attributes: ['id', 'first_name', 'last_name'],
            },
          ],
        },
      ],
      attributes: ['OrderId'],
    });

    res.render('menus/mainsOrder/viewExams', { orderExams });
  } catch (error) {
    console.error('Error fetching order exams:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



*/









// Ruta para ver los exámenes de una orden específica
router.get('/order/examenesDeLaOrden/:orderId', authToken, async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Accede al rol del usuario desde req.usuario
    const userRole = req.usuario.rol;

    // Opcional: Puedes usar el rol para auditar o realizar verificaciones adicionales
    console.log("Rol del usuario:", userRole);

    const order = await Order.findByPk(orderId, {
      include: ['User']
    });

    const orderExams = await OrderExam.findAll({
      where: { orderId },
      include: [
        {
          model: Exam,
          as: 'Exam'
        },
        {
          model: Order,
          as: 'Order',
          include: ['User']
        }
      ]
    });

    res.render('menus/mainsOrder/viewExams', {
      orderExams,
      orderId,
      order,
      userRole  // Pasar el rol a la vista si es necesario
    });
  } catch (error) {
    console.error('Error al obtener los exámenes de la orden:', error);
    res.status(500).json({ error: 'Error al obtener los exámenes de la orden' });
  }
});




/*
//funciona, sin auditar
// Ruta para ver los exámenes de una orden específica
router.get('/order/examenesDeLaOrden/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findByPk(orderId, {
      include: ['User']
    });

    const orderExams = await OrderExam.findAll({
      where: { orderId },
      include: [
        {
          model: Exam,
          as: 'Exam'
        },
        {
          model: Order,
          as: 'Order',
          include: ['User']
        }
      ]
    });

    res.render('menus/mainsOrder/viewExams', {
      orderExams,
      orderId,
      order
    });
  } catch (error) {
    console.error('Error al obtener los exámenes de la orden:', error);
    res.status(500).json({ error: 'Error al obtener los exámenes de la orden' });
  }
});
*/











/*
//anda sin auditar
// Ruta para agregar exámenes a la orden
router.post('/order/addExam', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID no proporcionado' });
    }

    const exams = await Exam.findAll({
      where: {
        [Op.or]: [
          { "$Orders.id$": null },
          { "$Orders.id$": { [Op.ne]: orderId } },
        ],
      },
      include: {
        model: Order,
        through: OrderExam,
        required: false,
      },
    });




    res.render("menus/mainsOrder/flotantes/flotanteAddExam", { exams, orderId });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).send('Error interno del servidor');
  }
});
*/






//con audit
router.post('/order/addExam', authToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID no proporcionado' });
    }

    const exams = await Exam.findAll({
      where: {
        [Op.or]: [
          { "$Orders.id$": null },
          { "$Orders.id$": { [Op.ne]: orderId } },
        ],
      },
      include: {
        model: Order,
        through: OrderExam,
        required: false,
      },
    });





    // Ahora puedes acceder a req.usuario.rol en esta ruta
    console.log("Rol del usuario:", req.usuario.rol);

    res.render("menus/mainsOrder/flotantes/flotanteAddExam", { exams, orderId, rol: req.usuario.rol });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).send('Error interno del servidor');
  }
});

/*
//sin audit
// Ruta para registrar exámenes en la orden
router.post('/order/regExams', async (req, res) => {
  const { orderId, examId } = req.body;

  try {
    if (!orderId || !examId) {
      return res.status(400).json({ error: 'Order ID y Exam ID son requeridos' });
    }

    const order = await Order.findByPk(orderId);
    const exam = await Exam.findByPk(examId);

    if (!order || !exam) {
      return res.status(404).json({ error: 'Orden o Examen no encontrado' });
    }

    await OrderExam.create({
      orderId,
      examId
    });

    // Respuesta simple indicando éxito
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al registrar el examen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
*/




//con audit
// Ruta para registrar exámenes en la orden
router.post('/order/regExams', authToken, async (req, res) => {
  const { orderId, examId } = req.body;

  try {
    if (!orderId || !examId) {
      return res.status(400).json({ error: 'Order ID y Exam ID son requeridos' });
    }

    const order = await Order.findByPk(orderId);
    const exam = await Exam.findByPk(examId);

    if (!order || !exam) {
      return res.status(404).json({ error: 'Orden o Examen no encontrado' });
    }

    // Registrar el examen en la orden
    await OrderExam.create({
      orderId,
      examId
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
      null,                 // oldValue (no aplicable en este caso)
      `Exam ID ${examId} añadido`, // newValue
      'Agregar Examen/es a una Orden' // actionType
    );


    // Respuesta simple indicando éxito
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error al registrar el examen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




/*
//anda PERO PODEMOS MEJORARLO
// Ruta para agregar exámenes a la orden
router.post('/order/addExam', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Order ID no proporcionado' });
    }

    const exams = await Exam.findAll({
      where: {
        [Op.or]: [
          { "$Orders.id$": null },
          { "$Orders.id$": { [Op.ne]: orderId } },
        ],
      },
      include: {
        model: Order,
        through: OrderExam,
        required: false,
      },
    });

    res.render("menus/mainsOrder/flotantes/flotanteAddExam", { exams, orderId });
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).send('Error interno del servidor');
  }
});
*/
/*
anda pero no elimina los examenes agreagdps dinamicamente en la vista flotante. se puede mejorar
// Ruta para registrar exámenes en la orden
router.post('/order/regExams', async (req, res) => {
  const { orderId, examId } = req.body;

  try {
    if (!orderId || !examId) {
      return res.status(400).json({ error: 'Order ID y Exam ID son requeridos' });
    }

    const order = await Order.findByPk(orderId);
    const exam = await Exam.findByPk(examId);

    if (!order || !exam) {
      return res.status(404).json({ error: 'Orden o Examen no encontrado' });
    }

    await OrderExam.create({
      orderId,
      examId
    });

    // Respuesta simple indicando éxito
    res.status(200).json({ success: true });

    // Suponiendo que generas algún contenido HTML para mostrar después de agregar el examen
    //    const htmlContent = "<div>Examen agregado exitosamente. Aquí está el contenido HTML que deseas mostrar.</div>";

    //res.status(200).json({ success: true, htmlContent });
    //res.status(200).json({ success: 'Examen agregado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el examen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
*/


/*
// Ruta para ver los exámenes de una orden específica
router.get('/order/:orderId/exams', async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findByPk(orderId, {
      include: ['User']
    });

    const orderExams = await OrderExam.findAll({
      where: { orderId },
      include: [
        {
          model: Exam,
          as: 'Exam'
        },
        {
          model: Order,
          as: 'Order',
          include: ['User']
        }
      ]
    });

    res.render('menus/mainsOrder/viewExams', {
      orderExams,
      orderId, // Pasando orderId para cuando no haya exámenes
      order // Pasando el objeto order para obtener información del usuario
    });
  } catch (error) {
    console.error('Error al obtener los exámenes de la orden:', error);
    res.status(500).json({ error: 'Error al obtener los exámenes de la orden' });
  }
});
*/





/*
//muestras de la orden de los examenes, funciona perfecto en postman
router.get('/muestrasDeLaOrden/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.orderId },
      include: [
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              include: [
                {
                  model: Sample,
                  through: { model: ExamSample },
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order samples:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/


/*
//anda
// Obtener muestras asociadas a una orden. para la vista front
router.get('/order/muestrasDeLaOrden/:orderId', async (req, res) => {
  

  try {
    const order = await Order.findOne({
      where: { id: req.params.orderId },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name','dni','id'],
        },
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              include: [
                {
                  model: Sample,
                  through: { model: ExamSample },
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const samples = order.OrderExams.flatMap(orderExam =>
      orderExam.Exam.Samples.map(sample => ({
        orderId: order.id,
        examName: orderExam.Exam.name,
        sampleType: sample.type,
      }))
    );

    res.render('menus/mainsOrder/viewSamples', { order, samples });
  } catch (error) {
    console.error('Error fetching order samples:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/






router.get('/order/muestrasDeLaOrden/:orderId', async (req, res) => {
  
  const role = req.query.role; // Obtener el rol de la consulta
console.log('role:', role);
  try {
    const order = await Order.findOne({
      where: { id: req.params.orderId },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name','dni','id'],
        },
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              include: [
                {
                  model: Sample,
                  through: { model: ExamSample },
                },
              ],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    const samples = order.OrderExams.flatMap(orderExam =>
      orderExam.Exam.Samples.map(sample => ({
        orderId: order.id,
        examName: orderExam.Exam.name,
        sampleType: sample.type,
      }))
    );

    res.render('menus/mainsOrder/viewSamples', { order, samples, admin, role });
  } catch (error) {
    console.error('Error fetching order samples:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/*----------------------------------------------AGREGAR RESULTADOS -----------------------------------------------*/

/*

router.get('/orders/agregarResultados/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              attributes: ['id', 'name', 'measurement'],
              through: { model: ExamDeterminant },
              include: [
                {
                  model: Value_reference,
                  //required: false
                }
              ]
            }
          ]
        },
        {
          model: Order,
          include: [
            {
              model: User,
              attributes: ['id', 'first_name', 'last_name', 'gender', 'birthdate', 'pregnant']
            }
          ]
        }
      ]
    });

    if (!orderExams.length) {
      return res.status(404).json({ message: 'No order exams found' });
    }

    const user = orderExams[0].Order.User;
    const birthDate = new Date(user.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }



    console.log('Información del usuario:', {
      gender: user.gender,
      age: age,
      pregnant: user.pregnant
    });


    orderExams.forEach(orderExam => {
      orderExam.Exam.Determinants.forEach(determinant => {
        if (determinant.Value_references) {
          console.log('Valores de referencia antes del filtrado:', determinant.Value_references);

          determinant.Value_references = determinant.Value_references.filter(vr => 
            vr.gender === user.gender &&
            age >= vr.age_min &&
            age <= vr.age_max 
             // Comentando la condición de embarazo
            // && (vr.pregnant === null || vr.pregnant === user.pregnant)
          );

          console.log('Valores de referencia después del filtrado:', determinant.Value_references);
        }
      });
    });

    res.render('menus/mainsOrder/flotantes/flotanteAddResults.pug', { orderExams, user, age });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






router.post('/orders/guardarResultados', async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { orderId, ...determinants } = req.body;

  try {
    if (!orderId || Object.keys(determinants).length === 0) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }

    // Paso 1: Obtener los datos necesarios
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [{
        model: Exam,
        include: [{
          model: ExamDeterminant,
          include: [{
            model: Determinant, // Modelo 'Determinant'
            attributes: ['name'], // Incluir el atributo 'name'
          }],
        }],
      }]
    });

    const results = [];

    // Paso 2: Generar e insertar los resultados
    for (const orderExam of orderExams) {
      for (const examDeterminant of orderExam.Exam.ExamDeterminants) {
        const determinantKey = `determinant-${examDeterminant.Determinant.id}`;
        const value = determinants[determinantKey];

        if (value !== undefined) {
          const result = await Result.create({
            value: value,
            orderExamId: orderExam.id,
            examDeterminantId: examDeterminant.id,
          });
          results.push(result);
        }
      }
    }

    console.log('Resultados guardados:', results);
    res.status(201).json({ success: true, message: 'Resultados guardados exitosamente', results });

  } catch (error) {
    console.error('Error al guardar los resultados:', error);
    res.status(500).json({ success: false, message: 'Error al guardar los resultados', error: error.message });
  }
});
*/
















/*
//FUNCIONA PERFECTO sin el filtro para embarazadas
router.get('/orders/agregarResultados/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              attributes: ['id', 'name', 'measurement'],
              through: { model: ExamDeterminant, attributes: ['id'] },
              include: [
                {
                  model: Value_reference,
                }
              ]
            }
          ]
        },
        {
          model: Order,
          include: [
            {
              model: User,
              attributes: ['id', 'first_name', 'last_name', 'gender', 'birthdate', 'pregnant']
            }
          ]
        }
      ]
    });





    //    if (!orderExams.length) {
    //   return res.status(404).json({ message: 'No order exams found' });
    //}

    if (!orderExams.length) {
      return res.status(200).json({ message: 'ingrese examenes a la orden para poder agregar resultados', status: 'not_found' });
    }



    const user = orderExams[0].Order.User;
    const birthDate = new Date(user.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    console.log('Información del usuario:', {
      gender: user.gender,
      age: age,
      pregnant: user.pregnant
    });

    orderExams.forEach(orderExam => {
      orderExam.Exam.Determinants.forEach(determinant => {
        if (determinant.Value_references) {
          console.log('Valores de referencia antes del filtrado:', determinant.Value_references);

          determinant.Value_references = determinant.Value_references.filter(vr =>
            vr.gender === user.gender && age >= vr.age_min && age <= vr.age_max
          );

          console.log('Valores de referencia después del filtrado:', determinant.Value_references);
        }
      });
    });

    //res.render('menus/mainsOrder/flotantes/flotanteAddResults.pug', { orderExams, user, age });
    res.render('menus/mainsOrder/flotantes/flotanteAddResults.pug', { orderExams, user, age });

  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/







router.get('/orders/agregarResultados/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              attributes: ['id', 'name', 'measurement'],
              through: { model: ExamDeterminant, attributes: ['id'] },
              include: [
                {
                  model: Value_reference,
                }
              ]
            }
          ]
        },
        {
          model: Order,
          include: [
            {
              model: User,
              attributes: ['id', 'first_name', 'last_name', 'gender', 'birthdate', 'pregnant']
            }
          ]
        }
      ]
    });

    if (!orderExams.length) {
      return res.status(200).json({ message: 'Ingrese examenes a la orden para poder agregar resultados', status: 'not_found' });
    }

    const user = orderExams[0].Order.User;
    const birthDate = new Date(user.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    console.log('Información del usuario:', {
      gender: user.gender,
      age: age,
      pregnant: user.pregnant
    });

    orderExams.forEach(orderExam => {
      orderExam.Exam.Determinants.forEach(determinant => {
        if (determinant.Value_references) {
          console.log('Valores de referencia antes del filtrado:', determinant.Value_references);

          determinant.Value_references = determinant.Value_references.filter(vr => {
            const isPregnantMatch = (user.gender === 'femenino' && user.pregnant === vr.pregnant);
            return vr.gender === user.gender && age >= vr.age_min && age <= vr.age_max && (user.gender === 'masculino' || isPregnantMatch);
          });

          console.log('Valores de referencia después del filtrado:', determinant.Value_references);
        }
      });
    });

    res.render('menus/mainsOrder/flotantes/flotanteAddResults.pug', { orderExams, user, age });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});










/*
router.get('/orders/agregarResultados/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              attributes: ['id', 'name', 'measurement'],
              through: { model: ExamDeterminant },
              include: [
                {
                  model: Value_reference,
                },

              ]
            }
          ]
        },
        {
          model: Order,
          include: [
            {
              model: User,
              attributes: ['id', 'first_name', 'last_name', 'gender', 'birthdate', 'pregnant']
            },
            {
              model: Result,  // Asegúrate de que estás incluyendo los resultados
              include: [
                {
                  model: Determinant,
                  attributes: ['id']
                }
              ]
            }
          ]

        }
      ]

    });


    if (!orderExams.length) {
      return res.status(404).json({ message: 'No order exams found' });
    }

    const user = orderExams[0].Order.User;
    const birthDate = new Date(user.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    console.log('Información del usuario:', {
      gender: user.gender,
      age: age,
      pregnant: user.pregnant
    });

    orderExams.forEach(orderExam => {
      orderExam.Exam.Determinants.forEach(determinant => {
        console.log('Valor del resultado:', determinant.Results.length ? determinant.Results[0].value : 'No hay resultados');
      });
    });

    res.json(orderExams);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/





//anda con audit
// Ruta para guardar resultados
router.post('/orders/guardarResultados', authToken, async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { orderId, ...determinants } = req.body;

  try {
    if (!orderId || Object.keys(determinants).length === 0) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }

    // Paso 1: Obtener los datos necesarios
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [{
        model: Exam,
        include: [{
          model: ExamDeterminant,
          include: [{
            model: Determinant, // Modelo 'Determinant'
            attributes: ['id', 'name'], // Incluir el atributo 'name'
          }],
        }],
      }]
    });

    const results = [];

    // Paso 2: Generar e insertar los resultados
    for (const orderExam of orderExams) {
      for (const examDeterminant of orderExam.Exam.ExamDeterminants) {
        const determinantKey = `determinant-${examDeterminant.Determinant.id}`;
        const value = determinants[determinantKey];

        if (value !== undefined) {
          const result = await Result.create({
            value: value,
            orderExamId: orderExam.id,
            examDeterminantId: examDeterminant.id,
          });
          results.push(result);

          
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
      'Examen',           // entityType
      userId,                // userId
      userName,              // userName
      userRole,              // userRole
      null,                  // oldValue (no aplicable en este caso)
      `Resultado guardado: ${value}`, // newValue
      'Guardar Resultados de Examenes'   // actionType
    
          );
        }
      }
    }




    
      //`Resultado guardado: ${value}para Determinant ID ${examDeterminant.Determinant.id}`, // newValue


    console.log('Resultados guardados:', results);
    res.status(201).json({ success: true, message: 'Resultados guardados exitosamente', results });

  } catch (error) {
    console.error('Error al guardar los resultados:', error);
    res.status(500).json({ success: false, message: 'Error al guardar los resultados', error: error.message });
  }
});









/*
//anda sin auditar
router.post('/orders/guardarResultados', async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { orderId, ...determinants } = req.body;

  try {
    if (!orderId || Object.keys(determinants).length === 0) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos' });
    }

    // Paso 1: Obtener los datos necesarios
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [{
        model: Exam,
        include: [{
          model: ExamDeterminant,
          include: [{
            model: Determinant, // Modelo 'Determinant'
            attributes: ['id', 'name'], // Incluir el atributo 'name'
          }],
        }],
      }]
    });

    const results = [];

    // Paso 2: Generar e insertar los resultados
    for (const orderExam of orderExams) {
      for (const examDeterminant of orderExam.Exam.ExamDeterminants) {
        const determinantKey = `determinant-${examDeterminant.Determinant.id}`;
        const value = determinants[determinantKey];

        if (value !== undefined) {
          const result = await Result.create({
            value: value,
            orderExamId: orderExam.id,
            examDeterminantId: examDeterminant.id,
          });
          results.push(result);
        }
      }
    }

    console.log('Resultados guardados:', results);
    res.status(201).json({ success: true, message: 'Resultados guardados exitosamente', results });

  } catch (error) {
    console.error('Error al guardar los resultados:', error);
    res.status(500).json({ success: false, message: 'Error al guardar los resultados', error: error.message });
  }
});
*/






//MUESTRA LOS RESULTADOS DE LOS ANALISIS
// Ruta para obtener los resultados de una orden específica
router.get('/orders/verResultados/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              include: [Result]
            }
          ]
        },
        {
          model: User,
          attributes: ['first_name', 'last_name', 'gender']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.render('menus/mainsOrder/flotantes/flotanteVResultsAnalisis.pug', { order });
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).json({ message: 'Error al obtener los resultados' });
  }
});



/*
router.post('/orders/guardarResultados', async (req, res) => {
  try {
    const results = req.body; // Obtén los resultados del cuerpo de la solicitud
    const orderId = results.orderId;

    // Extrae los resultados y elimina el orderId del objeto
    delete results.orderId;

    // Recorre los resultados para guardarlos en la base de datos
    for (const [key, value] of Object.entries(results)) {
      // Extrae el ID del determinante del nombre del campo
      const determinantId = key.split('-')[1];

      // Busca el examen asociado a la orden y al determinante
      const orderExam = await OrderExam.findOne({
        attributes: ['id'],
        where: { orderId: orderId },
        include: [
          {
            model: Exam,
            attributes: ['id'],
            include: [
              {
                model: Determinant,
                attributes: ['id'],
                where: { id: determinantId }
              }
            ]
          }
        ]
      });

      if (orderExam) {
        // Crea un nuevo resultado en la base de datos
        await Result.create({
          value: value,
          orderExamId: orderExam.id,
          examDeterminantId: orderExam.Exam.Determinants[0].ExamDeterminant.id
        });
      }
    }

    // Responde con éxito
    res.json({ success: true, message: 'Resultados guardados exitosamente' });
  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).json({ success: false, message: 'Error al guardar los resultados' });
  }
});
*/


/*
router.get('/orders/agregarResultados/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderExams = await OrderExam.findAll({
      where: { orderId: orderId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              attributes: ['id', 'name', 'measurement'],
              through: { model: ExamDeterminant },
              include: [
                {
                  model: Value_reference,
                  //required: false
                }
              ]
            }
          ]
        },
        {
          model: Order,
          include: [
            {
              model: User,
              attributes: ['id', 'first_name', 'last_name', 'gender', 'birthdate', 'pregnant']
            }
          ]
        }
      ]
    });

    const user = orderExams[0].Order.User;
    const birthDate = new Date(user.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    orderExams.forEach(orderExam => {
      orderExam.Exam.Determinants.forEach(determinant => {
        if (determinant.Value_reference) {
          console.log('Valores de referencia antes del filtrado:', determinant.Value_reference);

          determinant.Value_reference = determinant.Value_reference.filter(vr => 
            vr.gender === user.gender &&
            age >= vr.age_min &&
            age <= vr.age_max 
            //&& (user.gender !== 'femenino' || vr.pregnant === user.pregnant)
          );
          console.log('Valores de referencia después del filtrado:', Determinant.Value_reference);

        }
      });
    });

    res.render('menus/mainsOrder/flotantes/flotanteAddResults.pug', { orderExams, user, age });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/









/*
router.get('/orders/:id', async (req, res) => {
  const orderId = parseInt(req.params.id);

  try {
    const detalleOrden = await Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderExam,
          include: [
            {
              model: Exam,
              attributes: ['name']
            },
            {
              model: Result,
              attributes: ['value', 'id'],
              include: [
                {
                  model: ExamDeterminant,
                  include: [
                    {
                      model: Determinant,
                      attributes: ['name', 'measurement']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!detalleOrden) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Detalle de la Orden:', JSON.stringify(detalleOrden, null, 2));

    res.render('menus/mainsOrder/flotantes/flotanteResults.pug', { detalleOrden });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/


/*
// Ruta para mostrar resultados de una orden específica, probando
router.get('/orderssss/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Determinant,
              include: [
                {
                  model: Result,
                  where: {
                    OrderExamId: 64
                  }
                }
              ]
            }
          ]
        }
      ]
    }).then(order => {
      console.log(order);
    }).catch(error => {
      console.error('Error fetching results:', error);
    });
    

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Error fetching results' });
  }
});
*/









// Ruta para guardar resultados de determinaciones, probando
router.post('/order/saveResults/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { results } = req.body;

    // Iterar sobre los resultados enviados y guardarlos
    for (const determinantId in results) {
      const value = results[determinantId];
      await Result.create({
        orderId,
        determinantId,
        value
      });
    }

    res.status(200).json({ message: 'Resultados guardados exitosamente' });
  } catch (error) {
    console.error('Error al guardar resultados:', error);
    res.status(500).json({ error: 'Error al guardar resultados' });
  }
});






router.post('order/updateResults', async (req, res) => {
  const { orderId, results } = req.body;
  try {
    for (let result of results) {
      await Determinant.update(
        { value: result.value },
        { where: { id: result.determinantId } }
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar los resultados.' });
  }
});



module.exports = router;
