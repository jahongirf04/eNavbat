const { Router } = require("express");
const {
  get,
  getOne,
  update,
  deleteOne,
  newOtp,
  verifyOTP,
} = require("../controllers/otp.controller");

const router = Router();

router.post("/newotp", newOtp);

router.post("/verify-otp", verifyOTP)

router.get("/get", get);

router.get("/getOne/:id", getOne);

router.put("/update/:id", update);

router.delete("/delete/:id", deleteOne);

module.exports = router;
