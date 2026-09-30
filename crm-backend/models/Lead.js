const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const RATES = {
  AED: 1,
  USD: 3.6725,
  EUR: 4.0,
  GBP: 4.7,
  SAR: 0.979,
  QAR: 1.009,
};

const Lead = sequelize.define(
  'Lead',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    leadSource: {
      type: DataTypes.ENUM(
        'meta',
        'google',
        'website',
        'upwork',
        'b2b',
        'email',
        'manual'
      ),
      allowNull: false,
    },

    serviceRequired: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    campaign: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    assignedTo: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: true,
    },

    currency: {
      type: DataTypes.ENUM(
        'AED',
        'USD',
        'EUR',
        'GBP',
        'SAR',
        'QAR'
      ),
      defaultValue: 'AED',
    },

    opportunityValue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },

    valueAED: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
      defaultValue: 0,
    },

    nextFollowUp: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        'new',
        'assigned',
        'contacted',
        'not_contacted',
        'interested',
        'not_interested',
        'qualified',
        'unqualified',
        'follow_up',
        'meeting',
        'proposal',
        'negotiation',
        'won',
        'lost'
      ),
      defaultValue: 'new',
    },
  },

  {
    tableName: 'leads',
    timestamps: true,

    hooks: {
      beforeSave: (lead) => {
        const opportunityValue = Number(
          lead.opportunityValue || 0
        );

        const exchangeRate = RATES[lead.currency] || 1;

        lead.valueAED = Math.round(
          opportunityValue * exchangeRate
        );
      },
    },
  }
);

Lead.belongsTo(User, {
  foreignKey: 'assignedTo',
  as: 'assignedRep',
});

module.exports = Lead;