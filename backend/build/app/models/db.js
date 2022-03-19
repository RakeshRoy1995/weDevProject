"use strict";
const DB = function () {
};
DB.doRequest = (db, table) => {
    return new Promise(function (resolve, reject) {
        var MongoClient = require("MongoDb").MongoClient;
        const URL = "mongodb+srv://RakeshDemo:SZBoDfYgkcQUyN1G@cluster0.zjpau.mongodb.net?retryWrites=true&w=majority";
        var config = { useUnifiedTopology: true };
        MongoClient.connect(URL, config, function name(error, MyMongoClinet) {
            if (error) {
                reject(error);
            }
            else {
                resolve(MyMongoClinet.db(db).collection(table));
            }
        });
    });
};
module.exports = DB;
