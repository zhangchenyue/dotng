const express = require('express');
const ensure = require('connect-ensure-login');
const path = require('path');
const pageRouter = express.Router();
const pageRoutes = [
    '/',
    '/performance',
    '/qcview',
    '/maestrofootage',
    '/kpitracker',
    '/alertcenter',
    '/holecondition',
    '/holecondition/*',
    '/channelmonitor'
];

pageRoutes.forEach((route) => {
    pageRouter.get(route, ensure.ensureLoggedIn({ redirectTo: '/signon?' + Date.now(), setReturnTo: true }), (req, res) => {
        res.set('Cache-Control', 'no-cache, no-store');
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
});

pageRouter.get('/credits', ensure.ensureLoggedIn({ redirectTo: '/signon?' + Date.now(), setReturnTo: true }), (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store');
    res.sendFile(path.join(__dirname, '../public/credits.html'));
});

pageRouter.post('/logout', (req, res) => {
    req.logout();
    req.session = null
    res.send("<h2>You have been logged out.</h2>");
});


pageRouter.pageRoutes = pageRoutes;
module.exports = pageRouter;