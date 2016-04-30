'use strict';

var express = require('express');
var controller = require('./test.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/testweather', controller.testWeather);
router.get('/testforecast', controller.testForecast);

router.get('/testtwiliosend', controller.testTwilioSend);
router.get('/testtwiliorecieve', controller.testTwilioRecieve);


module.exports = router;
