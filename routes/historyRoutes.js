const { Router } = require("express");
const { requireJWT } = require("../middleware/auth");
const water = require("../controllers/waterDataController");

const router = Router();

router.get("/", requireJWT, water.getHistory);

module.exports = router;
