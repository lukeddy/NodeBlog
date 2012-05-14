var mongoose = require('mongoose');

exports.crypto = require('crypto');
exports.db = mongoose.connect('mongodb://localhost/mydb');
exports.username = "admin";
exports.password = "admin";

var Article = new mongoose.Schema({
	title: String,
	url: String,
	content: String,
	tag: String,
	datetime: Date,
	id: String
});

exports.articleModel = mongoose.model('Article', Article);
