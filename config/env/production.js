'use strict';

module.exports = {
	log: {
		// logging with Morgan - https://github.com/expressjs/morgan
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: process.env.LOG_FORMAT || 'combined',
		options: {
			// Stream defaults to process.stdout
			// Uncomment/comment to toggle the logging to a log on the file system
			stream: {
				directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
				fileName: process.env.LOG_FILE || 'access.log',
				rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
					active: process.env.LOG_ROTATING_ACTIVE === 'true' ? true : false, // activate to use rotating logs 
					fileName: process.env.LOG_ROTATING_FILE || 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
					frequency: process.env.LOG_ROTATING_FREQUENCY || 'daily',
					verbose: process.env.LOG_ROTATING_VERBOSE === 'true' ? true : false
				}
			}
		}
	},
	port: process.env.PORT || 3000,
	/*secure: {
		ssl: true,
		privateKey: './config/sslcerts/key.pem',
		certificate: './config/sslcerts/cert.pem'
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
	},*/
	db: {
		options: {
			logging: process.env.DB_LOGGING === 'true' ? console.log : false,
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || '5432'
		}
	}
};
