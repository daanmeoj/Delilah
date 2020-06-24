const router = require("express").Router();
const Producto = require("../models/Producto");
const middleware = require("../middleware/validarRol");
const { check, validationResult } = require("express-validator");

module.exports = router;

//Routes
/**
 * @swagger
 * /productos:
 *  get:
 *     description: Se usa para obtener todos los productos
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
 *                     $ref: "#/definitions/Producto"
 *definitions:
 *  Producto:
 *    properties:
 *        id:
 *            type: integer
 *        name:
 *            type: string
 *        price:
 *            type: integer
 *        urlImage:
 *            type: string
 */
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (e) {
    res.json({
      Error: `hubo un error encontrando todos los productos: ${e.message}`,
    });
  }
});

//Routes
/**
 * @swagger
 * /productos/{productoId}:
 *  get:
 *     description: Se usa para obtener un producto por su Id
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: productoId
 *          required: true
 *          description: Numeric id of the producto
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Producto"
 */
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      return res.json(producto);
    }
    res.status(404).json({
      Error: `id ${req.params.id} no existe`,
    });
  } catch (e) {
    res.json({
      Error: `hubo un error encontrandoproducto con id ${req.params.id}, el error es: ${e.message}`,
    });
  }
});

//Routes
/**
 * @swagger
 * /productos:
 *  post:
 *     description: Se usa para crear un producto
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: body
 *          name: Producto
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ProductoParaCrear"
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/PedidoParaCrear"
 *definitions:
 *  ProductoParaCrear:
 *    properties:
 *        name:
 *            type: string
 *        price:
 *            type: integer
 *        urlImage:
 *            type: string
 */
router.post(
  "/",
  [check("name", "el nombre del producto es obligatorio").not().isEmpty()],
  [
    check("price", "el precio debe ser un valor numerico")
      .isNumeric()
      .not()
      .isEmpty(),
  ],
  [check("urlImage", "la url de la imagen es obligatoria").not().isEmpty()],
  middleware.validarRol,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
      }
      const producto = await Producto.create(req.body);
      res.json(producto);
    } catch (e) {
      res.json({
        Error: `hubo un error creando el producto: ${e.message}`,
      });
    }
  }
);

//Routes
/**
 * @swagger
 * /productos/{productoId}:
 *  put:
 *     description: Se usa para actualizar el producto con id
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: productoId
 *          required: false
 *          description: Numeric id of the producto
 *        - in: body
 *          name: producto
 *          schema:
 *             $ref: "#/definitions/ProductoParaCrear"
 *          required: false
 *          description: producto
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Producto"
 */
router.put("/:id", middleware.validarRol, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      await Producto.update(req.body, {
        where: { id: req.params.id },
      });
      return res.json({ success: "se ha modificado" });
    }
    res
      .status(404)
      .json({ error: `the given id ${req.params.id} does not exist` });
  } catch (e) {
    res.json({
      Error: `hubo un error actualizando el producto: ${e.message}`,
    });
  }
});

//Routes
/**
 * @swagger
 * /productos/{productoId}:
 *  delete:
 *     description: Se usa para eliminar un producto por su Id
 *     parameters:
 *        - in: header
 *          name: user-token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: productoId
 *          required: true
 *          description: Numeric id of the producto
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type:string
 */
router.delete("/:id", middleware.validarRol, async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      await Producto.destroy({
        where: { id: req.params.id },
      });
      return res.json({ success: "se ha borrado el producto" });
    }
    res
      .status(404)
      .json({ error: `el producto con id ${req.params.id} no existe` });
  } catch (e) {
    res.json({
      Error: `hubo un error eliminando el producto: ${e.message}`,
    });
  }
});

router.get("/:id/pedidos", middleware.validarRol, async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id, {
      include: { all: true },
    });
    res.json(producto);
  } catch (e) {
    res.json({
      Error: `hubo un error obteniendo los pedidos vinculados a ese producto: ${e.message}`,
    });
  }
});
