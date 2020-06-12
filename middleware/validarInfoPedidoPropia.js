const rolAdmin = 1;
const Usuario = require("../models/Usuario");
const Pedido = require("../models/Pedido");

const validarInformacionPedidoPropia = async (req, res, next) => {
  //console.log(req.params.id);
  const pedido = await Pedido.findById(req.params.id);
  const usuario = await Usuario.findById(req.usuarioId);

  console.log("pedido usuario id", pedido.usuarioId);
  console.log("req usuario id", req.usuarioId);
  console.log(pedido.usuarioId == req.usuarioId);

  if (usuario.rolId === rolAdmin || pedido.usuarioId === req.usuarioId) {
    next();
  } else {
    return res.json({
      error: "Usted solo puede acceder a su informacion",
    });
  }
};

module.exports = {
  validarInformacionPedidoPropia: validarInformacionPedidoPropia,
};
