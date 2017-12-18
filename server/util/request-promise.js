var request = require('request');

function requestPromise(url, method, data) {
    return new Promise(function (resolve, reject) {
        var params = {
            'url': url,
            'headers': {},
            'body': data || {},
            json: true,
            strictSSL: false
        };
        request[method.toLowerCase()](params, function (err, response, data) {
            if (err) {
                reject(err)
            };
            if (data && data.Error) {
                reject(data.Error)
            } else {
                resolve(data);
            }
        });
    });
};


module.exports = {
    'get': (url) => requestPromise(url, 'GET'),
    'post': (url, data) => requestPromise(url, 'POST', data),
    'put': (url, data) => requestPromise(url, 'PUT', data),
    'batchGet': (urls) => Promise.all(urls.map((url) => requestPromise(url, 'GET'))),
    'batchPost': (params) => Promise.all(params.map((param) => requestPromise(param.url, 'POST', param.data))),
    'batchPut': (params) => Promise.all(params.map((param) => requestPromise(param.url, 'PUT', param.data))),
};
