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
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
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
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;
      //console.log('POST => ', req.body);
      const issue = new Issue(
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      );
      if (issue_title === '' || issue_text === '' || created_by === '') {
        res.status(400).json({ error: 'Required fields empty' });
        return;
      }
      issue
        .save()
        .then((result) => {
          res.json([result.ops[0]]);
        })
        .catch((err) => console.log(err));
    })

    .put(function (req, res) {
      var project = req.params.project;
      //console.log('put => ', req.body);
      if (
        req.body.issue_title === '' &&
        req.body.issue_text === '' &&
        req.body.created_by === '' &&
        req.body.assigned_to === '' &&
        req.body.status_text === '' &&
        typeof req.body.open === 'undefined'
      ) {
        res.json('no updated field sent');
      } else {
        Issue.findById(req.body._id)
          .then((result) => {
            return result;
          })
          .then((issue) => {
            const issue_title =
              req.body.issue_title === ''
                ? issue.issue_title
                : req.body.issue_title;
            const issue_text =
              req.body.issue_text === ''
                ? issue.issue_text
                : req.body.issue_text;
            const created_by =
              req.body.created_by === ''
                ? issue.created_by
                : req.body.created_by;
            const assigned_to =
              req.body.assigned_to === ''
                ? issue.assigned_to
                : req.body.assigned_to;
            const status_text =
              req.body.status_text === ''
                ? issue.status_text
                : req.body.status_text;
            const _id = req.body._id;
            const updated_on = new Date();
            const open = typeof req.body.open === 'undefined' ? false : true;
            const updtIssue = new Issue(
              issue_title,
              issue_text,
              created_by,
              assigned_to,
              status_text,
              new ObjectId(_id),
              updated_on,
              open
            );
            updtIssue
              .save()
              .then((result) => {
                res.json('successfully updated');
              })
              .catch((err) => console.log(err));
          });
      }
    })

    .delete(function (req, res) {
      var project = req.params.project;
    });
};
