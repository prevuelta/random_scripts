/* AUTHENTICATION */
let passport = require('passport');
let LocalStrategy = require('passport-local');

const user = {
    username: "admin",
    password: "test",
    id: 1
};

const userObj = {
    verifyPassword: (pass) => {
        return true;
    }
}

function User (user) {
    return Object.assign({}, user, userObj);
}

const Users = {
    findOne: (options, cb) => {
        return cb(null, User(user));
    },
    findById: (id, cb) => {
        cb(null, user);
    }
}

/* -- AUTHENTICATION --*/

passport.use(new LocalStrategy(
  function(username, password, done) {
    Users.findOne({ username: username }, function (err, user) {
         console.log("User", user)
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.verifyPassword(password)) { return done(null, false); }
          return done(null, user);
      });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Users.findById(id, function (err, user){
        done(null, user);
    });
});


app.use(session({ secret: 'wereallylovecookies' }));

app.use(passport.initialize());
app.use(passport.session());

/* ROUTES */

app.get('/login', RequestFactory('login'));

app.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login'
}));

app.get('/admin', isLoggedIn, RequestFactory('admin'));

app.route('/admin/data/:resource')
    .get(
        isLoggedIn,
        function (req, res) {
            res.sendFile(DATA_DIR + '/' + req.params.resource +'.json');
    })
    .post(
        isLoggedIn,
        function (req, res) {
        saveJSON(req.body, DATA_DIR + '/' + req.params.resource + '.json', (err) => {
            if (err) {
                res.sendStatus(500);
            } else {
                rebuildSite();
                res.sendStatus(200);
            }
        });
    });

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
