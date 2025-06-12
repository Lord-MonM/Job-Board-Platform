const express = require("express");
const authorizeRoles = require("../middlewares/roleMiddleware.js");
const verifyToken =  require("../middlewares/authMiddleware.js");
const router = express.Router();
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController.js");

router.use(verifyToken);

router.route("/")
  .post(authorizeRoles("employer", "admin"),createJob)
  .get(authorizeRoles("admin", "employer", "user"),getAllJobs);
router
  .route("/:id")
  .delete(authorizeRoles("admin", "employer"), deleteJob)
  .patch(authorizeRoles("admin", "employer"), updateJob)
  .get(authorizeRoles("admin", "employer","user"),getJob);

module.exports = router;