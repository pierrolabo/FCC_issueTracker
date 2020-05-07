const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Issue {
  constructor(issue_title, issue_text, created_by) {
    //REQUIRED
    this.issue_title = issue_title;
    this.issue_text = issue_text;
    this.created_by = created_by;
    //OPTIONAL
    this.assigned_to = '';
    this.status_text = '';
    this.created_on = Date();
    this.updated_on = Date();
    this.open = true;
    this.id = new mongodb.ObjectId();
  }

  save() {
    const db = getDb();
    let dbOp;
    dbOp = db.collection('issues').insertOne(this);

    return dbOp
      .then((result) => {
        console.log('saved data');
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('issues')
      .find()
      .toArray()
      .then((issues) => {
        console.log('FETCHALL => ', issues);
        return issues;
      })
      .catch((err) => {
        console.log('FETCHALL => ', err);
      });
  }
}

module.exports = Issue;
