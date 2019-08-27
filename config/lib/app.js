'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
	chalk = require('chalk'),
	db = require('./db'),
	express = require('./express'),
	cronJobs = require('./cron'),
	logging = require('./logging');

chalk.enabled = true;

// Initialize Models
module.exports.init = function init(callback) {

	var app = express.init(db);

	if (callback) {
		callback(app, db, config);
	}

	return null;
};

// Start
module.exports.start = function start(callback) {
	var _this = this;

	_this.init(function (app, db, config) {

		// Start the app by listening on <port> at <host>
		app.listen(config.port, config.host, function () {

			// Logging initialization
			console.log('--');
			logging.console_log('--');
			console.log(chalk.green(config.app.title));
			logging.console_log(config.app.title);
			console.log(chalk.green('Environment: ' + process.env.NODE_ENV));
			logging.console_log('Environment: ' + process.env.NODE_ENV);
			console.log(chalk.green('Port: ' + config.port));
			logging.console_log('Port: ' + config.port);
			console.log(chalk.green('Database: ' + config.db.options.database));
			logging.console_log('Database: ' + config.db.options.database);
			if (process.env.NODE_ENV === 'secure') {
				console.log(chalk.green('HTTPs: on'));
				logging.console_log('HTTPs: on');
			}
			console.log(chalk.green('App version: ' + config.peanjs.version));
			if (config.peanjs['peanjs-version']) {
				console.log(chalk.green('PEAN.JS version: ' + config.peanjs['peanjs-version']));
				logging.console_log('PEAN.JS version: ' + config.peanjs['peanjs-version']);
				console.log('--');
				logging.console_log('--');
			}
			if (callback) callback(app, db, config);
		});
	});

	// Start or Check Cron Job
	const RSSFeedsJob = cronJobs.getRSSFeedsJob();
	if (!RSSFeedsJob.running) {
		// Job is not running
		RSSFeedsJob.start();
		console.log('job started');
	} else {
		console.log('job already started!');
	}
};
