const router = require("express").Router();

const Producto = require("../models/Producto");
const Usuario = require("../models/Usuario");
const Pedido = require("../models/Pedido");

module.exports = router;

// find all productos
router.get("/", async (req, res) => {
  const usuario = await Usuario.findById(req.usuarioId);
  //console.log(usuario.username);
  const productos = await Producto.findAll();
  res.json(productos);
});

// get producto by id
router.get("/:id", async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  res.json(producto);
});

// post a new producto
router.post("/", async (req, res) => {
  const producto = await Producto.create(req.body);
  res.json(producto);
});

// update an existing producto
router.put("/:id", async (req, res) => {
  await Producto.update(req.body, {
    where: { id: req.params.id },
  });
  res.json({ success: "se ha modificado" });
});

//delete a producto By Id
router.delete("/:id", async (req, res) => {
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
