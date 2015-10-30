/* connectedvoice FE route handler */

"use strict";

import _ from 'lodash';
import Request from 'request-promise';

const voice_server_url = 'http://localhost:7100';
const sms_server_url = 'http://localhost:7101';

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
		else reply.send(200, body);
		reply.end();
		return next();
	} catch(e) {
		console.log('voiceCallHandler Error ', e.message);
		reply.send(402, 'An error occured');
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
		else reply.send(200, body);
		reply.end();
		return next();
	} catch(e) {
		console.log('smsCallHandler Error ', e);
		reply.send(402, 'An error occured');
		reply.end();
		return;
	}
}
