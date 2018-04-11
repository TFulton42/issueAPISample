var	mongoose = require('mongoose');

var dbURI = 'mongodb://Florence:Florence@ds129144.mlab.com:29144/fulton';

var Issues = require('../../server/models/issues'),
	Files = require('../../server/models/files');

function openAndClearDB(resolve, reject) {
	// Open up the DB connection and drop and existing collections
	// A bit of callback hell here. I should probably modularize this.
	mongoose.connect(dbURI);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', () => {
		mongoose.connection.db.dropDatabase((err, result) => {
			if (err) {
				return reject('Couldn\'t drop database');
			}
			issueArray = createIssueObject();
			Issues.create(issueArray, (err, newRecords) => {
				if (err) {
					return reject(`Couldn't add records: ${err}`);
				}
				// Now add the uploaded files
				sampleFile = createFileObject(newRecords[1]._id);
				Files.create(sampleFile, (err, newFile) => {
					if (err) {
						return reject(`Could't add file: ${err}`);
					}
					newRecords[1].files[0] = newFile._id;
					Issues.findOneAndUpdate({id: 2}, newRecords[1], (err) => {
						if (err) {
							return reject(`Could't save revised issue: ${err}`);
						}
						return resolve();
					});
				});
			});
		});
	});
}

function closeDB(resolve, reject) {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close();
		return resolve();
	});
}

function createFileObject(dbId) {
	var file1 = new Files({
		fileNumber: 1,
		originalFileName: 'test42.txt',
		location: 'filestorage\\testfile.txt',
		uploadedBy: 'Yogi Bear',
		dateSubmitted: Date.now(),
		issueBelongedTo: dbId	
	});
	return file1;
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