/* The mongodb code I will need later:*/
    var MongoClient = require('mongodb').MongoClient,
    	assert = require('assert');

    var uri =
    	"mongodb://featuredArtist:music2017\
@reviewcluster-shard-00-00-nyryq.mongodb.net:27017,\
reviewcluster-shard-00-01-nyryq.mongodb.net:27017,\
reviewcluster-shard-00-02-nyryq.mongodb.net:27017/\
dev-server?ssl=true&replicaSet=reviewCluster-shard-0&authSource=admin";
    
    MongoClient.connect(uri, function(err, db) {
		assert.equal(null, err);
		console.log("Connected successfully to server");
		updateDocument(db, function() {
		    findDocuments(db, function() {
		      db.close();
		    });
		});
    });

    var insertDocuments = function(db, callback) {
	  // Get the documents collection
	  var collection = db.collection('uncapped');
	  // Insert some documents
	  collection.insertMany([
	    {a : 1}, {a : 2}, {a : 3}
	  ], function(err, result) {
	    console.log("Inserted 3 documents into the collection");
	    callback(result);
	  });
	}

	var findDocuments = function(db, callback) {
	  // Get the documents collection
	  var collection = db.collection('uncapped');
	  // Find some documents
	  collection.find({}).toArray(function(err, docs) {
	    assert.equal(err, null);
	    console.log("Found the following records");
	    console.log(docs)
	    callback(docs);
	  });
	}

	var createCapped = function(db, callback) {
	  db.createCollection("documents", { "capped": true, "size": 100000, "max": 5000},
	    function(err, results) {
	      console.log("Collection called 'documents' created.");
	      callback();
	    }
	  );
	};

	var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('uncapped');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}