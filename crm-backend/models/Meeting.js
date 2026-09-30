const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');
const Lead = require('./Lead');
const User = require('./User');

const Meeting = sequelize.define(
  'Meeting',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    leadId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lead,
        key: 'id',
      },
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        'zoom',
        'teams',
        'in_person',
        'call'
      ),
      defaultValue: 'zoom',
    },
        title: { 
          type: DataTypes.STRING, 
          allowNull: true 
        },
          
        meetingLink: {
           type: DataTypes.STRING, 
           allowNull: true 
          },

        notes: {
           type: DataTypes.TEXT, 
           allowNull: true 
          },

        status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
    },

    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },

  {
    tableName: 'meetings',
    timestamps: true,
  }
);

Meeting.belongsTo(Lead, {
  foreignKey: 'leadId',
  as: 'lead',
});

Meeting.belongsTo(User, {
  foreignKey: 'assignedTo',
  as: 'assignedRep',
});

module.exports = Meeting;