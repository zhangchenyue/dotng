const request = require('./request-promise');

module.exports = function (options) {
    var consulHost = options.ConsulUri || 'https://13.91.47.250/';
    var environment = options.Environment || 'rhintrhapsody';
    var consulPath = '/v1/kv/';
    return {
        'get': (keys) => {
            var urls = keys.map((key) => consulHost + consulPath + environment + '/' + key);
            return new Promise(function (resolve, reject) {
                request.batchGet(urls)
                    .then((res) => {
                        var config = {};
                        res.forEach((el) => {
                            if(el)
                                config[el[0].Key.replace(environment + '/', '')] = Buffer.from(el[0].Value, 'base64').toString();
                        });
                        resolve(config);
                    })
                    .catch(e => {
                        reject(e);
                    });
            });
        }
    }
}