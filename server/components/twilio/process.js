var _ = require('lodash')
var moment = require('moment')

var natural = require('natural')
wordTokenizer = new natural.WordTokenizer();

var Subscriber = require('../../models/subscriber.model')

exports.tokenizeIncomingMessage = function(messageBody) {
  // tokenize the message
  return wordTokenizer.tokenize(messageBody)
}

exports.craftResponseMessage = function (subsciber, tokenArray) {

  var responseMessage = 'Word count:' + tokenArray.length

  // get array of {keyword, keywordTest, action}
  // var responseConditionArray = [
  //   {keyword: 'newUser', test: isNewUser , action: 'Hey, pal! Looks like you\'re new here. '},
  //   {keyword: 'yes', test: /(yes)/ , action: 'You responded Yes. '},
  //   {keyword: 'blue', test: /(blue)/ , action: 'You mentioned Blue. '}
  // ]

  // responseConditionArray.forEach(function(responseCondition) {
  //   tokenArray.forEach(function(token) {

  //     if(responseCondition.test.test(token)){
  //       responseMessage += responseCondition.action
  //     }
  //   })
  // })

  return responseMessage
}


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


