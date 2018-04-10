var	mongoose = require('mongoose'),
	chai = require('chai'),
	assert = chai.assert,
	setupDB = require('./lib/setupDB');

// Mongoose models
var Issues = require('../server/models/issues');

// Tested functions
var	issue = require("../server/api_modules/issues");

describe('getSingleIssue Tests', () => {

	before(() => {
		return new Promise((resolve, reject) => {
			setupDB.openAndClearDB(resolve, reject);
		});
	});

	describe('Test getSingleIssue', () => {
		it('should return issue 3', async() => {
			var issue3 = new Issues({
				id: 3,
				title: 'X-Wing fighter underwater',
				description: 'It sunk and I don\'t know what to do',
				reportedBy: 'Luke Skywalker',
				assignedTo: 'Yoda',
				dateSubmitted: Date.now(),
			});
			const result = await issue.getOneIssue(3);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 200, 'Status not 200');
			assert.isEmpty(result.errString, 'ErrString is not null');
			assert.isObject(result.issue, 'Issue is not an object');
			assert.equal(result.issue.id, issue3.id, 'Ids not equal');
			assert.equal(result.issue.title, issue3.title, 'Titles not equal');
			assert.equal(result.issue.description, issue3.description, 'Descriptions not equal');
			assert.equal(result.issue.reportedBy, issue3.reportedBy, 'ReportedBys not equal');
			assert.equal(result.issue.assignedTo, issue3.assignedTo, 'AssignedTos not equal');
		});

		it('should fail getting issue 5', async() => {
			const result = await issue.getOneIssue(5);
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 404, 'Status not 404');
			assert.equal(result.errString, 'Issue not found', 'ErrString not \'Issue not found\'');
		});

		it('should fail with an invalid issue number', async() => {
			const result = await issue.getOneIssue('fred');
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 400, 'Status not 400');
			assert.equal(result.errString, 'Invalid issue number', 'ErrString not \'Invalid issue number\'');
		});
	});

	after(() => {
		return new Promise((resolve, reject) => {
			setupDB.closeDB(resolve, reject);
		});
	});
});