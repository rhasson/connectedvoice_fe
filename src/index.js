/* Connected Voice Front End Webserver */

"use strict";

import Restify from 'restify';
import Config from '../config.json';
import Logger from './libs/logger.js';
import Verify from './libs/verify_twilio.js';
import {voiceCallHandler, smsCallHandler} from './libs/route_handlers';

Logger.WebServerLogger.addSerializers({res: Restify.bunyan.serializers.res});
let log = Logger.WebServerLogger;

let server = Restify.createServer({
	name: 'Front End Webserver',
	log: log
});

server.use(Restify.queryParser());
server.use(Restify.gzipResponse());
server.use(Restify.bodyParser());

server.pre(function (request, reply, next) {
	request.log.info({req: request}, 'IncomingRequest');
	return next();
});

server.on('after', function (request, respose, route) {
	request.log.info({res: respose}, 'OutgoingResponse');
});

/*
* Middleware to verify Twilio message signature
* If successul pass the request to the handlers, if failure return a 403 error
*/
server.use(function(req, reply, next) {
	return next();

	Verify.isValidSignature(req)
	.then(function(isValid) {
		if (isValid) return next();
	})
	.catch(function(err) {
		reply.send(403, 'Failed to verify twilio signature');
		reply.end();
	});
});

server.post('/actions/v0/:id/voice.xml', voiceCallHandler);
server.post('/actions/v0/:id/status', voiceCallHandler);
server.post('/actions/v0/:id/action', voiceCallHandler);
server.post('/actions/v0/:id/action/:index', voiceCallHandler);
server.post('/actions/v0/:id/dequeue', voiceCallHandler);
server.post('/actions/v0/:id/wait/:index', voiceCallHandler);

server.post('/actions/v0/:id/sms.xml', smsCallHandler);

server.listen(9000, function() {
	log.info('ConnectedVoice FrontEnd Server Started');
});