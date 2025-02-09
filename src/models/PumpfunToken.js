const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const PumpFunToken = sequelize.define('PumpFunToken', {
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
    timestamps: false,
    tableName: 'PumpFunToken'
  });

module.exports = PumpFunToken;
