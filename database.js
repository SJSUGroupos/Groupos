class dbFuncs {

	constructor(email) {
		this.email = email;
	}

	createUserDocument(id, email, db, assert) {

		// Insert a single document
		db.collection('users').insertOne(
			{
				id : 1,
				email : "asdf@asdf.com"

			}, function(err, r) {
				assert.equal(null, err);
				assert.equal(1, r.insertedCount);
			});

	}

}

module.exports = dbFuncs; 
