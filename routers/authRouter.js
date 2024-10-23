const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const { check } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
	"/registration",
	[
		check("username", "Username cannot be empty").notEmpty(),
		check(
			"password",
			"Password must be more than 4 and less than 10 symbols length",
		).isLength({ min: 4, max: 10 }),
	],
	controller.registration,
);
router.post("/login", controller.login);

router.get("/users", roleMiddleware(["USER"]), controller.getUsers);

module.exports = router;
