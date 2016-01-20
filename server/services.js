'use strict';

var _ =require('lodash');

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
    var result = {};

    db.listTransportTypes().forEach(
      (trans) => {
        result[trans.id] = {
          name: trans.name,
          quantity: 0
        }
      }
    );

    db.listSurveys().forEach((survey) => {
      if (result[survey.transportId].quantity) {
        result[survey.transportId].quantity += 1;
      
      } else {
        result[survey.transportId].quantity = 1;
      }
    });

    res.json(JSON.stringify(_.values(result)));
  });
};