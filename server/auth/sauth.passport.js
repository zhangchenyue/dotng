var SAuthStrategy = require('./sauth.strategy');

module.exports = function (server, passport, config) {
    server.use(passport.initialize());
    server.use(passport.session());

    var users = {};
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        users[user.id] = user;
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        try {
            let user = users[id] || null;
            done(null, user);
        } catch (error) {
            done(null, null);
        }
    });

    var decodedAuthString = Buffer.from(config['SAuth-ClientAuthRequestEncoded-Rhapsody'], 'base64').toString();
    var authOptions = {
        sauthURL: '',
        tokenServiceApiKey: '',
        tokenServiceURL: '',
        authRequest: {
            info: JSON.parse(decodedAuthString.substring(decodedAuthString.indexOf('{'), 1 + decodedAuthString.lastIndexOf('}'))),
            encodedString: config['SAuth-ClientAuthRequestEncoded-Rhapsody']
        }
    };

    passport.use(new SAuthStrategy(authOptions, function (accessToken, refreshToken, profile, done) {
        try {
            var userInfo = {};
            if (profile.stoken && profile.stoken.split('.')[1]) {
                let decodedUserString = Buffer.from(profile.stoken.split('.')[1], 'base64').toString();
                userInfo = JSON.parse(decodedUserString.substring(decodedUserString.indexOf('{'), 1 + decodedUserString.lastIndexOf('}')));
            }
            let user = {
                id: profile.user,
                utoken: profile.stoken,
                refreshToken: refreshToken,
                givenName: userInfo.firstname || '',
                lastName: userInfo.lastname || '',
                expDate: userInfo.exp
            };
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

    server.get('/signon', passport.authenticate('sauth'));

    server.post('/signonCallback', passport.authenticate('sauth', { successRedirect: '/', failureRedirect: '/signon?' + Date.now(), }));

};