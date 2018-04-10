var express = require("express"),
	router = express.Router(),
	issue = require("../api_modules/issues"),
	doc = require("../api_modules/doc");

// MongoDB Models
var Issues = require("../models/issues"),
	Files = require("../models/files");

// The home route for the API. This will return some documentation for the API
router.get("/", doc.getDocumentation);

// The INDEX route for the Issue API - show all issues
router.get("/issues", (req, res) => {
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
router.get("/issues/:id", (req, res) => {
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
router.post("/issues", (req, res) => {
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