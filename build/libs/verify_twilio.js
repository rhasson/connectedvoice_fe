"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lruCache = require('lru-cache');

var _lruCache2 = _interopRequireDefault(_lruCache);

var _dbJs = require('./db.js');

var _dbJs2 = _interopRequireDefault(_dbJs);

var TOKENS = (0, _lruCache2['default'])({
	max: 50000,
	length: function length(n) {
		return n.length;
	},
	maxAge: 1000 * 60 * 60
});

function _verifyRequest(req) {
	var header = req.headers['x-twilio-signature'];
	var url = req.headers['x-forwarded-proto'] + '://' + req.headers['host'] + req.url;
	var params = {};
	var token = undefined;

	params = _lodash2['default'].assign(params, req.params);
	delete params.id;
	delete params.index;

	token = 'AccountSid' in params ? TOKENS.get(params.AcountSid) : undefined;

	if (!token) {
		return getTokenFromDb(params.AccountSid).then(function (tok) {
			if (tok) {
				TOKENS.set(params.AccountSid, tok);
				//return when.resolve(true);
				var isValid = _twilio2['default'].validateRequest(tok, header, url, params);
				if (isValid) return Promise.resolve(true);else return Promise.reject(new Error('Signature validation failed'));
			}
		})['catch'](function (err) {
			console.log('verifyRequest getTokenFromDb: ', err);
			return Promise.reject(err);
		});
	} else {
		return Promise.reject(new Error('No token found'));
	}
}

function getTokenFromDb(asid) {
	return _dbJs2['default'].search('searchToken', 'searchToken', { q: 'account_sid:' + asid }).then(function (doc) {
		var body = doc.shift();
		var headers = doc.shift();
		var token = undefined;
		var status_code = 'status-code' in headers ? headers['status-code'] : 'statusCode' in headers ? headers['statusCode'] : undefined;

		if (status_code !== 200) return Promise.reject(new Error('DB Search for token returned error'));

		token = _lodash2['default'].result(_lodash2['default'].find(body.rows, 'fields.account_sid', asid), 'fields.auth_token');

		if (token) return Promise.resolve(token);else return Promise.reject(new Error('No token found'));
	})['catch'](function (err) {
		console.log('getTokenFromDb: ', err);
		return Promise.reject(new Error('Failed to get token from DB - ' + err));
	});
}

module.exports = {
	isValidSignature: _verifyRequest
};