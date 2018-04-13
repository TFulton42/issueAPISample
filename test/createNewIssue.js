// Issue and File API
// Author: Tom Fulton

// These are the tests for the createNewIssue call.

var	mongoose = require('mongoose'),
	chai = require('chai'),
	assert = chai.assert,
	setupDB = require('./lib/setupDB');

// Mongoose models
var Issues = require('../server/models/issues');

// Tested functions
var	issue = require('../server/api_modules/issues');

describe('createNewIssue Tests', () => {

	// Setup the database
	before(() => {
		return new Promise((resolve, reject) => {
			setupDB.openAndClearDB(resolve, reject);
		});
	});

	// Run the tests
	describe('Test createNewIssue', () => {
		it('should create a valid new issue with issue number 5', async() => {
			var newIssue = {
				title: 'Episodes I, II, and III are terrible',
				description: 'OK, Maybe III is OK, but really? Jar-jar? And Hayden Christensen?',
				reportedBy: 'Everyone'
			};
			var result = await issue.createNewIssue(newIssue);
			var dbResult = await issue.getOneIssue(5);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 200, 'Status not 200');
			assert.isEmpty(result.errString, 'ErrString is not null');
			assert.equal(result.issue, 5, 'New issue is not 5');
			assert.equal(dbResult.issue.id, 5, 'New issue is not 5 in database');
			assert.equal(dbResult.issue.title, newIssue.title, 'Titles not equal in database');
			assert.equal(dbResult.issue.description, newIssue.description, 'Descriptions not equal in database');
			assert.equal(dbResult.issue.reportedBy, newIssue.reportedBy, 'ReportedBys not equal in database');
			assert.isEmpty(dbResult.issue.assignedTo, 'AssignedTos not empty');
			assert.equal(dbResult.issue.status, 'Open', 'Status not \'Open\' in database');
		});

		it('should not create an issue with a null title', async() => {
			var newIssue = {
				description: 'OK, Maybe III is OK, but really? Jar-jar? And Hayden Christensen?',
				reportedBy: 'Everyone'
			};
			var result = await issue.createNewIssue(newIssue);
			var dbResult = await issue.getOneIssue(6);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Missing title', 'ErrString is not \'Missing title\'');
			assert.equal(dbResult.status, 404, 'Issue actually created in DB');
		});

		it('should not create an issue with a null description', async() => {
			var newIssue = {
				title: 'Episodes I, II, and III are terrible',
				reportedBy: 'Everyone'
			};
			var result = await issue.createNewIssue(newIssue);
			var dbResult = await issue.getOneIssue(6);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Missing description', 'ErrString is not \'Missing description\'');
			assert.equal(dbResult.status, 404, 'Issue actually created in DB');
		});

		it('should not create an issue with a null reportedBy', async() => {
			var newIssue = {
				title: 'Episodes I, II, and III are terrible',
				description: 'OK, Maybe III is OK, but really? Jar-jar? And Hayden Christensen?',
			};
			var result = await issue.createNewIssue(newIssue);
			var dbResult = await issue.getOneIssue(6);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Missing reportedBy', 'ErrString is not \'Missing reportedBy\'');
			assert.equal(dbResult.status, 404, 'Issue actually created in DB');
		});

		it('should not create an issue with a null body', async() => {
			var result = await issue.createNewIssue({});
			var dbResult = await issue.getOneIssue(6);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Missing title', 'ErrString is not \'Missing title\'');
			assert.equal(dbResult.status, 404, 'Issue actually created in DB');
		});
	});

	// Clean up the database
	after(() => {
		return new Promise((resolve, reject) => {
			setupDB.closeDB(resolve, reject);
		});
	});
});