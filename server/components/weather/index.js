var bluebird = require("bluebird")
var request = bluebird.promisify(require('request'))
var config = require('../../config/environment')

exports.currentWeather = function (zipcode, countryCode) {

  return request({
    method: 'GET',
    uri: 'http://api.openweathermap.org/data/2.5/weather?zip='
      + zipcode + ',' + countryCode
      + '&APPID=' + config.openWeatherMapAPIKey
      + '&units=imperial'
  })

}


exports.forecast = function (zipcode, countryCode) {

  return request({
    method: 'GET',
    uri: 'http://api.openweathermap.org/data/2.5/forecast?zip='
      + zipcode + ',' + countryCode
      + '&APPID=' + config.openWeatherMapAPIKey
      + '&units=imperial'
  })

}

