const User = require("../models/Users");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");

const generateAcesstoken = (id, roles) => {
	const payload = {
		id,
		roles,
	};
	return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res
					.status(400)
					.json({ message: "Error during registration", errors });
			}
			const { username, password } = req.body;
			const candidate = await User.findOne({ username });
			if (candidate) {
				return res
					.status(400)
					.json({ message: "User with that name already exists" });
			}
			const hashPassword = bcrypt.hashSync(password, 7);
			const userRole = await Role.findOne({ value: "USER" });
			const user = new User({
				username,
				password: hashPassword,
				roles: [userRole.value],
			});
			await user.save();
			return res.json({ message: "User was successfully registered " });
		} catch (error) {
			console.log(error);
			res.status(400).json({ message: "Registration error" });
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body;
			const user = await User.findOne({ username });
			if (!user) {
				return res
					.status(400)
					.json({ message: `User ${username} was not found` });
			}
			const validPassword = bcrypt.compareSync(password, user.password);
			if (!validPassword) {
				return res.status(400).json({ message: "Wrong password" });
			}
			const token = generateAcesstoken(user._id, user.roles);
			return res.json({ token });
		} catch (error) {
			console.log(error);
			res.status(400).json({ message: "Login error" });
		}
	}

	async getUsers(reg, res) {
		try {
			const users = await User.find();
			res.json(users);
		} catch (error) {
			console.log(error);
		}
	}
}
module.exports = new authController();
