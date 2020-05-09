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
      Issue.fetchAll()
        .then((issues) => {
          //if params
          let params = { ...req.query };
          if (params.open !== 'undefined') {
            //cast string into boolean
            params.open = params.open === 'true' ? true : false;
          }
          let filtered = [...issues];
          for (let key in params) {
            filtered = filtered.filter((obj) => {
              return obj[key] === params[key];
            });
          }
          res.json(filtered);
        })
        .catch((err) => console.log(err));
    })

    .post(function (req, res) {
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;

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
      if (
        //if there's no new params
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
            //If the req param is empty then me keep the issue params
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
            const open = typeof req.body.open === 'undefined' ? false : true;
            const updtIssue = new Issue(
              issue_title,
              issue_text,
              created_by,
              assigned_to,
              status_text,
              new ObjectId(_id),
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
      const id = req.body._id;
      if (id) {
        Issue.deleteById(id).then((result) => {
          if (result.deletedCount > 0) {
            res.json(`deleted ${id}`);
          } else {
            res.json(`Id not found`);
          }
        });
      } else {
        res.json('_id error');
      }
    });
};
