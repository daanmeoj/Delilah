var express = require("express");
var volleyball = require("volleyball");
var bodyParser = require("body-parser");
var path = require("path");
var usuarioMiddleware = require("./middleware/usuario");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Delilah Resto API",
      description: "Delilah Resto API Information",
      contact: {
        name: "David Mercado",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./routes/*.js"],
};

var db = require("./db");

// our routers
var productosRouter = require("./routes/productos");
var usuariosRouter = require("./routes/usuarios");
var pedidosRouter = require("./routes/pedidos");

// instantiate an instance of an express server
var app = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Logging and body parsing middleware does not have a path argument
// but just a callback function. If the first argument to an app.use call
// is a callback, it always matches that middleware on every request.

// logging middleware - written by Fullstack's own Gabriel Lebec!
app.use(volleyball);
// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files like images, css, html, etc
// any get request that matches a particular file in the /public folder
// can be found and sent back
// for example - GET request to
// localhost:3000/large.jpg' will send back a puppy image
app.use(express.static(path.join(__dirname, "public")));

// API routers to serve up data from the server

app.use("/productos", usuarioMiddleware.checkToken, productosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/pedidos", usuarioMiddleware.checkToken, pedidosRouter);
// all routes will eventually hit this by default if response is not sent
// or if it doesn't hit a route
app.use("*", function (req, res, next) {
  res.send("this is my default route");
});

// actually start the server
var server = app.listen(3000, function () {
  // this is an async callback, so the server.address().port is available
  // and set synchronously by the time we get into this callback function - fancy!
  console.log(
    "Server operating and listening on port",
    server.address().port,
    "..."
  );
  // change to force: true whenever you make a change to the db definition
  db.sync({ force: false })
    .then((message) => {
      console.log("...and db is synced!");
    })
    .catch(function (err) {
      throw err;
    });
});
