const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://miguel:Azerty44@cluster0-dxc9v.mongodb.net/test?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
    }
  )
    .then((client) => {
      console.log('Mongo Connected !');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
