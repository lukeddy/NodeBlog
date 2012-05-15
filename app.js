
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/routes')
  , ejs = require("ejs")
  , csrf = require("./lib/csrf");
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
//  app.set('view engine', 'jade');
  	app.set('view engine', 'html');
	app.use(express.cookieParser());
	app.use(express.session({secret:"what you see is what you get"}))
  	app.use(express.bodyParser());
  	app.use(express.methodOverride());
  	app.use(app.router);
	app.use(csrf.check());
  	app.use(express.static(__dirname + '/public'));
  	app.register('html', ejs);
  	app.set("view options", { layout: false});
});

app.configure('development', function(){
  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  	app.use(express.errorHandler());
});

app.dynamicHelpers({
	csrf: csrf.token
});

// Routes
app.get('/', routes.index);
//app.get('/about',routes.about);
app.post('/new', routes.new);
app.post('/update/:id', routes.update);
app.get('/god', routes.auth, routes.article);
app.get('/god/article', routes.auth, routes.article);
app.get('/god/write',routes.auth , routes.write);
app.get('/delete/:type/:id', routes.auth, routes.delete);
app.get('/edit/:type/:id', routes.auth, routes.edit);
app.get('/gate', routes.gate);
app.post('/check', routes.check);
app.get('/logout', routes.logout);
app.get('/:post', routes.post);
app.listen(3000, function(){
  	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
