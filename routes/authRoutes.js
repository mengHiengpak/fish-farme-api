const { Router } = require("express");
const rateLimit  = require("express-rate-limit");
const { requireJWT, requireAdmin } = require("../middleware/auth");
const auth = require("../controllers/authController");

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register",        authLimiter, auth.register);
router.post("/login",           authLimiter, auth.login);
router.get("/me",               requireJWT,  auth.me);
router.put("/change-password",  requireJWT, auth.changePassword);
router.post("/forgot-password", authLimiter, auth.forgotPassword);
router.post("/reset-password",  authLimiter, auth.resetPassword);

router.get("/users",     requireJWT, requireAdmin, auth.listUsers);
router.delete("/users/:id", requireJWT, requireAdmin, auth.deleteUser);

module.exports = router;
