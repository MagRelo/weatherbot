var _ = require('lodash')
var moment = require('moment')

var natural = require('natural')
wordTokenizer = new natural.WordTokenizer();

var Subscriber = require('../../models/subscriber.model')

var weather = require('../weather')

exports.tokenizeIncomingMessage = function(messageBody) {
  // tokenize the message
  return wordTokenizer.tokenize(messageBody)
}

exports.craftResponseMessage = function (subscriber, tokenArray) {

  var responseMessage

  return weather.currentWeather(subscriber.settings.fromZip, subscriber.settings.fromCountry)
    .then(function (weatherResponse) {
      return weatherResponse
    })

  // return responseMessage
}


exports.updateUserSettings = function(requestBody){

  var newSettings = {}

  // check each word token for a valid setting value and set it
  var tokenArray = wordTokenizer.tokenize(requestBody.Body)
  tokenArray.forEach(function (token) {
    if (zipcodeTest(token)){
      newSettings.zipCode = token;
    } else if (metricUnitTest(token) || imperialUnitTest(token)){
      newSettings.units = normalizeUnits(token) || newSettings.units;
    } else if (reminderTimeTest(token)){
      newSettings.reminderTime = token;
    }
  })

  // update subscriber
  return Subscriber.findOneAndUpdate(
    {phoneNumber: requestBody.From},
    {$set: {settings: newSettings}},
    {upsert: true, new: true}
  )

}

function zipcodeTest(token) {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(token);
}

function metricUnitTest(token) {
  return /(C)|(Celsius)|(metric)/.test(token);
}

function imperialUnitTest(token) {
  return /(F)|(Fahrenheit)|(imperial)/.test(token);
}

function reminderTimeTest(token) {

  var validTimeFormats = ["LT","h:mm:ss A","HH:mm:ss","HH:mm"];

  return moment("2014-12-13 12:34 PM", validTimeFormats, true).isValid()
}

function normalizeUnits(token) {

  if (imperialUnitTest(token)){
    return 'imperial'
  } else if(metricUnitTest(token)){
    return 'metric'
  }

  // default
  return null
}


