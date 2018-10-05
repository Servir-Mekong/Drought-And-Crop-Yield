'use strict';

/**
 * Module dependencies.
 */
var bodyParser = require('body-parser'),
	compress = require('compression'),
	config = require('../config'),
	consolidate = require('consolidate'),
	express = require('express'),
	favicon = require('serve-favicon'),
	helmet = require('helmet'),
	logger = require('./logger'),
	methodOverride = require('method-override'),
	morgan = require('morgan'),
	path = require('path'),
	session = require('express-session');

/**
 * Initialize local variables
 * 
 */
module.exports.initLocalVariables = function (app) {
	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	if (config.secure && config.secure.ssl === true) {
		app.locals.secure = config.secure.ssl;
	}
	app.locals.keywords = config.app.keywords;
	app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
	app.locals.jsFiles = config.files.client.js;
	app.locals.cssFiles = config.files.client.css;
	app.locals.livereload = config.livereload;
	app.locals.logo = config.logo;
	app.locals.favicon = config.favicon;

	// Passing the request url to environment locals
	app.use(function (req, res, next) {
		res.locals.host = req.protocol + '://' + req.hostname;
		res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
		next();
	});
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
	// Showing stack errors
	app.set('showStackError', true);

	// Enable jsonp
	app.enable('jsonp callback');

	// Should be placed before express.static
	app.use(compress({
		filter: function (req, res) {
			return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Initialize favicon middleware
	app.use(favicon(app.locals.favicon));

	// Enable logger (morgan)
	app.use(morgan(logger.getFormat(), logger.getOptions()));

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true,
		limit: "10mb"
	}));
	app.use(bodyParser.json({
		limit: "10mb"
	}));
	app.use(methodOverride());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
	// Set swig as the template engine
	app.engine('server.view.html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {

	// Express session storage
	const dbURI = 'postgres://' + config.db.options.username + ':' + config.db.options.password + '@' + config.db.options.host + ':' + config.db.options.port + '/' + config.db.options.database;
	const pgSession = require('connect-pg-simple')(session);
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		cookie: {
			maxAge: config.sessionCookie.maxAge,
			httpOnly: config.sessionCookie.httpOnly,
			secure: config.sessionCookie.secure && config.secure.ssl
		},
		key: config.sessionKey,
		store: new pgSession({ conString: dbURI })
	}));
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {

	// Use helmet to secure Express headers
	var SIX_MONTHS = 15778476000;
	app.use(helmet.frameguard());
	app.use(helmet.xssFilter());
	app.use(helmet.noSniff());
	app.use(helmet.ieNoOpen());
	app.use(helmet.hsts({
		maxAge: SIX_MONTHS,
		includeSubdomains: true,
		force: true
	}));
	app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {

	// Setting the app router and static folder
	app.use('/', express.static(path.resolve('./public')));
	app.use('/languages', express.static(path.resolve('./languages')));

	// Globbing static routing
	config.folders.client.forEach(function (staticPath) {
		app.use(staticPath, express.static(path.resolve('./' + staticPath)));
	});
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
	// Globbing routing files
	config.files.server.routes.forEach(function (routePath) {
		require(path.resolve(routePath))(app);
	});
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {

	app.use(function (err, req, res, next) {
		// If the error object doesn't exists
		if (!err) {
			return next();
		}

		// Log it
		console.error(err.stack);

		// Redirect to error page
		res.redirect('/server-error');
	});
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {

	// Load the Socket.io configuration
	var server = require('./socket.io')(app, db);

	// Return server object
	return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {

	// Initialize express app
	var app = express();

	// Initialize local variables
	this.initLocalVariables(app);

	// Initialize Express middleware
	this.initMiddleware(app);

	// Initialize Express view engine
	this.initViewEngine(app);

	// Initialize Helmet security headers
	this.initHelmetHeaders(app);

	// Initialize modules static client routes, before session!
	this.initModulesClientRoutes(app);

	// Initialize Express session
	// Enable when using sessions
	//this.initSession(app, db);

	// Initialize modules server routes
	this.initModulesServerRoutes(app);

	// Initialize error routes
	this.initErrorRoutes(app);

	// Configure Socket.io
	app = this.configureSocketIO(app, db);

	return app;
};
