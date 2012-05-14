var config = require('../config/config');
var crypto = config.crypto
   ,db = config.db
   ,username = config.username
   ,password = config.password
   ,articleModel = config.articleModel;

exports.auth = function(req, res, next){
	if (!req.session.auth)
		res.redirect('/gate');
	else
		next();
};

exports.index = function(req, res){

	articleModel.find({}).sort('datetime', 1).execFind(function(err, doc)
	{
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

exports.write = function(req, res){
	res.render('write', {edit: '0', post: ""});
};

exports.article = function(req, res){
	articleModel.find({}).sort('datetime', 1).execFind(function(err, doc){
		if (err)
			res.render('error', {title: 'Opps!', message: err});
		else
			res.render('article', {posts: doc});
	});
};

exports.new = function(req, res){
	var d = new Date();
	var article = new articleModel();
	article.title = req.body.title;
	article.url = req.body.url;
	article.content = req.body.myValue;
	article.tag = req.body.tag;
	article.datetime = d;
	article.id = crypto.createHash('md5').update(article.url + article.datetime).digest("hex");
	article.save(function(err){
		if (err)
			res.render('error', {title: 'Opps!', message: err});
		else
			res.redirect('/god');
	});
};

exports.update = function(req, res){
	if (req.params.id){
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
