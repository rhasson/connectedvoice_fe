/* connectedvoice FE route handler */

"use strict";

import _ from 'lodash';
import Logger from './logger.js';
import Request from 'request-promise';

const voice_server_url = 'http://localhost:7100';
const sms_server_url = 'http://localhost:7100';

let log = Logger.RouteHandlerLogger;

export async function voiceCallHandler(req, reply, next) {
	try {
		let body;
		if (req != undefined) {
			body = await Request({
				url: `${voice_server_url}${req.url}`,
				method: 'POST',
				json: true,
				body: req.params
			});
		} else throw new Error('Missing request parameters')

		reply.header('content-type', 'application/xml');
		if (body === undefined) reply.send(200);
		else reply.send(200, body, {'content-type': 'application/xml'});
		return next();
	} catch(e) {
		log.error(e, 'voiceCallHandler');
		reply.send(500, 'An error occured');
		reply.end();
		return;
	}
}

export async function smsCallHandler(req, reply, next) {
	try {
		let body;
		if (req != undefined) {
			body = await Request({
				url: `${sms_server_url}${req.url}`,
				method: 'POST',
				json: true,
				body: req.params
			});
		} else throw new Error('Missing request parameters')

		reply.header('content-type', 'application/xml');
		if (body === undefined) reply.send(200);
		else reply.send(200, body, {'content-type': 'application/xml'});
		return next();
	} catch(e) {
		log.error(e, 'smsCallHandler');
		reply.send(500, 'An error occured');
		reply.end();
		return;
	}
}
