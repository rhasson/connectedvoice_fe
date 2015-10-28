/* connectedvoice FE route handler */

"use strict";

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.voiceCallHandler = voiceCallHandler;
exports.smsCallHandler = smsCallHandler;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var voice_server_url = 'http://localhost:8000';
var sms_server_url = 'http://localhost:8001';

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
				if (!(body === undefined)) {
					context$1$0.next = 13;
					break;
				}

				reply.send(200);
				context$1$0.next = 17;
				break;

			case 13:
				body = new Buffer(body, 'base64').toString('utf8');
				reply.send(200, body, { 'content-type': 'application/xml' });
				reply.end();
				return context$1$0.abrupt('return', next());

			case 17:
				context$1$0.next = 25;
				break;

			case 19:
				context$1$0.prev = 19;
				context$1$0.t0 = context$1$0['catch'](0);

				console.log('voiceCallHandler Error ', context$1$0.t0.message);
				reply.send(402, 'An error occured', { 'content-type': 'application/xml' });
				reply.end();
				return context$1$0.abrupt('return');

			case 25:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[0, 19]]);
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
				if (body === undefined) reply.send(200);else reply.send(200, body, { 'content-type': 'application/xml' });
				reply.end();
				return context$1$0.abrupt('return', next());

			case 14:
				context$1$0.prev = 14;
				context$1$0.t0 = context$1$0['catch'](0);

				console.log('smsCallHandler Error ', context$1$0.t0);
				reply.send(402, 'An error occured', { 'content-type': 'application/xml' });
				reply.end();
				return context$1$0.abrupt('return');

			case 20:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[0, 14]]);
}