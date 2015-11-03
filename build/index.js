/* Connected Voice Front End Webserver */

"use strict";

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _configJson = require('../config.json');

var _configJson2 = _interopRequireDefault(_configJson);

var _libsLoggerJs = require('./libs/logger.js');

var _libsLoggerJs2 = _interopRequireDefault(_libsLoggerJs);

var _libsVerify_twilioJs = require('./libs/verify_twilio.js');

var _libsVerify_twilioJs2 = _interopRequireDefault(_libsVerify_twilioJs);

var _libsRoute_handlers = require('./libs/route_handlers');

var isDebug = process.env['HOME'] === '/Users/roy' ? true : false;

_libsLoggerJs2['default'].WebServerLogger.addSerializers({ res: _restify2['default'].bunyan.serializers.res });
var log = _libsLoggerJs2['default'].WebServerLogger;

var server = _restify2['default'].createServer({
	name: 'Front End Webserver',
	log: log
});

server.use(_restify2['default'].queryParser());
server.use(_restify2['default'].gzipResponse());
server.use(_restify2['default'].bodyParser());

server.pre(function (request, reply, next) {
	request.log.info({ req: request }, 'IncomingRequest');
	return next();
});

server.on('after', function (request, respose, route) {
	request.log.info({ res: respose }, 'OutgoingResponse');
});

/*
* Middleware to verify Twilio message signature
* If successul pass the request to the handlers, if failure return a 403 error
*/
server.use(function (req, reply, next) {
	if (isDebug) {
		log.info('BYPASSING TWILIO SIGNATURE CHECK');
		return next();
	}

	_libsVerify_twilioJs2['default'].isValidSignature(req).then(function (isValid) {
		if (isValid) return next();
	})['catch'](function (err) {
		reply.send(403, 'Failed to verify twilio signature');
		reply.end();
	});
});

server.post('/actions/v0/:id/voice.xml', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/status', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/action', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/action/:index', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/dequeue', _libsRoute_handlers.voiceCallHandler);
server.post('/actions/v0/:id/wait/:index', _libsRoute_handlers.voiceCallHandler);

server.post('/actions/v0/:id/sms.xml', _libsRoute_handlers.smsCallHandler);

server.listen(9000, function () {
	log.info('ConnectedVoice FrontEnd Server Started');
});