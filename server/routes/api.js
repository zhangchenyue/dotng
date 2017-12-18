const express = require('express');
const ensure = require('connect-ensure-login');
const path = require('path');
const svctoken = require('../auth/sauth.svctoken');
const stsbearer = require('../util/sts.bearer');
const apiRouter = express.Router();
const NodeCache = require("node-cache");
const serviceTokenCache = new NodeCache({ checkperiod: 120 });
const expiredseconds = 23 * 3600; //23h

apiRouter.all('/api/*', ensure.ensureLoggedIn('/signon?' + Date.now()));

apiRouter.all('/api/*', (req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store');
    next();
});

apiRouter.get('/api/user', (req, res) => {
    res.json({
        'name': req.user.givenName + ' ' + req.user.lastName,
        'upn': req.user.id,
        'utoken': req.user.utoken,
    });
});

apiRouter.get('/api/appSettings', (req, res) => {
    let config = req.appconfig;
    let appSettings = {
        debugWellID: process.env.RHAPSODY_DEBUG_TEST_WELLID || '',
        serviceToken: ''
    };
    Object.keys(config).filter(key => /^Uri-.*/.test(key)).forEach(key => appSettings[key] = config[key]);

    let deltTime = parseInt(req.user.expDate) * 1000 - Date.now() - 3600000;
    let serviceToken = serviceTokenCache.get(req.user.id);
    console.log('stoken cache', serviceToken);
    console.log('utoken expired date', req.user.expDate);
    console.log('deltTime', deltTime);

    if (serviceToken && deltTime > 0) {
        appSettings.serviceToken = serviceToken;
        res.json(appSettings);
    }
    else {
        svctoken(config['SAuth-ServiceToken-Uri'], config['SAuth-ServiceToken-ApiKey'])
            .fetch({ uJwttoken: req.user.utoken, targetProjectId: '', targetServiceId: '' })
            .then(tRes => {
                appSettings.serviceToken = tRes.svctoken;
                serviceTokenCache.set(req.user.id, tRes.svctoken, expiredseconds);
                res.json(appSettings);
            })
            .catch(e => {
                console.log(e);
            });
    }
});

module.exports = apiRouter;