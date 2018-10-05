'use strict';

var config = require('../config'),
	promise = require('bluebird');

var options = {
	promiseLib: promise
};

var pgp = require('pg-promise')(options);

var dbconfig = {
	database: config.db.options.database,
	host: config.db.options.host,
	user: config.db.options.username,
	password: config.db.options.password,
	port: config.db.options.port,
	//poolSize : 10, // max number of clients in the pool 
	//poolIdleTimeout : 300000, // how long a client is allowed to remain idle before being closed: 5 mins
};

var db = pgp(dbconfig);

module.exports = db;
