const router = require("express").Router();
const Pedido = require("../models/Pedido");
const middleware = require("../middleware/validarRol");
const middlewareValidarInfoPedidoPropia = require("../middleware/validarInfoPedidoPropia");
const Producto = require("../models/Producto");
const { check, validationResult } = require("express-validator");
const Stage = require("../models/Stage");
const Pago = require("../models/Pago");
const Usuario = require("../models/Usuario");
let log = ";";

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

// const AgregarParametrosPorDefecto = async (req, res, next) => {
//   req.body.stageId = 1;
//   req.body.pagoId = 1;
//   next();
// };

const AgregarProductos = async (req, res, next) => {
  setTimeout(async () => {
    console.log("HOLAAAAA", req.body.idPedido);
    let suma;
    log = "";
    for (let productoId of req.body.chosenProductos) {
      producto = await Producto.findById(productoId);
      console.log(await producto);
      if (producto) {
        console.log("ENTRO");
        const pedido = await Pedido.findById(req.body.idPedido, {
          include: { all: true },
        });
        let productosExistentes = await pedido.getChosenProductos();

        // setTimeout(() => {
        let flagInsertar = true;
        for (i = 0; i < productosExistentes.length; i++) {
          if (productosExistentes[i].id == productoId) {
            flagInsertar = false;
          }
        }
        console.log(flagInsertar);
        if (flagInsertar) {
          suma = pedido.total + producto.price;
          pedido.addChosenProductos(productoId);
          pedido.update({ total: suma });
          log += `producto con id ${productoId} insertado: `;
        } else {
          log += `producto con id ${productoId} no insertado porque ya existe; `;
        }
        // }, 500);
        //suma += await producto.price;
      } else {
        log += `producto con id ${productoId} no insertado porque no existe un producto con ese id; `;
      }

      //console.log(await producto.name);
    }
    console.log(log);
  }, 1000);

  next();
};

module.exports = router;

//Routes
/**
 * @swagger
 * /pedidos:
 *  get:
 *     description: Se usa para obtener todos los pedidos
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                type: array
 *                items:
 *                     $ref: "#/definitions/Pedido"
 *definitions:
 *  Pedido:
 *    properties:
 *        id:
 *            type: integer
 *        total:
 *            type: integer
 *        pagoId:
 *            type: integer
 *        stageId:
 *            type: integer
 *        usuarioId:
 *            type: integer
 *        pago:
 *           type: object
 *           properties:
 *              id:
 *                type: integer
 *              name:
 *                type: string
 *        stage:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              name:
 *                type: string
 *        usuario:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              name:
 *                type: string
 *        chosenProductos:
 *              schema: array
 *              items:
 *                  type: object
 *                  properties:
 *                      id:
 *                        type: integer
 *                      name:
 *                        type: string
 *                      price:
 *                        type: integer
 *                      urlImage:
 *                        type: string
 */
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

//Routes
/**
 * @swagger
 * /pedidos:
 *  post:
 *     description: Se usa para crear un pedido
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: body
 *          name: Pedido
 *          required: true
 *          schema:
 *            $ref: "#/definitions/PedidoParaCrear"
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/PedidoParaCrear"
 *definitions:
 *  PedidoParaCrear:
 *    properties:
 *        pagoId:
 *            type: integer
 *        stageId:
 *            type: integer
 *        usuarioId:
 *            type: integer
 *        chosenProductos:
 *              schema: array
 *              items:
 *                  type: string
 */
router.post(
  "/",
  [
    check("chosenProductos", "los productoIds son obligatorios")
      .not()
      .isEmpty(),
  ],
  AgregarProductos,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
      }
      const pedido = await Pedido.create(req.body);

      req.body.idPedido = pedido.id;
      setTimeout(() => {
        res.json({ Result: log });
      }, 2000);
    } catch (e) {
      res.json({
        Error: `hubo un error creando pedido: ${e.message}`,
      });
    }
  }
);

//Routes
/**
 * @swagger
 * /pedidos/{pedidoId}:
 *  get:
 *     description: Se usa para obtener un pedido por su Id
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: pedidoId
 *          required: true
 *          description: Numeric id of the pedido
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Pedido"
 */
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

//Routes
/**
 * @swagger
 * /pedidos/{pedidoId}/pago:
 *  put:
 *     description: Se usa para actualizar la forma de pago de un pedido
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: pedidoId
 *          required: true
 *          description: Numeric id of the pedido
 *        - in: body
 *          name: pagoId
 *          schema:
 *             $ref: "#/definitions/PedidoParaActualizarPago"
 *          required: true
 *          description: Numeric id of the pago
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Pedido"
 *definitions:
 *  PedidoParaActualizarPago:
 *    properties:
 *        pagoId:
 *            type: integer
 */
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

//Routes
/**
 * @swagger
 * /pedidos/{pedidoId}/stage:
 *  put:
 *     description: Se usa para actualizar el stage en que se encuentra un pedido
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: pedidoId
 *          required: true
 *          description: Numeric id of the pedido
 *        - in: body
 *          name: stageId
 *          schema:
 *             $ref: "#/definitions/PedidoParaActualizarStage"
 *          required: true
 *          description: Numeric id of the stage
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Pedido"
 *definitions:
 *  PedidoParaActualizarStage:
 *    properties:
 *        stageId:
 *            type: integer
 */
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

//Routes
/**
 * @swagger
 * /pedidos/{pedidoId}/producto:
 *  put:
 *     description: Se usa para agregar un producto a un pedido
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: pedidoId
 *          required: true
 *          description: Numeric id of the pedido
 *        - in: body
 *          name: productoId
 *          schema:
 *             $ref: "#/definitions/ProductoParaAgregar"
 *          required: true
 *          description: Numeric id of the producto
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Pedido"
 *definitions:
 *  ProductoParaAgregar:
 *    properties:
 *        productoId:
 *            type: integer
 */
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
