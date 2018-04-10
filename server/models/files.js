var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({
	originalFileName: String,
	location: String,
	uploadedBy: String,
	dateSubmitted: Date,
	issueBelongedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issues' }]
});

module.exports = mongoose.model("Files", FileSchema);