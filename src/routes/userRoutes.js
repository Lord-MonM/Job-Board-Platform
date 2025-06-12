const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController.js");
const {
  sendVerificationCode,
  verifyVerificationCode,
} = require("../controllers/verificationController.js");
const {
  changePassword,

} = require("../controllers/passwordController.js");

const verifyToken = require("../middlewares/authMiddleware.js");
const authorizeRoles = require("../middlewares/roleMiddleware.js");

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles("admin", "employer", "user"));


router.get("/",authorizeRoles("admin", "employer"),getAllUsers)
router
  .route("/:id")
  .get(authorizeRoles("admin", "employer", "user"), getUser)
  .patch(authorizeRoles("admin", "employer", "user"), updateUser)
  .delete(authorizeRoles("admin", "employer", "user"), deleteUser);

router.patch("/send-verification-code", sendVerificationCode);
router.patch("/verify-verification-code", verifyVerificationCode);

router.patch("/change-password", changePassword);

module.exports = router;
