// This is where jobs are listed and scheduled

var config = require('../config/environment');
var Agenda = require('agenda') // job scheduler: Agenda (https://github.com/rschmukler/agenda)
var agenda = new Agenda({db: { address: config.mongo.uri}});


// require('./updatePostModified')(agenda)


// if(config.runJobs === 'true') {
//   agenda.every(config.updatePostRecords_jobInterval, 'updatePostRecords')
//   agenda.every(config.loadElasticsearch_jobInterval, 'loadElasticsearch',
//     {
//       esIndex: config.loadElasticsearch_esIndex,
//       esType: config.loadElasticsearch_esIndexType,
//       postLimit: config.loadElasticsearch_postLimit
//     }
//   );
//   agenda.every(config.updateSchoolInfo_jobInterval, 'updateSchoolInfo');
// }

console.log('starting agenda')
agenda.start();
