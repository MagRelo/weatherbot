
var config = require("../../config/environment")
var twilio = require('twilio')(config.TwilioAPIKey, config.TwilioAPISecret);

//Send an SMS text message
exports.sendMessage = function (phoneNumber, messageString) {

  return twilio.sendMessage({
    to: phoneNumber,
    from: config.TwilioFromNumber,
    body: messageString
  })

}


//Receive an SMS text message
exports.recieveMessage = function (requestBody) {

  //

}

