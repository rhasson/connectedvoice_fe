/* connectedvoice FE route handler */

"use strict";

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.voiceCallHandler = voiceCallHandler;
exports.smsCallHandler = smsCallHandler;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _loggerJs = require('./logger.js');

var _loggerJs2 = _interopRequireDefault(_loggerJs);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var voice_server_url = 'http://localhost:7100';
var sms_server_url = 'http://localhost:7101';

var log = _loggerJs2['default'].RouteHandlerLogger;

function voiceCallHandler(req, reply, next) {
	var body;
	return _regeneratorRuntime.async(function voiceCallHandler$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.prev = 0;
				body = undefined;

				if (!(req != undefined)) {
					context$1$0.next = 8;
					break;
				}

				context$1$0.next = 5;
				return _regeneratorRuntime.awrap((0, _requestPromise2['default'])({
					url: '' + voice_server_url + req.url,
					method: 'POST',
					json: true,
					body: req.params
				}));

			case 5:
				body = context$1$0.sent;
				context$1$0.next = 9;
				break;

			case 8:
				throw new Error('Missing request parameters');

			case 9:

				reply.header('content-type', 'application/xml');
				if (body === undefined) reply.send(200);else reply.send(200, body, { 'content-type': 'application/xml' });
				return context$1$0.abrupt('return', next());

			case 14:
				context$1$0.prev = 14;
				context$1$0.t0 = context$1$0['catch'](0);

				log.error(context$1$0.t0, 'voiceCallHandler');
				reply.send(500, 'An error occured');
				reply.end();
				return context$1$0.abrupt('return');

			case 20:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[0, 14]]);
}

function smsCallHandler(req, reply, next) {
	var body;
	return _regeneratorRuntime.async(function smsCallHandler$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.prev = 0;
				body = undefined;

				if (!(req != undefined)) {
					context$1$0.next = 8;
					break;
				}

				context$1$0.next = 5;
				return _regeneratorRuntime.awrap((0, _requestPromise2['default'])({
					url: '' + sms_server_url + req.url,
					method: 'POST',
					json: true,
					body: req.params
				}));

			case 5:
				body = context$1$0.sent;
				context$1$0.next = 9;
				break;

			case 8:
				throw new Error('Missing request parameters');

			case 9:

				reply.header('content-type', 'application/xml');
				if (body === undefined) reply.send(200);else reply.send(200, body, { 'content-type': 'application/xml' });
				return context$1$0.abrupt('return', next());

			case 14:
				context$1$0.prev = 14;
				context$1$0.t0 = context$1$0['catch'](0);

				log.error(context$1$0.t0, 'smsCallHandler');
				reply.send(500, 'An error occured');
				reply.end();
				return context$1$0.abrupt('return');

			case 20:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[0, 14]]);
}