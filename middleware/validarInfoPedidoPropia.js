const rolAdmin = 1;
const Usuario = require("../models/Usuario");
const Pedido = require("../models/Pedido");

const validarInformacionPedidoPropia = async (req, res, next) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (pedido) {
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
    } else {
      return res.json({
        error: `El id ${req.params.id} no existe`,
      });
    }
  } catch (e) {
    res.json({
      Error: `hubo un error al valir informacion pedido propio: ${e.message}`,
    });
  }
};

module.exports = {
  validarInformacionPedidoPropia: validarInformacionPedidoPropia,
};
