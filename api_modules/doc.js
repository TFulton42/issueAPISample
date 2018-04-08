var express = require("express");

// Get the documentation for the API
function getDocumentation(req, res) {
	console.log("return doc");
	res.send(`This is the documentation for the API`);
}

module.exports.getDocumentation = getDocumentation;