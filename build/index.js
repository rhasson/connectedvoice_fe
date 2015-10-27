"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _configJson = require('../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _libsVerify_twilioJs = require('./libs/verify_twilio.js');

var _libsVerify_twilioJs2 = _interopRequireDefault(_libsVerify_twilioJs);

var _libsRoute_handlers = require('./libs/route_handlers');

var server = _restify2['default'].createServer();

server.use(_restify2['default'].queryParser());
server.use(_restify2['default'].gzipResponse());
server.use(_restify2['default'].bodyParser());

/*
* Middleware to verify Twilio message signature
* If successul pass the request to the handlers, if failure return a 403 error
*/
server.use(function (req, reply, next) {
	_libsVerify_twilioJs2['default'].isValidSignature(req).then(function (isValid) {
		if (isValid) return next();
	})['catch'](function (err) {
		reply.send(403, 'Failed to verify twilio signature');
		reply.end();
	});
});

server.post('/actions/v0/:id/voice.xml', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/sms.xml', _libsRoute_handlers.smsCallHandler);
server.post('/actions/v0/:id/status', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/action', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/action/:index', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/dequeue', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/wait/:index', _libsRoute_handlers.voiceCallHandler);

server.listen(9000, function () {
	console.log('ConnectedVoice FrontEnd Server Started - ', new Date());
});