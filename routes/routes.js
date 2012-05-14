
var crypto = require('crypto');
var mongoose = require('mongoose')
,db = mongoose.connect('mongodb://localhost/mydb');

var Article = new mongoose.Schema({
	title: String,
	url: String,
	content: String,
	tag: String,
	datetime: Date,
	id: String
});

var Info = new mongoose.Schema({
	total: String
});

var articleModel = mongoose.model('Article', Article);
function getCount(){
	var articleModel = mongoose.model('Article', Article);
	articleModel.count({}, function(err, num){
		if (err)
			console.log("DB ERROR");
		else
				
			return  num;
			//console.log("here" + num);
	});
}

exports.auth = function(req, res, next){
	if (!req.session.auth)
		res.redirect('/gate');
	else
		next();
};
//document.write("The current month is " + monthNames[d.getMonth()]);

exports.index = function(req, res){
	//var articleModel = mongoose.model('Article', Article);
	articleModel.find({}).sort('datetime', 1).execFind(function(err, doc){
		if (err)
			res.render('error', {title: 'Opps!', message: err});
		else
			res.render('index', {posts: doc});
	});
};
/*
exports.about = function(req, res){
	res.render('about', { title: 'Leo.Miao'})
};
*/
/*
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
};*/
exports.write = function(req, res){
	res.render('write', {edit: '0', post: ""});
};

exports.article = function(req, res){
	//var articleModel = mongoose.model('Article', Article);
	articleModel.find({}).sort('datetime', 1).execFind(function(err, doc){
		if (err)
			res.render('error', {title: 'Opps!', message: err});
		else
			res.render('article', {posts: doc});
	});
};

exports.new = function(req, res){
	var d = new Date();
	//var articleModel = mongoose.model('Article', Article);
	var article = new articleModel();
	article.title = req.body.title;
	article.url = req.body.url;
	article.content = req.body.myValue;
	article.tag = req.body.tag;
	//article.datetime = d.toString();
	article.datetime = d;
	article.id = crypto.createHash('md5').update(article.url + article.datetime).digest("hex");
	article.save(function(err){
		if (err)
			res.render('error', {title: 'Opps!', message: err});
		else
			res.redirect('/god');
	});
};
/*
exports.update = function(req, res){
	if (req.params.id){
		var article = new articleModel();
		article.title = req.body.title;
		article.url = req.body.url;
		article.content = req.body.myValue;
		article.tag = req.body.tag;
		article.tag = req.params.id;
		article.update({id: req.params.id}, {
			title: req.body.title
			,url: req.body.url
			,content = req.body.myValue
			,article.tag = req.body.tag
		}, {}, function(){
			if (err)
				res.render('error', {title: 'Opps!', message: err});
			else
				console.log("");
		});
	}
};
*/
exports.update = function(req, res){
	if (req.params.id){
		//var article = new articleModel();
		articleModel.findOne({id: req.params.id}, function(err, doc){
			if (!doc)
				res.render('error', {title: '404 Page Not Found', message: "The content you're looking for doesn't exisit."});
			else {
				doc.title = req.body.title;
				doc.url = req.body.url;
				doc.content = req.body.myValue;
				doc.tag = req.body.tag;
				doc.id = req.params.id;
				doc.save(function(err){
					if (err)
						res.render('error', {title: 'Oops!', message: err});
					else
						res.redirect('/god');
				});
			}
		});
	}
};

exports.delete = function(req, res){
	if ( req.params.type == 'a')
	{
		//var articleModel = mongoose.model('Article', Article);
		if ( req.params.id != "" ){
			articleModel.remove({id: req.params.id}, function(err){
				if (err) 
					res.render('error', {title: 'Oops!', message: err});
				else 
					res.redirect('/god');
			});
		}
	}
};

exports.edit = function(req, res){
	if ( req.params.type == 'a' )
	{
		articleModel.findOne({id: req.params.id}, function(err, doc){
			if (err)
				res.render('error', {title: 'Oops!', message: err});
			else
				res.render('write',{edit: '1', post: doc});
		});
	}
};

exports.gate = function(req, res){
	if (req.session.auth)
		res.redirect('/god');
	else
		res.render('gate', {message: ""});
};

exports.check = function(req, res){
	var username = "admin";
	var password = "admin";
	if (req.body.username == username && req.body.password == password){
		req.session.username = username;
		req.session.auth = true;
		res.redirect('/god');
	}else{
		res.render('gate',{message: "The Gate keeper say: I don't know who you are, pleass try to tell me again."})
	}
};

exports.logout = function(req, res){
	if (req.session.auth){
		req.session.destroy();
		res.redirect('/');
	}else{
		res.redirect('/gate');
	}
};
exports.post = function(req, res){
//	console.log("post: " + req.params.post);
	if ( req.params.post != 'favicon.ico'){
		//var articleModel = mongoose.model('Article', Article);
		articleModel.findOne({url: req.params.post}, function(err, doc){
			if ( doc )
				res.render('post', {post: doc});
			else
				res.render('error', {title: '404 Page Not Found', message: "The content you're looking for doesn't exisit."});
		});
	}
};
