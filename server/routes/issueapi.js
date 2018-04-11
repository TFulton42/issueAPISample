// Florence Healthcare Coding Challenge
// Issue and File API
// Author: Tom Fulton

// This all of the routes for the API.

var express = require('express'),
	router = express.Router(),
	multer = require('multer'),
	issue = require('../api_modules/issues'),
	file = require('../api_modules/files');

// Configure the file upload destination
var storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'filestorage')
		},
		filename: (req, file, cb) => {
			cb(null, file.fieldname + '-' + Date.now())
		}
	}),
	upload = multer({storage: storage});

// The home route for the API. This will return some documentation for the API
router.get('/', (req, res) => {
	res.render('documentation');
});

// The SHOW? route for a file download for a specific issue
router.get('/issues/:issue/files/:fileNumber', (req, res) => {
	file.downloadFile(req.params.issue, req.params.fileNumber)
	.then(result => {
		if (result.status === 200) {
			var fileName = __dirname + '\\..\\' + result.fileLocation;
			res.download(fileName, result.fileName);
		} else {
			// I'm doing this since the test module isn't handling reject correctly.
			// At least I'm not sure what to do with Promise and async.
			res.status(result.status).send({'error': result.errString});
		}		
	}, errResult => {		
		res.status(errResult.status).send({'error': errResult.errString});
	});
});

// The CREATE route for a file for a specific issue
router.post('/issues/:issue/files', upload.single('filename'), (req, res) => {
	file.uploadFile(req.params.issue, req.file, req.body)
	.then(result => {
		if (result.status === 200) {
			res.send({'result': result.errString});
		} else {
			// I'm doing this since the test module isn't handling reject correctly.
			// At least I'm not sure what to do with Promise and async.
			res.status(result.status).send({'error': result.errString});
		}		
	}, errResult => {		
		res.status(errResult.status).send({'error': errResult.errString});
	});
});

// The INDEX route for the Issue API - show all issues
router.get('/issues', (req, res) => {
	issue.getAllIssues()
	.then(result => {
		if (result.status === 200) {
			res.send(result.issues);
		} else {
			// I'm doing this since the test module isn't handling reject correctly.
			// At least I'm not sure what to do with Promise and async.
			res.status(result.status).send({'error': result.errString});
		}		
	}, errResult => {		
		res.status(errResult.status).send({'error': errResult.errString});
	});
});

// The SHOW route for the Issue API - show specified issue
router.get('/issues/:id', (req, res) => {
	issue.getOneIssue(req.params.id)
	.then(result => {
		if (result.status === 200) {
			res.send(result.issue);
		} else {
			// I'm doing this since the test module isn't handling reject correctly.
			// At least I'm not sure what to do with Promise and async.
			res.status(result.status).send({'error': result.errString});
		}
	}, errResult => {		
		res.status(errResult.status).send({'error': errResult.errString});
	});
});

// The CREATE route for the Issue API - create issue
router.post('/issues', (req, res) => {
	issue.createNewIssue(req.body)
	.then(result => {
		if (result.status === 200) {
			res.send({'new-issue': result.issue});
		} else {
			// I'm doing this since the test module isn't handling reject correctly.
			// At least I'm not sure what to do with Promise and async.
			res.status(result.status).send({'error': result.errString});
		}
	}, errResult => {
		res.status(errResult.status).send({'error': errResult.errString});
	});
});

module.exports = router;