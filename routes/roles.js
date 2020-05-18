const router = require("express").Router();

const Rol = require("../models/Rol");

module.exports = router;

// find all pagos
router.get("/", async (req, res) => {
  const roles = await Rol.findAll();
  res.json(roles);
});

// get pago by id
router.get("/:id", async (req, res) => {
  const rol = await Rol.findById(req.params.id);
  res.json(rol);
});

// post a new pago
router.post("/", async (req, res) => {
  const rol = await Rol.create(req.body);
  res.json(rol);
});

// update an existing pago
router.put("/:id", async (req, res) => {
  await Rol.update(req.body, {
    where: { id: req.params.id },
  });
  res.json({ success: "se ha modificado" });
});

//delete a pago By Id
router.delete("/:id", async (req, res) => {
  await Rol.destroy({
    where: { id: req.params.id },
  });
  res.json({ success: "se ha borrado el pago" });
});
