const db = require('../models');
const jwt = require('jsonwebtoken');


exports.register = async function(req, res, next) {
	try {
		let newUser = await db.User.create(req.body);
		let { username, password } = newUser;
		let token = jwt.sign({
			username,
			password,
		}, process.env.SECRET_KEY);
		return res.status(200).json({
			username,
			password,
			token,
		});
	} catch(err) {
		if (err.code === 11000) {
			err.message = 'Sorry, username has been taken.';
		}
		next({
			status: 400,
			message: err.message,
		});
	}
}

exports.signin = async function(req, res, next) {
	try {
		// Try to find user in database by username.
		let user = await db.User.findOne({
			username: req.body.username,
		});
		if (!user) {
			next({
				status: 401,
				message: 'Could not find user with username.'
			});
		}

		// Check given password.
		let isMatch = await user.comparePassword(req.body.password);
		if (isMatch) {
			let { id, username } = user;
			let token = jwt.sign({
				id, 
				username,
			}, process.env.SECRET_KEY);
			return res.status(200).json({
				id,
				username,
				token,
			});
		} else {
			next({
				status: 401,
				message: 'Invalid password.',
			});
		}
	} catch(err) {
		next({
			status: 401,
			message: 'Invalid credentials.',
		});
	}
}
