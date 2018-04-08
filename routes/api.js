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
router.get("/issues", issue.getAllIssues);

// The SHOW route for the Issue API - show specified issue
router.get("/issues/:id", issue.getOneIssue);

// The CREATE route for the Issue API - create issue
router.post("/issues", issue.createNewIssue);

module.exports = router;