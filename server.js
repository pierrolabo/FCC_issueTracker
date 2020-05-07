'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var expect = require('chai').expect;
var cors = require('cors');
var helmet = require('helmet');
var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');
const mongoConnect = require('./util/database').mongoConnect;
var app = express();
//Security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'glitch.com', 'hyperdev.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'code.jquery.com'],
      },
    },
  })
);
app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //For FCC testing purposes only

app.use(
  bodyParser.json({
    type: ['json', 'application/csp-report'],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route('/:project/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/issue.html');
});

//Index page (static HTML)
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type('text').send('Not Found');
});
//Content security violation
app.route('/report-violation', (req, res) => {
  if (req.body) {
    console.log('CSP VIOLATION: ', req.body);
  } else {
    console.log('CSP VIOLATION: NO DATA');
  }
  res.status(204).end();
});
//Start our server and tests!
mongoConnect(() => {
  app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + process.env.PORT);
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          var error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 3500);
    }
  });
});

module.exports = app; //for testing
