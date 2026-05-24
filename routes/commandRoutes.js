const { Router } = require("express");
const { requireJWT, requireApiKey } = require("../middleware/auth");
const cmd = require("../controllers/commandController");

const router = Router();

router.post("/:device_id", requireJWT,    cmd.sendCommand);
router.get("/:device_id",  requireApiKey, cmd.pollCommand);

module.exports = router;
