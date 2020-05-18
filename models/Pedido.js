const Sequelize = require("sequelize");
const db = require("../db");

const Pedido = db.define("pedido", {
  total: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Pedido;
