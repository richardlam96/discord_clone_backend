require('dotenv').config();
const jwt = require('jsonwebtoken');


exports.loginRequired = async function(req, res, next) {
	try {
		const token = req.body.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET_KEY, function(err, payload) {
			if (payload) {
				next();
			} else {
				next({
					status: 401,
					message: 'Please log in first.',
				});
			}
		});
	} catch(err) {
		next({
			status: 401,
			message: 'Please log in first.',
		});
	}
}

exports.ensureCorrectUser = async function(req, res, next) {}
