'use strict';

module.exports = function(app) {
  var db = require('./database')(app.locals.rootPath);

  app.get('/listTransportTypes', function(req, res) {
    res.json(JSON.stringify(db.listTransportTypes()));
  });

  app.put('/addSurvey', function(req, res) {
    db.insertSurvey(req.body);
    res.end();
  });

  app.get('/listSurveys', function(req, res) {
    // surveys.mapReduce(
    //   (obj) => {
    //     return obj;
    //   }, (array) => {
    //     var result = {};
    //     for (var i in array) {
    //       var elem = array[i];
    //       result[elem] = result[elem] ? result[elem] + 1 : 1;
    //     }
    //   }
    // )

  	// var transports = db.getCollection('transport');
  	// var surveys = db.getCollection('survey');

  	// transports.eqJoin(surveys.data, "name", "userTransport", function(l, r) {

	});
};