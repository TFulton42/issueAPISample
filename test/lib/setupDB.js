var	mongoose = require('mongoose');

var dbURI = 'mongodb://Florence:Florence@ds129144.mlab.com:29144/fulton';

var Issues = require('../../server/models/issues');

function openAndClearDB(resolve, reject) {
	// Open up the DB connection and drop and existing collections
	mongoose.connect(dbURI);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', () => {
		mongoose.connection.db.dropDatabase((err, result) => {
			if (err) {
				reject('Couldn\'t drop database');
			}
			issueArray = createIssueObject();
			Issues.create(issueArray, (err, newRecords) => {
				if (err) {
					reject(`Couldn't add records: ${err}`);
				}
				// Now add the uploaded files
				resolve();
			});
		});
	});
}

function closeDB(resolve, reject) {
	// mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close();
		resolve();
	// });
}

function createIssueObject() {
	var issue1 = new Issues({
			id: 1,
			title: 'Exhaust is a poor design',
			description: 'It\'s open to any crazy attack.',
			reportedBy: 'Darth Vader',
			assignedTo: '',
			dateSubmitted: Date.now(),
			status: 'Open'
		}),
		issue2 = new Issues({
			id: 2,
			title: 'Stormtrooper models defective',
			description: 'They can\'t hit anything with a blaster.',
			reportedBy: 'Grand Moff Tarkin',
			assignedTo: '',
			dateSubmitted: Date.now(),
			status: 'Open'
		}),
		issue3 = new Issues({
			id: 3,
			title: 'X-Wing fighter underwater',
			description: 'It sunk and I don\'t know what to do',
			reportedBy: 'Luke Skywalker',
			assignedTo: 'Yoda',
			dateSubmitted: Date.now(),
			status: 'Open'
		}),
		issue4 = new Issues({
			id: 4,
			title: 'This droid is defective',
			description: 'He just blew his top.',
			reportedBy: 'Owen Lars',
			assignedTo: 'Luke Skywalker',
			dateSubmitted: Date.now(),
			status: 'Open'
		});

	return [issue1, issue2, issue3, issue4];
}

module.exports.openAndClearDB = openAndClearDB;
module.exports.closeDB = closeDB;