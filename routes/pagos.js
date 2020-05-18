const router = require("express").Router();

const Pago = require("../models/Pago");

module.exports = router;

// find all pagos
router.get("/", async (req, res) => {
  const pagos = await Pago.findAll();
  res.json(pagos);
});

// get pago by id
router.get("/:id", async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  res.json(producto);
});

// post a new pago
router.post("/", async (req, res) => {
  const pago = await Pago.create(req.body);
  res.json(pago);
});

// update an existing pago
router.put("/:id", async (req, res) => {
  await Pago.update(req.body, {
    where: { id: req.params.id },
  });
  res.json({ success: "se ha modificado" });
});

//delete a pago By Id
router.delete("/:id", async (req, res) => {
  await Pago.destroy({
    where: { id: req.params.id },
  });
  res.json({ success: "se ha borrado el pago" });
});
