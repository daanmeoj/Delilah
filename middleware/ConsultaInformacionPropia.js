const rolAdmin = 1;
const Usuario = require("../models/Usuario");

const consultaInformacionPropia = async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuarioId);

  console.log(req.usuarioId == req.params.id);

  if (usuario.rolId === rolAdmin || req.usuarioId == req.params.id) {
    next();
  } else {
    return res.json({
      error: "Usted solo puede acceder a su informacion",
    });
  }
};

module.exports = {
  consultaInformacionPropia: consultaInformacionPropia,
};
