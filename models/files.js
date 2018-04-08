var mongoose = require("mongoose");

var FileSchema = new mongoose.Schema({
	name: String,
	localtion: String,
	uploadedBy: String,
	dateSubmitted: Date,
	issueBelongedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issues' }]
});

module.exports = mongoose.model("Files", FileSchema);