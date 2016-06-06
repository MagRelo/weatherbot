
var config = require("../../config/environment")

var twilio = require('twilio')(config.TwilioAPIKey, config.TwilioAPISecret);
var bluebird = require('bluebird')

var Subscriber = require('../../models/subscriber.model')

var Process = require('./process')

var verifiedTwilioNumber = "+12088712928"

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

  var subscriberInfo = {}
  var tokenArray = Process.tokenizeIncomingMessage(requestBody.body)
  var responseMessage = ""

  return Subscriber.findOneAndUpdate({phoneNumber: requestBody.From}, {}, {upsert: true, new: true})
    .then (function (subscriberDoc) {

      subscriberInfo = subscriberDoc
      responseMessage = Process.craftResponseMessage(subscriberInfo, tokenArray)

      return twilio.sendMessage({
          to: verifiedTwilioNumber,
          from: config.TwilioFromNumber,
          body: responseMessage
        }
      )
    })
    .then(function (twilioResponse) {

      return Subscriber.findOneAndUpdate(
        {phoneNumber: requestBody.From},
        {$push: {messages: {
            incomingRequest: {
              requestBody: requestBody,
              tokenArray: tokenArray
            },
            subscriberInfo: subscriberInfo,
            responseMessage: responseMessage,
            twilioSendResponse: twilioResponse
          }}
        },
        {upsert: true, new: true}
      )

    })

}

