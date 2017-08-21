'use strict';

var validator = require('validator'),
	path = require('path'),
	db = require(path.resolve('./config/lib/pg-promise')),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

	res.render('modules/core/server/views/index');
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
	res.status(500).render('modules/core/server/views/500', {
		error: 'Oops! Something went wrong...'
	});
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

	res.status(404).format({
		'text/html': function () {
			res.render('modules/core/server/views/404', {
				url: req.originalUrl
			});
		},
		'application/json': function () {
			res.json({
				error: 'Path not found'
			});
		},
		'default': function () {
			res.send('Path not found');
		}
	});
};

exports.getData = function (req, res) {

	var params = req.params;
	var body = req.body;

	var table = body.table || "mekong"; // Default filter
	var id = body.id;
	var iso = body.iso;
	var name = body.name;
	var drawWKT = body.drawWKT || body.drawFileWKT;

	// URL Parameters
	var droughtIndex = params.droughtIndex;
	var soilIndex = params.soilIndex;
	var energyBalance = params.energyBalance;
	var waterBalance = params.waterBalance;
	var _fdate = params.fdate;
	var fdate_split = _fdate.split("-");
	var fdate = fdate_split[0] + "-" + ("0" + fdate_split[1]).slice(-2) + "-" + ("0" + fdate_split[2]).slice(-2);
	var fdate_formatted = fdate.replace(/[-]+/g, "");
	var fdateObj = new Date(fdate_split[0], fdate_split[1] - 1, fdate_split[2]);
	var tableName = droughtIndex + "_esp_" + fdate_formatted;
	//var tableName = "forecast_esp_lmr_20170703.spi1"
	//var tableName = scope + droughtIndex + "_esp_" + fdate_formatted;
	//var tableName = "spi1_esp_20170101";
	var schemaName = "forecast_esp_lmr_20170703";
	//var schemaName = "public";

	console.log(droughtIndex, soilIndex, energyBalance, waterBalance, fdate);
	var clippingGeomQuery = "";
	if (drawWKT) {
		clippingGeomQuery = "(SELECT ST_GeomFromText('" + drawWKT + "', 4326) as geom)";
	} else if (id) {
		clippingGeomQuery = "(SELECT * FROM " + table + " WHERE iso='" + iso + "' and id=" + id + ")";
	} else if (name) {
		clippingGeomQuery = "(SELECT * FROM " + table + " WHERE iso='" + iso + "' and name='" + name + "')";
	} else {
		clippingGeomQuery = "(SELECT * FROM " + table + ")";
	}

	db.task(t => {
		return t.one("SELECT EXISTS (SELECT 1 FROM information_schema.tables " +
			"WHERE table_schema='web_output' AND table_name='" + tableName + "');")
			.then(exists => {
				if (!exists.exists) {
					console.log("table not exists");
					var query = "CREATE TABLE web_output." + tableName + " AS (SELECT rid, rast FROM " + schemaName + "." + droughtIndex + " WHERE fdate='" + fdate + "' AND ensemble = 1)";
					t.none(query);
				}
				return t.one(
					"SELECT row_to_json(fc) " +
 " FROM ( " +
  " SELECT 'FeatureCollection' as type, array_to_json(array_agg(feats)) as features " +
   " FROM (SELECT 'Feature' as type, st_asgeojson((gv).geom)::json as geometry, row_to_json((SELECT props FROM (SELECT(gv).val as value) as props)) as properties " +
		" FROM ( " +
		 " SELECT val, geom " +
		 " FROM ( " +
			" SELECT(ST_DumpAsPolygons(clipped_rast)).* " +
			" FROM( " +
			 " SELECT ST_Clip(rast, clipping_geom) AS clipped_rast " +
			 " FROM ( " +
			   " SELECT a.rast as rast, ST_MakeValid(b.geom) as clipping_geom " +
			   " FROM web_output. " + tableName + " a, " + clippingGeomQuery + " as b " +
			 " ) as foo " +
			" ) as bar " +
          " ORDER BY val " +
		 " ) as foobar " +
		" ) as gv " +
	" ) as feats " +
") as fc;"
);
			});
	})
		.then(data => {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});
};

exports.getGraphData = function (req, res) {

	var params = req.params;
	var droughtIndex = params.droughtIndex;
	var soilIndex = params.soilIndex;
	var energyBalance = params.energyBalance;
	var waterBalance = params.waterBalance;
	var _fdate = params.fdate;
	var fdate_split = _fdate.split("-");
	var fdate = fdate_split[0] + "-" + ("0" + fdate_split[1]).slice(-2) + "-" + ("0" + fdate_split[2]).slice(-2);
	var schemaName = "forecast_esp_lmr_20170703";

	console.log(droughtIndex, soilIndex, energyBalance, waterBalance, fdate);
	db.any(
		"SELECT row_to_json(foo) FROM ( " +
		 " SELECT fdate As _date, (ST_SummaryStats(rast)).mean As _average " +
		 "  FROM " + schemaName + "." + droughtIndex +
		 " WHERE ensemble = 1 ORDER BY fdate ASC) As foo;")
		.then(function (data) {
			// success
			res.setHeader("Content-Type", "application/json");
			res.send(JSON.stringify(data));
		})
		.catch(error => {
			console.log('ERROR:', error); // print the error;
			console.log('ERROR');
		});

};
