var	mongoose = require('mongoose'),
	chai = require('chai'),
	assert = chai.assert,
	setupDB = require('./lib/setupDB');

// Mongoose models
var Issues = require('../server/models/issues');

// Tested functions
var	issue = require("../server/api_modules/issues");

describe('getAllIssues Tests', () => {

	before(() => {
		return new Promise((resolve, reject) => {
			setupDB.openAndClearDB(resolve, reject);
		});
	});

	describe('Test getAllIssues', () => {
		it('should return 4 issues', async() => {
			var result = await issue.getAllIssues();
			assert.equal(result.issues.length, 4, '4 results not returned');
		});

		it('should return issue 2 correctly', async() => {
			var issue2 = new Issues({
				id: 2,
				title: 'Stormtrooper models defective',
				description: 'They can\'t hit anything with a blaster.',
				reportedBy: 'Grand Moff Tarkin',
				assignedTo: '',
				dateSubmitted: Date.now(),
			});
			var result = await issue.getAllIssues();
			var retIssue = result.issues[1];
			assert.isObject(result, 'Result is not an object');
			assert.equal(result.status, 200, 'Status not 200');
			assert.isEmpty(result.errString, 'ErrString is not null');
			assert.isArray(result.issues, 'Issues is not an object');
			assert.equal(retIssue.id, issue2.id, 'Ids not equal');
			assert.equal(retIssue.title, issue2.title, 'Titles not equal');
			assert.equal(retIssue.description, issue2.description, 'Descriptions not equal');
			assert.equal(retIssue.reportedBy, issue2.reportedBy, 'ReportedBys not equal');
			assert.equal(retIssue.assignedTo, issue2.assignedTo, 'AssignedTos not equal');
		});
	});

	after(() => {
		return new Promise((resolve, reject) => {
			setupDB.closeDB(resolve, reject);
		});
	});
});