
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var SessionStore = require('session-mongoose')(express);
var store = new SessionStore({
    url: 'mongodb://localhost/session',
    interval: 120000
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'aSecret'}));
app.use(express.session(
    {secret: 'aSecret', store: store, cookie: {maxAge: 900000}}
));
app.use(function(req, res, next) {
    app.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    app.locals.message = '';
    if (err) {
        app.locals.message = '<div class="alert alert-danger">' +
            err + '</div>';
    }
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout);
app.get('/home', routes.home);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
