// MongoDB Models
var Issues = require('../models/issues'),
	Files = require('../models/files'),
	fs = require('fs');

// Upload a file. I'm choosing to only validate that the file isn't zero length,
// the author's name is also not empty and the file name is specified. I suspect
// there are lots of choices that could be made for validation however. The issue
// number must also be valid. I should probably also be validating some of the
// HTTP headers.
// Note: I am NOT removing the file once it uploads -- Check this. Maybe I am.
function uploadFile(id, fileObj, bodyObj) {
	return new Promise((resolve, reject) => {
		var retVal = {status: 200, errString: 'File uploaded successfully'};

		// Check for empty file
		if (fileObj.size <= 0) {
			retVal.status = 400;
			retVal.errString = 'Non empty file required';
			deleteFile(fileObj.path);
			return resolve(retVal);
		}
		// Check for empty author
		if (!bodyObj.author || bodyObj.author === '') {
			retVal.status = 400;
			retVal.errString = 'Missing author';
			deleteFile(fileObj.path);
			return resolve(retVal);
		}
		// Check for empty original file name
		if (!fileObj.originalname || fileObj.originalname === '') {
			retVal.status = 400;
			retVal.errString = 'Missing file name';
			deleteFile(fileObj.path);
			return resolve(retVal);			
		}
		// Check for invalid issue number
		if (isNaN(id)) {
			retVal.status = 400;
			retVal.errString = 'Invalid issue number';
			deleteFile(fileObj.path);
			return resolve(retVal);
		}
		Issues.findOne({id: id}, (err, foundIssue) => {
			if (err) {
				retVal.status = 500;
				retVal.errString = 'Error accessing database';
				deleteFile(fileObj.path);
				return resolve(retVal);				
			}
			if (foundIssue === null) {
				retVal.status = 404;
				retVal.errString = 'Issue not found';
				deleteFile(fileObj.path);
				return resolve(retVal);
			}
			// If we've gotten to here, all should be good and we can
			// put the information in the database.
			var fd = new Files({
				originalFileName: fileObj.originalname,
				location: fileObj.path,
				uploadedBy: bodyObj.author,
				dateSubmitted: Date.now(),
				issueBelongedTo: foundIssue._id
			});
			Files.create(fd, (err, newFile) => {
				if (err) {
					retVal.status = 500;
					retVal.errString = 'Error accessing database';
					deleteFile(fileObj.path);
					return resolve(retVal);
				}
				foundIssue.files.push(newFile._id);
				foundIssue.save((err) => {
					if (err) {
						retVal.status = 500;
						retVal.errString = 'Error accessing database';
						return resolve(retVal);
					}
					return resolve(retVal);
				});
			});
		});
	});
}

function deleteFile(path)
{
	fs.unlink(path, (err) => {
		if (err) {
			// Log some type of error here, but I don\'t have a logging module
		}
	});
}

module.exports.uploadFile = uploadFile;