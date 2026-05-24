const { Router } = require("express");
const { requireJWT, requireAdmin } = require("../middleware/auth");
const alertCtrl = require("../controllers/alertController");

const router = Router();

router.get("/",    requireJWT,             alertCtrl.getAlerts);
router.delete("/", requireJWT, requireAdmin, alertCtrl.deleteAlerts);

module.exports = router;
