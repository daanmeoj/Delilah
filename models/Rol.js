const Sequelize = require("sequelize");
const db = require("../db");

const Rol = db.define("rol", {
  name: {
    type: Sequelize.STRING,
  },
});

module.exports = Rol;
