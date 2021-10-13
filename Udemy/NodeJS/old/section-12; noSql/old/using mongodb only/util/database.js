// importing mongoDb
// npm install --save mongodb
const mongoDb = require('mongodb');
// accessing mongo client constructor
const MongoClient = mongoDb.MongoClient;

let _db;

// using the client to connect the app to the mongoDb database
const mongoConnect = (callback) =>{
  MongoClient.connect('mongodb+srv://vie:pass123@cluster0.kbsee.mongodb.net/shop?retryWrites=true&w=majority')
  .then(result=>{
    console.log('connected!')
    // storing the connection to the database
    _db = result.db()
    callback();
  })
  .catch(err=>{
    console.log(err)
    throw err;
  })
}

const getDb = () =>{
  if(_db){
    // if db is set
    // we returning the connection to the database
    return _db;
  }
  throw 'no database found!';
}
 


exports.mongoConnect = mongoConnect;
exports.getDb = getDb