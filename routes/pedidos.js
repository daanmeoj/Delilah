const router = require("express").Router();
const Pedido = require("../models/Pedido");
const middleware = require("../middleware/validarRol");
const middlewareValidarInfoPedidoPropia = require("../middleware/validarInfoPedidoPropia");
const Producto = require("../models/Producto");
const { check, validationResult } = require("express-validator");
const Stage = require("../models/Stage");
const Pago = require("../models/Pago");
const Usuario = require("../models/Usuario");

const calcularTotal = async (req, res, next) => {
  producto = await Producto.findById(req.body.productoId);
  if (!producto) {
    return res.json({
      Error: `productId es obligatorio`,
    });
  }
  if (!req.body.total) {
    req.body.total = 0;
  }
  req.body.total = producto.price;
  next();
};

const AgregarParametrosPorDefecto = async (req, res, next) => {
  req.body.stageId = 1;
  req.body.pagoId = 1;
  next();
};

module.exports = router;

// get all pedidos
router.get("/", middleware.validarRol, async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: { all: true },
    });
    res.json(pedidos);
  } catch (e) {
    res.json({
      Error: `hubo un error encontrando todos los pedidos: ${e.message}`,
    });
  }
});

// post a new pedido
router.post("/", AgregarParametrosPorDefecto, async (req, res) => {
  try {
    const pedido = await Pedido.create(req.body);
    console.log(req.body.productoIds[0]);
    res.json(pedido);
  } catch (e) {
    res.json({
      Error: `hubo un error creando pedido: ${e.message}`,
    });
  }
});

// get pedido by id
router.get(
  "/:id",
  middlewareValidarInfoPedidoPropia.validarInformacionPedidoPropia,
  async (req, res) => {
    try {
      const pedido = await Pedido.findById(req.params.id, {
        include: { all: true },
      });
      return res.json(pedido);
    } catch (e) {
      res.json({
        Error: `hubo un error encontrando pedido con id ${req.params.id}, el error es: ${e.message}`,
      });
    }
  }
);

// update the pago of a pedido
// needs a pagoId prop in the req.body
router.put(
  "/:id/pago",
  [check("pagoId", "el pago es obligatorio").not().isEmpty()],
  middlewareValidarInfoPedidoPropia.validarInformacionPedidoPropia,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
      }
      const pago = await Pago.findOne({
        where: { id: req.body.pagoId },
      });
      if (pago) {
        const pedido = await Pedido.findById(req.params.id);
        pedido.setPago(req.body.pagoId);
        res.send(pedido);
      } else {
        res.json({ Error: `El pagoId ${req.body.pagoId} no existe` });
      }
    } catch (e) {
      res.json({
        Error: `hubo un error actualizando el metodo de pago: ${e.message}`,
      });
    }
  }
);

// update the pago of a pedido
// needs a pagoId prop in the req.body
router.put(
  "/:id/stage",
  middleware.validarRol,
  [check("stageId", "el stageId es obligatorio").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
      }
      const pedido = await Pedido.findById(req.params.id);
      if (pedido) {
        const stage = await Stage.findOne({
          where: { id: req.body.stageId },
        });
        if (stage) {
          pedido.setStage(req.body.stageId);
          res.send(pedido);
        } else {
          res.json({ Error: `el stageId ${req.body.stageId} no existe` });
        }
      }
      return res
        .status(404)
        .json({ Error: `El id ${req.params.id} no existe` });
    } catch (e) {
      res.json({
        Error: `hubo un error actualizando el stage: ${e.message}`,
      });
    }
  }
);

// add producto of a pedido
// needs a productoId prop in the req.bodyy
router.put(
  "/:id/producto",
  middlewareValidarInfoPedidoPropia.validarInformacionPedidoPropia,
  calcularTotal,
  async (req, res) => {
    try {
      const pedido = await Pedido.findById(req.params.id, {
        include: { all: true },
      });
      if (!pedido) {
        return res.sendStatus(404);
      }
      let suma;
      suma = pedido.total + req.body.total;
      let a = await pedido.getChosenProductos();
      setTimeout(() => {
        let flagInsertar = true;
        for (i = 0; i < a.length; i++) {
          if (a[i].id == req.body.productoId) {
            flagInsertar = false;
          }
        }
        console.log(flagInsertar);
        if (flagInsertar) {
          pedido.addChosenProductos(req.body.productoId);
          pedido.update({ total: suma });
          res.send(pedido);
        } else {
          res.json({ Error: "No se puede agregar porque ya estaba agregado" });
        }
      }, 500);
    } catch (e) {
      res.json({
        Error: `hubo un error actualizando el stage: ${e.message}`,
      });
    }
  }
);

// router.put("/:id/usuario", middleware.validarRol, async (req, res) => {
//   const pedido = await Pedido.findById(req.params.id);
//   if (!pedido) {
//     return res.status(404).json({ Error: "este pedido no existe" });
//   }
//   const usuario = await Usuario.findOne({
//     where: { id: req.body.usuarioId },
//   });
//   if (usuario) {
//     pedido.setUsuario(req.body.usuarioId);
//     res.send(pedido);
//   } else {
//     res.json({ Error: `usuario con id ${req.body.usuarioId} no existe` });
//   }

//   // return pedido.update({pagoId: req.body.id})
// });
