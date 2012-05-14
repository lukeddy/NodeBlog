
/*
 * GET home page.
 */
var mongoose = require('mongoose')
,db = mongoose.connect('mongodb://localhost/mydb');

var Article = new mongoose.Schema({
	title: String,
	url: String,
	content: String,
	tag: String,
	datetime: String,
	id: String
});

var Info = new mongoose.Schema({
	total: String
});
var articleModel = mongoose.model('Article', Article);
var totalCount = 0;

articleModel.count({}, function(err, num){
	if (err)
		console.log("DB ERROR");
	else
		totalCount = num;
		//console.log("here" + num);
});


//document.write("The current month is " + monthNames[d.getMonth()]);

exports.index = function(req, res){
	var articleModel = mongoose.model('Article', Article);
	articleModel.find({}, function(err, doc){
		//res.writeHead( 200, { "Content-Type" : "text/html" } ); 
		res.render('index', {posts: doc});
 		//doc.forEach(function(item){
    		//	console.log(item);
		//});
	});
};
/*
exports.about = function(req, res){
	res.render('about', { title: 'Leo.Miao'})
};
*/
exports.post = function(req, res){
	res.render('post');
};

exports.god = function(req, res){
	console.log("here");
	switch (req.params.page){
		case "write":
			res.render('write');
			break;
		default:
		case "article":
			var articleModel = mongoose.model('Article', Article);
			articleModel.find({}, function(err, doc){
				res.render('article', {posts: doc});
			});
			break;
	}
};

exports.new = function(req, res, next){
	var d = new Date();
	var articleModel = mongoose.model('Article', Article);
	var article = new articleModel();
	article.title = req.body.title;
	article.url = req.body.url;
	article.content = req.body.myValue;
	article.tag = req.body.tag;
	article.id = totalCount + 1;
	article.datetime = d.toString();
	
	article.save(function(err){
		if (err)
			console.log("Error" + err);
		else
			res.redirect('/god/');
	});
/*	
	articleModel.find({}, function(err, doc){
 		doc.forEach(function(item){
    			console.log(item);
   		});
	});
*/
};

exports.delete = function(req, res){
	if ( req.params.type == 'a')
	{
		var articleModel = mongoose.model('Article', Article);
		articleModel.remove({id: req.params.id}, function(err){
			if (err) 
				console.log(err);
			else 
				res.redirect('/god/');
		});
	}
};
