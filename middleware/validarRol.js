const rolAdmin = 1;
const Usuario = require("../models/Usuario");

const validarRol = async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuarioId);

  if (usuario.rolId === rolAdmin) {
    next();
  } else {
    return res.json({
      error: "Usuario no autorizado",
    });
  }
};

module.exports = {
  validarRol: validarRol,
};
