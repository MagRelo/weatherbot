
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

  // { ToCountry: 'US',
 //  ToState: 'ID',
 //  SmsMessageSid: 'SMd5fba5dd0f162e126ab9de3dd7180496',
 //  NumMedia: '0',
 //  ToCity: 'CALDWELL',
 -- //  FromZip: '83642',
 //  SmsSid: 'SMd5fba5dd0f162e126ab9de3dd7180496',
 -- //  FromState: 'ID',
 //  SmsStatus: 'received',
 -- //  FromCity: 'MERIDIAN',
 //  Body: 'hey weatherbot! you are my best friend',
 -- //  FromCountry: 'US',
 //  To: '+12087798247',
 //  MessagingServiceSid: 'MG2c779cdd68373c6f215d44e230066c5d',
 //  ToZip: '83607',
 //  NumSegments: '1',
 //  MessageSid: 'SMd5fba5dd0f162e126ab9de3dd7180496',
 //  AccountSid: 'ACa0eb8c6da59946c3709ff39c368aca3f',
 -- //  From: '+12088712928',
 //  ApiVersion: '2010-04-01' }

  var subscriberInfo = {}
  var tokenArray = Process.tokenizeIncomingMessage(requestBody.Body)
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

