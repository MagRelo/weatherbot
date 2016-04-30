/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../models/user.model');
var config = require('./environment');

var userEmail = config.adminUser;
var userPass = config.adminPass;

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: userEmail,
    password: userPass
  }, function() {
      console.log('finished populating users');
    }
  );
});
