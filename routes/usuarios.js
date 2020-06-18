const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const moment = require("moment");
const jwt = require("jwt-simple");
const Usuario = require("../models/Usuario");
const Pedido = require("../models/Pedido");
var usuarioMiddleware = require("../middleware/usuario");
const informacionPropiaMiddleware = require("../middleware/ConsultaInformacionPropia");

module.exports = router;

// get by id with the associated puppies
router.get(
  "/:id/pedidos",
  usuarioMiddleware.checkToken,
  informacionPropiaMiddleware.consultaInformacionPropia,
  (req, res, next) => {
    Usuario.findById(req.params.id, {
      include: [Pedido],
    })
      .then(res.send.bind(res))
      .catch(next);
  }
);

//Routes
/**
 * @swagger
 * /usuarios/register:
 *  post:
 *     description: se usa para registrar un nuevo usuario
 *     parameters:
 *        - in: body
 *          name: Usuario
 *          required: false
 *          schema:
 *            $ref: "#/definitions/Usuario"
 *     responses:
 *         '200':
 *            description: Success
 *definitions:
 *  Usuario:
 *    properties:
 *        username:
 *            type: string
 *            required: true
 *        firstName:
 *            type: string
 *            required: true
 *        lastName:
 *            type: string
 *            required: true
 *        email:
 *            type: string
 *            required: true
 *        phoneNumber:
 *            type: string
 *            required: true
 *        deliveryAddress:
 *            type: string
 *            required: true
 *        password:
 *            type: string
 *            required: true
 *        rolId:
 *            type: string
 *            required: true
 */
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
      }
      const userByEmail = await Usuario.findOne({
        where: { email: req.body.email },
      });

      const userByUsername = await Usuario.findOne({
        where: { username: req.body.username },
      });

      if (userByEmail) {
        return res
          .status(422)
          .json({ errores: "Este email ya existe, favor use otro" });
      } else if (userByUsername) {
        return res
          .status(422)
          .json({ errores: "Este username ya existe, favor use otro" });
      } else {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const usuario = await Usuario.create(req.body);
        res.json(usuario);
      }
    } catch (e) {
      res.json({
        Error: `hubo un error con el registro: ${e.message}`,
      });
    }
  }
);

//Routes
/**
 * @swagger
 * /usuarios/login:
 *  post:
 *     description: Se usa para que el usuario se loguee
 *     parameters:
 *        - in: body
 *          name: Usuario
 *          schema:
 *            $ref: "#/definitions/UsuarioParaLogueo"
 *     responses:
 *         '200':
 *            description: Success
 *definitions:
 *  UsuarioParaLogueo:
 *    properties:
 *        username:
 *            type: string
 *        email:
 *            type: string
 *        password:
 *            type: string
 */
router.post(
  "/login",
  [check("username", "el nombre de usuario es obligatorio").not().isEmpty()],
  [check("password", "el password es obligatorio").not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
      }
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
    } catch (e) {
      res.json({
        Error: `hubo un error con el login: ${e.message}`,
      });
    }
  }
);

const createToken = (usuario) => {
  const payload = {
    usuarioId: usuario.id,
    createAt: moment().unix(),
    expiredAt: moment().add(50, "minutes").unix(),
  };

  return jwt.encode(payload, "frase secreta");
};
