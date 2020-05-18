const Sequelize = require("sequelize");
const db = require("../db");

const Pago = db.define("pago", {
  name: {
    type: Sequelize.STRING,
  },
});

module.exports = Pago;
