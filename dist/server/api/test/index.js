'use strict';

var express = require('express');
var controller = require('./test.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/weather/current', controller.currentWeather);
router.get('/weather/forecast', controller.forecast);

router.post('/twilio/send', controller.testTwilioSend);
router.post('/twilio/recieve', controller.testTwilioRecieve);


module.exports = router;
