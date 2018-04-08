var express = require("express");

// MongoDB Models
var Issues = require("../models/issues"),
	Files = require("../models/files");

// Get all of the issues. I'm sorting by ID, but this could obviously
// be configurable. You would probably also filter by status, date, etc.
// I'm choosing to return nothing and a valid status if there isn't anything
// in the list.
function getAllIssues(req, res) {
	Issues.find({})
	.select('id -_id title description reportedBy assignedTo dateSubmitted')
	.sort({id: 'asc'})
	.exec(function(err, list) {
		if (err) {
			console.log(err);
			return res.status(500).send(`Error accessing database`);
		}
		res.send(list);
	})
}

// Get an individual issue. Since there are supposed to be any duplicates
// (addressed below), I'm using findOne to ensure I'm only passing one back.
function getOneIssue(req, res) {
	Issues.findOne({id: req.params.id})
	.select('-_id')
	.populate({path: 'files', options: {sort: {dataSubmitted: 'asc'}}})
	.exec(function(err, foundIssue) {
		if (err) {
			console.log(err);
			return res.status(500).send(`Error accessing database`);
		}
		if (!foundIssue) {
			return res.status(404).send(`Issue not found`);
		}
		res.send(foundIssue);
	});
}

// Create a new issue.
// I'm not doing any checking for duplicate issues. That would be
// much more complicated in a ticket tracking system. The problem is
// identifying a duplicate. Most systems I've seen leave that up
// to an operator (human).
function createNewIssue(req, res) {
	var newId = 0;

	// Validate the data. I'm assuming that title, description,
	// and reportedBy are required. And that id, assignedTo, dataSubmitted,
	// and status are set here. The only validation I'm doing is to ensure
	// that the input values are non-null.
	if (!req.body.title || req.body.title === '') {
		return res.status(400).send(`Missing title`);
	}
	if (!req.body.description || req.body.description === '') {
		return res.status(400).send(`Missing description`);
	}
	if (!req.body.reportedBy || req.body.reportedBy === '') {
		return res.status(400).send(`Missing reportedBy`);
	}

	// See if there's already an issue. If not, this will be ID = 1.
	// If an record exists, the new ID will one push the current largest.
	// I'm making the assumption that issues are never deleted, just
	// marked as Complete or Archived or something. So this is a crude
	// way to get an auto-increment. I know there are better ways, but
	// I'm choosing to stay simple. And yes, I realize that this particular
	// scheme could lead to duplicate IDs if 2 people are using the API
	// simultaneously.
	Issues.findOne({})
	.sort('-id')
	.exec(function(err, foundIssue) {
		if (err) {
			console.log(err);
			return res.status(500).send(`Error accessing database`);
		}
		if (!foundIssue) {
			newId = 1;
		} else {
			newId = foundIssue.id + 1;
		}

		// Structure the input.
		var newIssue = new Issues({
			id: newId,
			title: req.body.title,
			description: req.body.description,
			reportedBy: req.body.reportedBy,
			assignedTo: '',
			dateSubmitted: Date.now(),
			status: 'Open'
		});
		// Finally create the record and return success (hopefully).
		Issues.create(newIssue, function(err, newRecord) {
			if (err) {
				console.log(err);
				return res.status(500).send(`Error accessing database`);
			}
			return res.send({issue: newRecord.id});
		})
	});
}

module.exports.getAllIssues = getAllIssues;
module.exports.getOneIssue = getOneIssue;
module.exports.createNewIssue = createNewIssue;