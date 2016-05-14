
var config = require("../../config/environment")

var twilio = require('twilio')(config.TwilioAPIKey, config.TwilioAPISecret);
var bluebird = require('bluebird')

var Subscriber = require('../../models/subscriber.model')

var Process = require('./process')

//Send an SMS text message
exports.sendMessage = function (phoneNumber, messageString) {

  return twilio.sendMessage({
    to: phoneNumber,
    from: config.TwilioFromNumber,
    body: messageString
  })

}


//Receive an SMS text message
exports.recieveAndRespond = function (requestBody) {

  var responseMessage

  // update existing subscriber or create a new one
  Process.updateUserSettings(requestBody)
    .then(function(subscriberDoc) {

      // process
      responseMessage = Process.craftResponseMessage(subscriberDoc.isNew, subscriberDoc.settings, requestBody)

      // update user record with response
      return twilio.sendMessage({
        to: requestBody.From,
        from: config.TwilioFromNumber,
        body: responseMessage
      })

    })
    .then(function (twilioResponse) {

      return Subscriber.findOneAndUpdate(
        {phoneNumber: requestBody.From},
        {$push: {messages: {
            requestBody: requestBody,
            responseMessage: responseMessage,
            responseBody: twilioResponse
          }}
        },
        {upsert: true, new: true}
      )

    })

}

