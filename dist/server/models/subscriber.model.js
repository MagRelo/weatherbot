'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var crypto = require('crypto');

var SubscriberSchema = new Schema({
  phoneNumber: String,
  messages: Object,
  settings: Object
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
