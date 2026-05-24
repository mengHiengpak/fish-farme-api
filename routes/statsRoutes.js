const { Router } = require("express");
const { requireJWT } = require("../middleware/auth");
const stats = require("../controllers/statsController");

const router = Router();

router.get("/:device_id", requireJWT, stats.getStats);

module.exports = router;
