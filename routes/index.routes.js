const { Router } = require("express");

const router = Router();

const clientRouter = require("./client.routes")
const adminRouter = require("./admin.routes")
const queueRouter = require("./queue.routes")
const serviceRouter = require("./service.routes")
const specServiceRouter = require("./spec_service.routes");
const specWorkingDayRouter = require("./spec_working_day.routes")
const specialistsRouter = require("./specialists.routes");

router.use("/client", clientRouter)
router.use("/admin", adminRouter);
router.use("/queue", queueRouter);
router.use("/service", serviceRouter);
router.use("/spec-service", specServiceRouter);
router.use("/spec-working-day", specWorkingDayRouter);
router.use("/specialists", specialistsRouter);

module.exports = router;
