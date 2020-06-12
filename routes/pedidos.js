const router = require("express").Router();

const Pedido = require("../models/Pedido");
const Pago = require("../models/Pago");
const Stage = require("../models/Stage");
const middleware = require("../middleware/validarRol");
const middlewareValidarInfoPedidoPropia = require("../middleware/validarInfoPedidoPropia");

module.exports = router;

// get all pedidos
router.get("/", middleware.validarRol, async (req, res) => {
  const pedidos = await Pedido.findAll({
    include: { all: true },
  });
  res.json(pedidos);
});

// post a new pedido
router.post("/", async (req, res) => {
  console.log(req.body.total);
  // req.body.usuarioId = req.usuarioId;
  const pedido = await Pedido.create(req.body);

  res.json(pedido);
});

// get pedido by id
router.get(
  "/:id",
  middlewareValidarInfoPedidoPropia.validarInformacionPedidoPropia,
  async (req, res) => {
    const pedido = await Pedido.findById(req.params.id, {
      include: { all: true },
    });
    res.json(pedido);
  }
);

// update the pago of a pedido
// needs a pagoId prop in the req.body
router.put(
  "/:id/pago",
  middlewareValidarInfoPedidoPropia.validarInformacionPedidoPropia,
  async (req, res) => {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.sendStatus(404);
    }
    pedido.setPago(req.body.pagoId);
    res.send(pedido);
    // return pedido.update({pagoId: req.body.id})
  }
);

// update the pago of a pedido
// needs a pagoId prop in the req.body
router.put("/:id/stage", middleware.validarRol, async (req, res) => {
  const pedido = await Pedido.findById(req.params.id);
  if (!pedido) {
    return res.sendStatus(404);
  }
  pedido.setStage(req.body.stageId);
  res.send(pedido);
  // return pedido.update({pagoId: req.body.id})
});

router.put("/:id/usuario", middleware.validarRol, async (req, res) => {
  const pedido = await Pedido.findById(req.params.id);
  if (!pedido) {
    return res.sendStatus(404);
  }
  pedido.setUsuario(req.body.usuarioId);
  res.send(pedido);
  // return pedido.update({pagoId: req.body.id})
});

// we will get a foodId in the req.body
router.put(
  "/:id/producto",
  middlewareValidarInfoPedidoPropia.validarInformacionPedidoPropia,
  async (req, res) => {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.sendStatus(404);
    }

    console.log(pedido.chosenProductos);

    pedido.addChosenProductos(req.body.productoId);
    res.send(pedido);
  }
);
