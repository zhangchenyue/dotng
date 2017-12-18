var request = require('request');

module.exports = {
    'fetch': (url, upn) => {
        var param = {
            'url': url + 'Token',
            'headers': {},
            'form': { 'grant_type': 'password', 'NameIdentifier': upn, 'unique_name': upn } || {},
            strictSSL: false
        };

        return new Promise(function (resolve, reject) {
            request.post(param, function (err, response, data) {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(JSON.parse(data));
                }
            });
        });

        ;
    }
};

