const express = require("express");
const router = express.Router();
const registrationsController = require("../controllers/registerationController");

router.get("/:eventId", registrationsController.getRegistrations);
router.post("/", registrationsController.createRegistration);
router.put("/:id", registrationsController.updateRegistration);
router.delete("/:id", registrationsController.deleteRegistration);

module.exports = router;
