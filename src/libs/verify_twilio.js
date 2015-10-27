"use strict";

import Twilio from 'twilio';
import _ from 'lodash';
import LRU from 'lru-cache';
import Db from './db.js';

let TOKENS = LRU({
		max: 50000,
		length: (n) => { return n.length },
		maxAge: 1000 * 60 * 60
	});

function _verifyRequest(req) {
	let header = req.headers['x-twilio-signature'];
	let url = req.headers['x-forwarded-proto'] + '://' + req.headers['host'] + req.url;
	let params = {};
	let token;

	params = _.assign(params, req.params);
	delete params.id;
	delete params.index;

	token = ('AccountSid' in params) ? TOKENS.get(params.AcountSid) : undefined;

	if (!token) {
		return getTokenFromDb(params.AccountSid)
		.then(function(tok) {
			if (tok) {
				TOKENS.set(params.AccountSid, tok);
				//return when.resolve(true);
				let isValid = Twilio.validateRequest(tok, header, url, params);
				if (isValid) return Promise.resolve(true);
				else return Promise.reject(new Error('Signature validation failed'));
			}
		})
		.catch(function(err) {
			console.log('verifyRequest getTokenFromDb: ', err)
			return Promise.reject(err);
		});
	} else {
		return Promise.reject(new Error('No token found'));
	}
}

function getTokenFromDb(asid) {
	return Db.search('searchToken', 'searchToken', {q: 'account_sid:'+asid})
	.then(function(doc) {
		let body = doc.shift();
		let headers = doc.shift();
		let token;
		let status_code = ('status-code' in headers) ? headers['status-code'] : ('statusCode' in headers) ? headers['statusCode'] : undefined;

		if (status_code !== 200) return Promise.reject(new Error('DB Search for token returned error'));

		token = _.result(_.find(body.rows, 'fields.account_sid', asid), 'fields.auth_token');

		if (token) return Promise.resolve(token);
		else return Promise.reject(new Error('No token found'));
	})
	.catch(function(err) {
		console.log('getTokenFromDb: ', err)
		return Promise.reject(new Error('Failed to get token from DB - ' + err));
	});
}

module.exports = {
	isValidSignature: _verifyRequest
}
