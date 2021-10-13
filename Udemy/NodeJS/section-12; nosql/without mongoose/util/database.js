const mongoDb = require("mongodb"); // accessing mongodb package
const MongoClient = mongoDb.MongoClient; // mongo client constructor

let _db;

// connecting to the database
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://vieri:pass123.@cluster0.6o5cb.mongodb.net/shop?retryWrites=true&w=majority"
  )
  /* 
    ? when we use mongoDb in our application, we don't need to create/define the databases ahead of time to be able to connect to it
    ? mongoDb will see if in our cluster the databases is already exist/not,
    ! if the database does exist, then it will connect the app to that database
    ! if the database doesn't exist, then it will create it first then connect the app to it
  */
    .then((client) => {
      console.log("connected!");
      _db = client.db(); // storing the connection access to the database
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// returning access to the database
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
