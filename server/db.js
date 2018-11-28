var MongoClient = require("mongodb").MongoClient;

const makeConnection = () => {
  MongoClient.connect(
    "mongodb://localhost:27017/science_direct",
    function(err, client) {
      return new Promise((resolve, reject) => {
        if (err) reject(err);
        else resolve(client);
      });
    }
  );
};

module.exports = makeConnection;
