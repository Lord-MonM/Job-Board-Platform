const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/authController.js");

const {
  sendforgotPasswordCode,
  verifyforgotPasswordCode,
} = require("../controllers/passwordController.js");

const verifyToken =  require("../middlewares/authMiddleware.js");

const router  = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",verifyToken, logout);


router.patch("/forgot-password", sendforgotPasswordCode);
router.patch("/verify-forgot-password", verifyforgotPasswordCode);

module.exports = router; 
