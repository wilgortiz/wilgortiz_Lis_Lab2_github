// routes/auditRoutes.js
const express = require('express');
const router = express.Router();
const { Audit } = require('../models'); // Asegúrate de ajustar la ruta del modelo según tu estructura
// routes/auditRoutes.js
router.get('/audits', async (req, res) => {
    try {
      // Obtener datos de la tabla 'audits'
      const audits = await Audit.findAll();
      
      // Verifica los datos obtenidos
      console.log('Datos de auditoría:', audits);
  
      // Renderizar la vista 'mainAudit.pug' y pasar los datos
      res.render("menus/mainAudit.pug", { audits });
    } catch (error) {
      console.error('Error al obtener datos de auditoría:', error);
      res.status(500).send('Error al obtener datos de auditoría.');
    }
  });
  
module.exports = router;
