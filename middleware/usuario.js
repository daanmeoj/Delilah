const jwt = require("jwt-simple");
const moment = require("moment");

const checkToken = (req, res, next) => {
  console.log(req.headers["user-token"]);
  if (!req.headers["user-token"]) {
    return res.json({
      error: "necesitas incluir el user-token en la cabecera",
    });
  }
  const usertoken = req.headers["user-token"];
  let payload = {};
  try {
    payload = jwt.decode(usertoken, "frase secreta");
  } catch (err) {
    return res.json({ error: "el token es incorrecto" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.json({ error: "el token ha expirado" });
  }

  req.usuarioId = payload.usuarioId;

  next();
};

module.exports = {
  checkToken: checkToken,
};
