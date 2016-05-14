// var config = require("../../config/environment")
// var twilio = require('twilio')(config.TwilioAPIKey, config.TwilioAPISecret);

var _ = require('lodash')
var moment = require('moment')

var natural = require('natural')
wordTokenizer = new natural.WordTokenizer();

exports.updateUserSettings = function(requestBody){

  var newSettings = {}

  // check each word token for a valid setting value and set it
  var tokenArray = wordTokenizer.tokenize(requestBody.body)
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

exports.craftResponseMessage = function (isNewUser, subscriberSettings, messageBody) {

  var responseMessage = ''

  // get array of {keyword, keywordTest, action}
  var responseConditionArray = [
    {keyword: 'newUser', test: isNewUser , action: 'Hey, pal! Looks like you\'re new here. '},
    {keyword: 'yes', test: /(yes)/.test(token) , action: 'You responded Yes. '},
    {keyword: 'blue', test: /(blue)/.test(token) , action: 'You mentioned Blue. '}
  ]

  responseConditionArray.forEach(function(responseCondition) {

    // loop through each token. if it passes the test, add the message
    var tokenArray = wordTokenizer.tokenize(requestBody.body)
    tokenArray.forEach(function(token) {

      if(responseCondition.test){
        responseMessage += responseCondition.action
      }
    })
  })

  return responseMessage
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


