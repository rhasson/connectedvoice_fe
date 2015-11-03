"use strict";

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

module.exports = {
	RouteHandlerLogger: _bunyan2['default'].createLogger({
		name: 'FE_RouteHandler',
		streams: [{
			type: 'rotating-file',
			period: '1d',
			count: 5,
			level: 'info',
			path: '/usr/local/var/log/fe-routehandler-info.log'
		}, {
			type: 'rotating-file',
			period: '1d',
			count: 5,
			level: 'error',
			path: '/usr/local/var/log/fe-routehandler-error.log'
		}]
	}),
	WebServerLogger: _bunyan2['default'].createLogger({
		name: 'FE_WebServer',
		streams: [{
			type: 'rotating-file',
			period: '1d',
			count: 3,
			level: 'info',
			path: '/usr/local/var/log/fe-webserver-info.log'
		}, {
			type: 'rotating-file',
			period: '1d',
			count: 3,
			level: 'error',
			path: '/usr/local/var/log/fe-webserver-error.log'
		}],
		serializers: {
			req: _bunyan2['default'].stdSerializers.req
		}
	}),
	TwilioSignatureLogger: _bunyan2['default'].createLogger({
		name: 'FE_TwilioSignature',
		streams: [{
			type: 'rotating-file',
			period: '1d',
			count: 5,
			level: 'info',
			path: '/usr/local/var/log/fe-twiliosignature-info.log'
		}, {
			type: 'rotating-file',
			period: '1d',
			count: 5,
			level: 'error',
			path: '/usr/local/var/log/fe-twiliosignature-error.log'
		}]
	})
};