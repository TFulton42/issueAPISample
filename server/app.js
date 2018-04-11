// Florence Healthcare Coding Challenge
// Issue and File API
// Author: Tom Fulton

// This is the main entry point for the server. This basically has just setup
// and configuration. No business logic is contained in this module.

var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

var app = express();

// Configuration for the server
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Configuration and connection for the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://Florence:Florence@ds129144.mlab.com:29144/fulton');

// The API routes - It may not be necessary to break this into 2 files for this small API.
// But for something bigger, I would like the modularity.
var issueApiRoutes = require('./routes/issueapi');
app.use('/api/v1', issueApiRoutes);

// Handle any unknown routes
app.get('*', function (req, res) {
	console.log('Unknown route');
	res.status(404).send('Florence Coding Challenge - Page not found');
});

app.listen(3000, function() {
	console.log('Express server started');
});