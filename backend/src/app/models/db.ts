const DB   = function() {
};


DB.doRequest = (db: any, table: any) => {
  return new Promise(function (resolve: any, reject: any) {
    var MongoClient = require("MongoDb").MongoClient;

    const URL = "mongodb+srv://RakeshDemo:SZBoDfYgkcQUyN1G@cluster0.zjpau.mongodb.net?retryWrites=true&w=majority";
    var config = { useUnifiedTopology: true } ;
    MongoClient.connect(URL , config ,function name(error: any ,MyMongoClinet: any) {
        if (error) {
            reject(error)
        } else {
          resolve(MyMongoClinet.db(db).collection(table))
        }
    })

  });
};

export = DB