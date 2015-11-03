"use strict";

import Logger from 'bunyan';

module.exports = {
	RouteHandlerLogger: Logger.createLogger({
		name: 'FE_RouteHandler',
		streams: [
			{
				type: 'rotating-file',
				period: '1d',
				count: 5,
				level: 'info',
				path: './logs/fe-routehandler-info.log'
			},
			{
				type: 'rotating-file',
				period: '1d',
				count: 5,
				level: 'error',
				path: './logs/fe-routehandler-error.log'
			}
		]
	}),
	WebServerLogger: Logger.createLogger({
		name: 'FE_WebServer',
		streams: [
			{
				type: 'rotating-file',
				period: '1d',
				count: 3,
				level: 'info',
				path: './logs/fe-webserver-info.log'
			},
			{
				type: 'rotating-file',
				period: '1d',
				count: 3,
				level: 'error',
				path: './logs/fe-webserver-error.log'
			}
		],
		serializers: {
			req: Logger.stdSerializers.req
		}
	}),
	TwilioSignatureLogger: Logger.createLogger({
		name: 'FE_TwilioSignature',
		streams: [
			{
				type: 'rotating-file',
				period: '1d',
				count: 5,
				level: 'info',
				path: './logs/fe-twiliosignature-info.log'
			},
			{
				type: 'rotating-file',
				period: '1d',
				count: 5,
				level: 'error',
				path: './logs/fe-twiliosignature-error.log'
			}
		]
	})
}