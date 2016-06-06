'use strict';

var util = require("util")
var bluebird = require("bluebird")
var config = require('../../config/environment')

var weather = require('../../components/weather')
var twilio = require('../../components/twilio')


//-- Weather API Tests
exports.currentWeather = function(req, res) {

	weather.currentWeather('83706', 'us')
		.then(function (response) {

			var body = JSON.parse(response.body)

			res.status(200).json(body)

		})
		.catch(function(error) {

			console.log(error)
			res.status(500).json({error: error})

		})
}
exports.forecast = function(req, res) {

	weather.forecast('83706', 'us')
		.then(function (response) {

			var body = JSON.parse(response.body)

			res.status(200).json(body)

		})
		.catch(function(error) {

			console.log(error)
			res.status(500).json({error: error})

		})
}


//-- Twilio API Tests
exports.testTwilioSend = function(req, res) {

	twilio.sendMessage('+12088712928', 'This is your API test.')
		.then(function (response) {

			res.status(200).json(response)

		})
		.catch(function(error) {

			console.log(error)
			res.status(500).json({error: error})

		})
}
exports.testTwilioRecieve = function(req, res) {

	// accept
	console.log(req.body)

	twilio.recieveAndRespond(req.body)
		.then(function (response) {

			res.status(200).json(response)

		})
		.catch(function(error) {

			console.log(error)
			res.status(500).json({error: error})

		})
}
