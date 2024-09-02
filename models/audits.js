'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Audit extends Model {

        static associate(models) {
            // Define associations here if needed
        }
    }

    Audit.init({
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        entityType: {
            type: DataTypes.STRING,
            allowNull: false  // Ej: "Paciente", "Examen"
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userRole: {
            type: DataTypes.STRING,
            allowNull: false
        },
        oldValue: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        newValue: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        actionTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        actionType: {
            type: DataTypes.STRING,
            allowNull: false  // Ej: "Creación", "Modificación", "Eliminación"
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'Audit',
    });

    return Audit;
};
