// Florence Healthcare Coding Challenge
// Issue and File API
// Author: Tom Fulton

// This is the model for the issue collection.

var mongoose = require('mongoose');

var IssueSchema = new mongoose.Schema({
	id: Number,
	title: String,
	description: String,
	reportedBy: String,
	assignedTo: String,
	dateSubmitted: Date,
	status: String,
	files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Files' }]
});

module.exports = mongoose.model("Issues", IssueSchema);