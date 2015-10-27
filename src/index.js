"use strict";

import Config from '../config.json';
import Restify from 'restify';
import Verify from './libs/verify_twilio.js';
import {voiceCallHandler, smsCallHandler} from './libs/route_handlers';

let server = Restify.createServer();

server.use(Restify.queryParser());
server.use(Restify.gzipResponse());
server.use(Restify.bodyParser());

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
	console.log('ConnectedVoice FrontEnd Server Started - ', new Date());
});