const express = require("express");
const router = express.Router();
const controller = require("../controller/project-controller");
const auth = require("../middleware/auth")

router.post("/projects", auth, controller.createProject);
router.get("/projects", auth, controller.getProjects);

module.exports = router;