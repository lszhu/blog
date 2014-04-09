
/*
 * GET home page.
 */

var account = [
    {username: 'default', password: 'default'},
    {username: 'admin', password: 'admin'},
    {username: 'jason', password: 'letmein'},
    {username: 'jerry', password: 'letmein'}
];

exports.index = function(req, res){
  res.render('index', { title: 'Index' });
};

exports.login = function(req, res) {
    res.render('login', {title: '用户登录'});
};

exports.doLogin = function(req, res) {
    /*
    var user = {
        username: 'admin',
        password: 'admin'
    };
    if (req.body.username === user.username
        && req.body.password === user.password) {
        req.session.user =  user;
        return res.redirect('/home');
    }
    */
    var user = req.body.username,
        passwd = req.body.password;
    for (var i = 0; i < account.length; i++) {
        if (account[i].username === user && account[i].password === passwd) {
            req.session.user = account[i];
            return res.redirect('/home');
        }
    }
    req.session.error = 'error username or password';
    return res.redirect('/login');
};

exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/');
};

exports.home = function(req, res) {
    if (!req.session.user) {
        res.send('please login first.');
        return;
    }
    res.render('home', {title: 'Home'});
};