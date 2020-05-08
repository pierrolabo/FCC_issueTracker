/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('POST /api/issues/{project} => object with issue data', function () {
    test('Every field filled in', function (done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA',
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, 'Title');
          assert.equal(res.body[0].issue_text, 'text');
          assert.equal(
            res.body[0].created_by,
            'Functional Test - Every field filled in'
          );
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          assert.equal(res.body[0].status_text, 'In QA');

          //fill me in too!

          done();
        });
    });

    test('Required fields filled in', function (done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'title',
          issue_text: 'text',
          created_by: 'Functional Test - Required field filled in',
        })
        .end(function (err, res) {
          //if (err) console.log('chai:', err);
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, 'title');
          assert.equal(res.body[0].issue_text, 'text');
          assert.equal(
            res.body[0].created_by,
            'Functional Test - Required field filled in'
          );
          done();
        });
    });

    test('Missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
        })
        .end(function (err, res) {
          //console.log(res.body);
          //if (err) console.log('chai:', err);
          assert.equal(res.body.error, 'Required fields empty');
          done();
        });
    });
  });

  suite('PUT /api/issues/test => text', function () {
    test('No body', function (done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: '',
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: '',
        })
        .end(function (end, res) {
          assert.equal(res.body, 'no updated field sent');

          done();
        });
    });

    test('One field to update', function (done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: '5eb56c97e0910f4b4d926acf',
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: '',
          open: false,
        })
        .end(function (end, res) {
          assert.equal(res.body, 'successfully updated');

          done();
        });
    });

    test('Multiple fields to update', function (done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: '5eb56c97e0910f4b4d926acf',
          issue_title: 'Multiple field update - title',
          issue_text: 'Multiple field update - text',
          created_by: 'Multiple field update - created_by',
          assigned_to: 'Multiple field update - assigned_to',
          status_text: 'Multiple field update - status_text',
          open: false,
        })
        .end(function (end, res) {
          assert.equal(res.body, 'successfully updated');

          done();
        });
    });
  });

  suite(
    'GET /api/issues/{project} => Array of objects with issue data',
    function () {
      test('No filter', function (done) {
        chai
          .request(server)
          .get('/api/issues/test')
          .query({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            done();
          });
      });

      test('One filter', function (done) {});

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {});
    }
  );

  suite('DELETE /api/issues/{project} => text', function () {
    test('No _id', function (done) {});

    test('Valid _id', function (done) {});
  });
});
