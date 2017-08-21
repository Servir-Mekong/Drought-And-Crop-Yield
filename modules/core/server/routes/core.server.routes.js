'use strict';

module.exports = function (app) {
	// Root routing
	var core = require('../controllers/core.server.controller');

	// Define error pages
	app.route('/server-error').get(core.renderServerError);

	// Return a 404 for all undefined api, module or lib routes
	app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

	// Define application route
	app.route('/*').get(core.renderIndex);

	// APIs
	app.route('/drought-index=:droughtIndex?&soil-index=:soilIndex?&energy-balance=:energyBalance?&water-balance=:waterBalance?&fdate=:fdate?').post(core.getData);

	app.route('/action=graph-data&drought-index=:droughtIndex?&soil-index=:soilIndex?&energy-balance=:energyBalance?&water-balance=:waterBalance?&fdate=:fdate?').post(core.getGraphData);
};
