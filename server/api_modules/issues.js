// Florence Healthcare Coding Challenge
// Issue and File API
// Author: Tom Fulton

// This is the module for the issue get and create part of the API.

// MongoDB Models
var Issues = require('../models/issues'),
	Files = require('../models/files');

// Get all of the issues. I'm sorting by ID, but this could obviously
// be configurable. You would probably also filter by status, date, etc.
// I'm choosing to return nothing and a valid status if there isn't anything
// in the list.
function getAllIssues() {
	return new Promise((resolve, reject) => {
		Issues.find({})
		.select('-_id -__v')
		.sort({id: 'asc'})
		.populate({path: 'files', options: {sort: {fileNumber: 'asc'}}, select: '-_id fileNumber originalFileName uploadedBy'})
		.exec(function(err, list) {
			var retVal = {status: 200, errString: '', issues: list};
			if (err) {
				console.log(err);
				retVal.status = 500;
				retVal.errString = 'Error accessing database';
				return resolve(retVal);
			} else {
				return resolve(retVal);
			}
		});
	});
}

// Get an individual issue. Since there aren't supposed to be any duplicates
// (addressed below), I'm using findOne to ensure I'm only passing one back.
function getOneIssue(id) {
	return new Promise((resolve, reject) => {
		var retVal = {status: 200, errString: ''};
		// Validate the type of the ID
		if (isNaN(id)) {
			retVal.status = 400;
			retVal.errString = 'Invalid issue number';
			return resolve(retVal);
		} else {
			Issues.findOne({id: id})
			.select('-_id -__v')
			.populate({path: 'files', options: {sort: {fileNumber: 'asc'}}, select: '-_id fileNumber originalFileName uploadedBy'})
			.exec((err, foundIssue) => {
				if (err) {
					retVal.status = 500;
					retVal.errString = 'Error accessing database';
					return resolve(retVal);
				} else if (!foundIssue) {
					// Unknown issue
					retVal.status = 404;
					retVal.errString = 'Issue not found';
					return resolve(retVal);
				} else {
					retVal.issue = foundIssue;
					return resolve(retVal);
				}
			});
		}
	});
}

// Create a new issue.
// I'm not doing any checking for duplicate issues. That would be
// much more complicated in a ticket tracking system. The problem is
// identifying a duplicate. Most systems I've seen leave that up
// to an operator (human).
function createNewIssue(body) {
	return new Promise((resolve, reject) => {
		var retVal = {status: 200, errString: ''},
			newId = 0;

		// Validate the data. I'm assuming that title, description,
		// and reportedBy are required. And that id, assignedTo, dataSubmitted,
		// and status are set here. The only validation I'm doing is to ensure
		// that the input values are non-null.
		if (!body.title || body.title === '') {
			retVal.status = 400;
			retVal.errString = 'Missing title';
			return resolve(retVal);
		} else if (!body.description || body.description === '') {
			retVal.status = 400;
			retVal.errString = 'Missing description';
			return resolve(retVal);
		} else if (!body.reportedBy || body.reportedBy === '') {
			retVal.status = 400;
			retVal.errString = 'Missing reportedBy';
			return resolve(retVal);
		} else {
			// See if there's already an issue. If not, this will be ID = 1.
			// If an record exists, the new ID will one plus the current largest.
			// I'm making the assumption that issues are never deleted, just
			// marked as Complete or Archived or something. So this is a crude
			// way to get an auto-increment. I know there are better ways, but
			// I'm choosing to stay simple. And yes, I realize that this particular
			// scheme could lead to duplicate IDs if 2 people are using the API
			// simultaneously.
			Issues.findOne({})
			.select('id')
			.sort('-id')
			.exec(function(err, foundIssue) {
				if (err) {
					retVal.status = 500;
					retVal.errString = 'Error accessing database';
					resolve(retVal);
				} else {
					if (!foundIssue) {
						newId = 1;
					} else {
						newId = foundIssue.id + 1;
					}

					// Structure the input.
					var newIssue = new Issues({
						id: newId,
						title: body.title,
						description: body.description,
						reportedBy: body.reportedBy,
						assignedTo: '',
						dateSubmitted: Date.now(),
						status: 'Open'
					});
					
					// Finally create the record and return success (hopefully).
					Issues.create(newIssue, function(err, newRecord) {
						if (err) {
							retVal.status = 500;
							retVal.errString = 'Error accessing database';
							return resolve(retVal);
						}
						retVal.issue = newRecord.id;
						return resolve(retVal);
					});
				}
			});
		}
	});
}

module.exports.getAllIssues = getAllIssues;
module.exports.getOneIssue = getOneIssue;
module.exports.createNewIssue = createNewIssue;