const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Issue {
  constructor(
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
    id,
    updated_on,
    open
  ) {
    //REQUIRED
    this.issue_title = issue_title;
    this.issue_text = issue_text;
    this.created_by = created_by;
    //OPTIONAL
    this.assigned_to = assigned_to !== '' ? assigned_to : '';
    this.status_text = status_text !== '' ? status_text : '';
    this.created_on = new Date();
    this.updated_on = updated_on !== '' ? updated_on : new Date();
    this.open = open ? true : false;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    //ID is not set so its an insertion
    if (this._id) {
      //its an update
      dbOp = db
        .collection('issues')
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection('issues').insertOne(this);
    }

    return dbOp
      .then((result) => {
        //console.log('saved data: ', result.ops[0]);
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
        //console.log('FETCHALL => ', issues);
        return issues;
      })
      .catch((err) => {
        console.log('FETCHALL => ', err);
      });
  }
  static findById(issueId) {
    const db = getDb();
    return db
      .collection('issues')
      .find({ _id: new mongodb.ObjectId(issueId) })
      .next()
      .then((issue) => {
        return issue;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Issue;
