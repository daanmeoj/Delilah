const router = require("express").Router();
const Producto = require("../models/Producto");
const middleware = require("../middleware/validarRol");
const { check, validationResult } = require("express-validator");

module.exports = router;

// find all productos
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

// get producto by id
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

// post a new producto
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

// update an existing producto
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

//delete a producto By Id
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
