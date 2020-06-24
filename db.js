const Sequelize = require("sequelize");

const db = new Sequelize("delilah", "root", "new_password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;

const Pedido = require("./models/Pedido");
const Pago = require("./models/Pago");
const Stage = require("./models/Stage");
const Usuario = require("./models/Usuario");
const Producto = require("./models/Producto");
const Rol = require("./models/Rol");

Pedido.belongsTo(Pago);
Pedido.belongsTo(Stage);
Pedido.belongsTo(Usuario);
Usuario.belongsTo(Rol);
Usuario.hasMany(Pedido);

Pedido.belongsToMany(Producto, {
  as: "chosenProductos",
  through: "pedidosProductos",
});
Producto.belongsToMany(Pedido, {
  as: "Pedidos",
  through: "pedidosProductos",
});
