'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || process.env.ENVIRONMENT || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
  }
);


// Begin job scheduler
// require('./jobs');

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);

// Routes
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;


// To Do
// Start app
// start agenda

// - every day at 8:40 AM (agenda)
// -- get phone numbers: for each:
// --- get yesterdays weather
// --- get todays weather
// --- calc deltas
// --- create message
// --- send message



