const express = require("express");
const multer = require("multer");
const {
  getEmployerApplications,
  getMyApplications,
  getApplication,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");
const verifyToken = require("../middlewares/authMiddleware.js");
const authorizeRoles = require("../middlewares/roleMiddleware");


const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.use(verifyToken);
router.get(
  "/",

  authorizeRoles("employer", "admin"),
  getEmployerApplications
);
router.get("/my", verifyToken, authorizeRoles("user"), getMyApplications);

router.route("/:id")
 .get(authorizeRoles("employer", "admin"),getApplication)
  .post(authorizeRoles("user"), createApplication)
  .delete( authorizeRoles("user"), deleteApplication);
  router.patch(
    "/:id/status",
    verifyToken,
    authorizeRoles("employer", "admin"),
    updateApplicationStatus
  );


module.exports = router;