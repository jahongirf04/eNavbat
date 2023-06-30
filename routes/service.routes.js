const { Router } = require("express");
const {
  add,
  get,
  getOne,
  update,
  deleteOne,
} = require("../controllers/service.controller");

const router = Router();

router.post("/add", add);

router.get("/get", get);

router.get("/getOne/:id", getOne);

router.put("/update/:id", update);

router.delete("/delete/:id", deleteOne);

module.exports = router;
