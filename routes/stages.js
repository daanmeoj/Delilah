const router = require("express").Router();

const Stage = require("../models/Stage");

module.exports = router;

// find all stages
router.get("/", async (req, res) => {
  const stages = await Stage.findAll();
  res.send(stages);
});

// get stage by id
router.get("/:id", async (req, res) => {
  const stage = await Stage.findById(req.params.id);
  res.json(stage);
});

// post a new stage
router.post("/", async (req, res) => {
  const stage = await Stage.create(req.body);
  res.json(stage);
});

// update an existing stage
router.put("/:id", async (req, res) => {
  await Stage.update(req.body, {
    where: { id: req.params.id },
  });
  res.json({ success: "se ha modificado" });
});

//delete a stage By Id
router.delete("/:id", async (req, res) => {
  await Stage.destroy({
    where: { id: req.params.id },
  });
  res.json({ success: "se ha borrado el pago" });
});
