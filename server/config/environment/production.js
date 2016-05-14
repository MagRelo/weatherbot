'use strict';

// Staging specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.IP ||
            undefined,

  // Server port
  port:     process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGODB_ADDRESS_INT + '/production'|| 'mongodb://localhost/weatherBot'},

  seedDB: process.env.SEEDDB
};
