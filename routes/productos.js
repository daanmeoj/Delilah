const router = require("express").Router();
const Producto = require("../models/Producto");
const middleware = require("../middleware/validarRol");

module.exports = router;

// find all productos
router.get("/", async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

// get producto by id
router.get("/:id", async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  res.json(producto);
});

// post a new producto
router.post("/", middleware.validarRol, async (req, res) => {
  const producto = await Producto.create(req.body);
  res.json(producto);
});

// update an existing producto
router.put("/:id", middleware.validarRol, async (req, res) => {
  await Producto.update(req.body, {
    where: { id: req.params.id },
  });
  res.json({ success: "se ha modificado" });
});

//delete a producto By Id
router.delete("/:id", middleware.validarRol, async (req, res) => {
  await Producto.destroy({
    where: { id: req.params.id },
  });
  res.json({ success: "se ha borrado el producto" });
});

router.get("/:id/pedidos", async (req, res, next) => {
  const producto = await Producto.findById(req.params.id, {
    include: { all: true },
  });
  res.json(producto);
});
