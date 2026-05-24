const { Router } = require("express");
const { requireJWT, requireApiKey } = require("../middleware/auth");
const water = require("../controllers/waterDataController");

const router = Router();

router.post("/",        requireApiKey, water.ingestData);
router.get("/",         requireJWT,    water.getLatestAll);
router.get("/:device_id", requireJWT,  water.getLatestByDevice);

module.exports = router;
