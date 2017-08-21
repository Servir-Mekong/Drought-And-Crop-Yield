'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
	log: {
		// logging with Morgan - https://github.com/expressjs/morgan
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'dev',
		options: {
			// Stream defaults to process.stdout
			// Uncomment/comment to toggle the logging to a log on the file system
			stream: {
			  directoryPath: process.cwd(),
			  fileName: 'access.log',
			//  rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
			//    active: false, // activate to use rotating logs 
			//    fileName: 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
			//    frequency: 'daily',
			//    verbose: false
			//  }
			}
		}
	},
	app: {
		title: defaultEnvConfig.app.title + ' - Development Environment'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	},
	livereload: true,
	db: {
		options: {
			logging: process.env.DB_LOGGING === 'true' ? console.log : false,
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || '5432'
		}
	}
};
