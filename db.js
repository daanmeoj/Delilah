const Sequelize = require("sequelize");

// when you go to start the server, be smarter than me and make sure you have postgres actually running on your machine!
const db = new Sequelize("delilah", "root", "new_password", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;

// We'll define associations after we import them here
const Puppy = require("./models/Puppy");
const Park = require("./models/Park");
const Food = require("./models/Food");
const Location = require("./models/Location");
const Pedido = require("./models/Pedido");
const Pago = require("./models/Pago");
const Stage = require("./models/Stage");
const Usuario = require("./models/Usuario");
const Producto = require("./models/Producto");
const Rol = require("./models/Rol");

// this will put a foreign key for parkId in the Puppy model
// and give Puppy .setPark() and .getPark() instance methods
Puppy.belongsTo(Park);
Pedido.belongsTo(Pago);
Pedido.belongsTo(Stage);
Park.hasMany(Puppy);
Pedido.belongsTo(Usuario);
Usuario.belongsTo(Rol);
Usuario.hasMany(Pedido);
// this will give Park the magic methods for addPuppy, etc.
// but we already have a foreign key for parkId in the Puppy model, so it will maintain
// the 1:m relationship

// Puppy to food M:M associations
// stored in the same-named join table: 'puppiesFoods'
// the `through` property is required in `belongsToMany` associations
// aliased differently in each model
Puppy.belongsToMany(Food, { as: "favFoods", through: "puppiesFoods" });
Food.belongsToMany(Puppy, { as: "puppies", through: "puppiesFoods" });
Pedido.belongsToMany(Producto, {
  as: "chosenProductos",
  through: "pedidosProductos",
});
Producto.belongsToMany(Pedido, {
  as: "Pedidos",
  through: "pedidosProductos",
});
// Puppies can have a best friend Puppy
Puppy.belongsTo(Puppy, { as: "bestFriend" });
// in this case, you always need to alias the association

// puts .setLocation() .getLocation() and `locationId` on the Park model
