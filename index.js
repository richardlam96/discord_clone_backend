require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { errorHandler } = require('./handlers/error');
const authRoutes = require('./routes/auth');


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));


app.use('/api/auth', authRoutes);
app.use(function(req, res, next) {
	let err = new Error('Not found.');
	err.status = 404;
	next(err);
});
app.use(errorHandler);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('Discord Clone started.');
});
