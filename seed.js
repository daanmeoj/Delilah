// importing Bluebird promises so we can Promise.map
const Promise = require("bluebird");
// bring in the db and all the Models to seed
const db = require("./db");
const Producto = require("./models/Producto");
const Pago = require("./models/Pago");
const Pedido = require("./models/Pedido");
const Stage = require("./models/Stage");
const Rol = require("./models/Rol");

// each of the following array will be iterated and Created

const productoData = [
  {
    name: "Pizza Megafamiliar",
    price: 34000,
  },
  {
    name: "Corral Callejera",
    price: 41000,
  },
  {
    name: "Cerveza Corona",
    price: 21000,
  },
];

const pagoData = [
  {
    name: "Efectivo",
  },
  {
    name: "Tarjeta de credito",
  },
  {
    name: "Rappi pay",
  },
];

const pedidoData = [
  {
    total: 14000,
  },
  {
    total: 21000,
  },
  {
    total: 55000,
  },
];

const stageData = [
  {
    name: "Nuevo",
  },
  {
    name: "Confirmado",
  },
  {
    name: "Preparado",
  },
  {
    name: "Enviado",
  },
  {
    name: "Entregado",
  },
];

const rolData = [
  {
    name: "Admin",
  },
  {
    name: "Customer",
  },
];

// We will go through the Models one by one and create an instance
// for each element in the array. Look below for a commented out version of how to do this in one slick nested Promise.

// Sync and restart db before seeding
db.sync({ force: true })
  .then(() => {
    console.log("synced DB and dropped old data");
  })
  .then(() => {
    return Promise.map(productoData, (producto) => Producto.create(producto));
  })
  .then((createdProductos) => {
    console.log(`${createdProductos.length} productos created`);
  })
  .then(() => {
    return Promise.map(pagoData, (pago) => Pago.create(pago));
  })
  .then((createdPagos) => {
    console.log(`${createdPagos.length} pagos created`);
  })
  .then(() => {
    return Promise.map(pedidoData, (pedido) => Pedido.create(pedido));
  })
  .then((createdPedidos) => {
    console.log(`${createdPedidos.length} pagos created`);
  })
  .then(() => {
    return Promise.map(stageData, (stage) => Stage.create(stage));
  })
  .then((createdStages) => {
    console.log(`${createdStages.length} pagos created`);
  })
  .then(() => {
    return Promise.map(rolData, (rol) => Rol.create(rol));
  })
  .then((createdRoles) => {
    console.log(`${createdRoles.length} pagos created`);
  })
  .then(() => {
    console.log("Seeded successfully");
  })
  .catch((err) => {
    console.error("Error!", err, err.stack);
  })
  .finally(() => {
    db.close();
    console.log("Finished!");
    return null;
  });
