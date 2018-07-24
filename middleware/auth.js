require('dotenv').config();
const jwt = require('jsonwebtoken');


exports.loginRequired = async function(req, res, next) {
	try {
    if (!req.headers.authorization) {
      throw new Error('No Authorization Header.');
    }
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET_KEY, function(err, payload) {
			if (payload) {
				next();
			} else {
				next({
					status: 401,
					message: 'Please log in first.',
          token,
				});
			}
		});
	} catch(err) {
		next({
      err,
			status: 401,
			message: err.message,
		});
	}
}

exports.ensureCorrectUser = async function(req, res, next) {
	try { 
		if (!req.headers.authorization) {
			throw new Error('No auth headers given.');
		}
		const token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
			if (payload) {
        console.log('req.params', req);
        console.log('payload', payload);
				// Check that User's id is matching the one in requested route.
				if (payload.id === req.params.userId) {
					// Can also check database if the database has the matching owner.
					next();
				} else {
          console.log(payload);
					next({
						status: 403,
						// message: 'You do not have permissions to do that.',
						message: `params id: ${req.params.userId}, payload id: ${payload.id}`,
					});
				}
			} else {
				next({
					status: 401,
					message: 'Please log in first',
				});
			}
		});
	} catch(error) {
		next({
			status: error.status,
			message: error.message,
		});
	}
}

