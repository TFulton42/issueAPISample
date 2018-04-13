// Issue and File API
// Author: Tom Fulton

// These are the tests for the uploadFile call.

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
describe('uploadFile Tests', () => {

	// Setup the database
	before(() => {
		return new Promise((resolve, reject) => {
			setupDB.openAndClearDB(resolve, reject);
		});
	});

	// Run the tests
	describe('Test uploadFile', () => {
		it('should upload a valid file for issue 3', async() => {
			var fileObj = {size: 100, originalname: 'test.txt', path: 'filestorage\\testfile.txt'},
				bodyObj = {author: 'Test User'};

			var result = await files.uploadFile(3, fileObj, bodyObj);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 200, 'Status not 200');
			assert.equal(result.errString, 'File uploaded successfully', 'errString incorrect');

			// Use the get method and check that there is just one file record
			var issue3 = await issues.getOneIssue(3);
			assert.equal(issue3.issue.files.length, 1, 'incorrect number of file records');
			assert.equal(issue3.issue.files[0].fileNumber, 2, 'incorrect fileNumber');
		});

		it('should fail if an empty file is uploaded', async() => {
			var fileObj = {size: 0, originalname: 'test.txt', path: 'filestorage\\file123'},
				bodyObj = {author: 'Test User'};

			var result = await files.uploadFile(4, fileObj, bodyObj);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Non empty file required', 'errString incorrect');
			// Check to see if the record was actually created. See comment above.
		});

		it('should fail is the author field is empty', async() => {
			var fileObj = {size: 100, originalname: 'test.txt', path: 'filestorage\\file123'},
				bodyObj = {author: ''};

			var result = await files.uploadFile(4, fileObj, bodyObj);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Missing author', 'errString incorrect');
			// Check to see if the record was actually created. See comment above.
		});

		it('should fail if the original name field is empty', async() => {
			var fileObj = {size: 100, originalname: '', path: 'filestorage\\file123'},
				bodyObj = {author: 'Test User'};

			var result = await files.uploadFile(4, fileObj, bodyObj);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Missing file name', 'errString incorrect');
			// Check to see if the record was actually created. See comment above.
		});

		it('should fail if the issue number is invalid', async() => {
			var fileObj = {size: 100, originalname: 'test.txt', path: 'filestorage\\file123'},
				bodyObj = {author: 'Test User'};

			var result = await files.uploadFile('fred', fileObj, bodyObj);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Invalid issue number', 'errString incorrect');
			// Check to see if the record was actually created. See comment above.
		});

		it('should fail if the issue doesn\'t exist', async() => {
			var fileObj = {size: 100, originalname: 'test.txt', path: 'filestorage\\file123'},
				bodyObj = {author: 'Test User'};

			var result = await files.uploadFile(23, fileObj, bodyObj);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 404, 'Status not 400');
			assert.equal(result.errString, 'Issue not found', 'errString incorrect');
			// Check to see if the record was actually created. See comment above.
		});
	});

	// Clean up the database
	after(() => {
		return new Promise((resolve, reject) => {
			setupDB.closeDB(resolve, reject);
		});
	});
});