var request = require('../util/request-promise');

module.exports = function (tokenUri, apiKey, projectId, serviceId, secret) {
    return {
        'fetch': (option) => {
            option = option || {};
            var url = tokenUri + '?key=' + apiKey;
            var uJwttoken = option.uJwttoken || '';
            var requestModel = {
                'projectid': projectId || 'interpretationdrillopstown.slbapp.com',
                'serviceid': serviceId || 'kpidashboard-interpretationdrillopstown.slbservice.com',
                'secret': secret || '84707c18140f470a877450215203b7ec7124e1632c20',
                'targetprojid': option.targetProjectId || '',
                'targetserviceid': option.targetServiceId || ''
            }
            if (uJwttoken) {
                requestModel['onbehalf'] = 'user';
                requestModel['stoken'] = uJwttoken;
                requestModel['auds'] = JSON.parse(Buffer.from(uJwttoken.split('.')[1], 'base64').toString()).aud;
            }

            return request.post(url, requestModel);
        }
    }
};