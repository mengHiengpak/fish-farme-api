const { Router } = require("express");
const status = require("../controllers/statusController");

const router = Router();

router.get("/", status.getStatus);

module.exports = router;
