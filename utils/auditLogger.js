// utils/auditLogger.js
const { Audit } = require('../models');  

async function logAudit(entityId, entityType, userId, userName, userRole, oldValue, newValue, actionType) {
    try {
        await Audit.create({
            entityId,
            entityType,
            userId,
            userName,
            userRole,
            oldValue,
            newValue,
            actionTime: new Date(),
            actionType
        });
    } catch (error) {
        console.error('Error al registrar la auditoría:', error);
    }
}

module.exports = logAudit;
