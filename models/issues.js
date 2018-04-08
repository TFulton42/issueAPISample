var mongoose = require("mongoose");

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