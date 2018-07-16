require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { errorHandler } = require('./handlers/error');
const { loginRequired } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const serverRoutes = require('./routes/server');


app.use(cors());
app.use(bodyParser.json());

// Routes.
app.use('/api/auth', authRoutes);
app.use('/api/servers', loginRequired, serverRoutes);

// Default error and error handler.
app.use(function(req, res, next) {
	let err = new Error('Not found.');
	err.status = 404;
	next(err);
});
app.use(errorHandler);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Discord Clone started.');
});
