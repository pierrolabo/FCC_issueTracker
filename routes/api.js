/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
const Issue = require('../models/issue');

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;
      console.log('GET => ', project);
      Issue.fetchAll()
        .then((issues) => {
          res.json(issues);
        })
        .catch((err) => console.log(err));
    })

    .post(function (req, res) {
      var project = req.params.project;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      console.log('POST => ');
      const issue = new Issue(issue_title, issue_text, created_by);
      issue
        .save()
        .then((result) => {
          console.log('POST => 200 ');

          res.json({ result });
        })
        .catch((err) => console.log(err));
    })

    .put(function (req, res) {
      var project = req.params.project;
    })

    .delete(function (req, res) {
      var project = req.params.project;
    });
};
