var	mongoose = require('mongoose'),
	chai = require('chai'),
	assert = chai.assert,
	setupDB = require('./lib/setupDB');

// Mongoose models
var Files = require('../server/models/files');

// Tested functions
var	issues = require('../server/api_modules/issues'),
	files = require('../server/api_modules/files');

// This test only tests the interactions with the server and the database.
// It does NOT check the actual uploaded file or to see if it was deleted
// if there was an error. I would expect to test for all of that in a production
// environment.
describe('downloadFile Tests', () => {

	// Setup the database
	before(() => {
		return new Promise((resolve, reject) => {
			setupDB.openAndClearDB(resolve, reject);
		});
	});

	// Run the tests
	describe('Test downloadFile', () => {
		it('should download the test file for issue 3', async() => {
			var result = await files.downloadFile(2, 1);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 200, 'Status not 200');
			assert.isEmpty(result.errString, 'errString not empty');
		});

	});

	// Clean up the database
	after(() => {
		return new Promise((resolve, reject) => {
			setupDB.closeDB(resolve, reject);
		});
	});
});