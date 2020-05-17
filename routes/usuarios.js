const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const jwt = require("jwt-simple");
const Usuario = require("../models/Usuario");

module.exports = router;

router.post(
  "/register",
  [check("username", "el nombre de usuario es obligatorio").not().isEmpty()],
  [check("firstName", "el nombre es obligatorio").not().isEmpty()],
  [check("lastName", "el apellido es obligatorio").not().isEmpty()],
  [check("email", "el email debe estar correcto").isEmail()],
  [check("phoneNumber", "el telefono es obligatorio").not().isEmpty()],
  [check("deliveryAddress", "la direccion es obligatoria").not().isEmpty()],
  [check("password", "el password es obligatorio").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errores: errors.array() });
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
  }
);

router.post("/login", async (req, res) => {
  const userByEmail = await Usuario.findOne({
    where: { email: req.body.email },
  });
  const userByUsername = await Usuario.findOne({
    where: { username: req.body.username },
  });
  if (userByEmail || userByUsername) {
    const iguales = userByEmail
      ? bcrypt.compareSync(req.body.password, userByEmail.password)
      : bcrypt.compareSync(req.body.password, userByUsername.password);

    const user = userByEmail ? userByEmail : userByUsername;

    if (iguales) {
      res.json({ success: createToken(user) });
    } else {
      res.json({ error: "error en usuario i/o contrasenas" });
    }
  } else {
    res.json({ error: "error en usuario i/o contrasenas" });
  }
});

const createToken = (usuario) => {
  const payload = {
    usuarioId: usuario.id,
    createAt: moment().unix(),
    expiredAt: moment().add(5, "minutes").unix(),
  };

  return jwt.encode(payload, "frase secreta");
};