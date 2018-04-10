// Get the documentation for the API
function getDocumentation(req, res) {
	var apiDocumentation =
`Issue and File Upload/Download documentation
 The Issue API consists of 3 calls. They are:
 	1. getAllIssues
 	2. getSingleIssue
 	3. createNewIssue`;
	res.send(apiDocumentation);
}

module.exports.getDocumentation = getDocumentation;