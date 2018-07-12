require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log('Discord Clone started.');
});
