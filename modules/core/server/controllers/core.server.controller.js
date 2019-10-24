'use strict';

var validator = require('validator'),
	path = require('path'),
	db = require(path.resolve('./config/lib/db')),
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

exports.getMapData = function (req, res) {

	var params = req.params;
	var body = req.body;

	// Body Parameters
	var from = body.from;
	var country = body.country;
	var gid = body.gid;
	var name = body.name;
	var wkt = body.wkt;

	// URL Parameters
	var tableName = params.index;
	var fdate = params.date;
	var dateObject = new Date(fdate);
	var timeFrequency = params.timeFrequency;
	var whereClause = "";
	if (timeFrequency === '5day') {
		dateObject.setDate(dateObject.getDate() + 4);
		var mm = dateObject.getMonth() + 1; // getMonth() is zero-based
		var dd = dateObject.getDate();
		var endDate = [ dateObject.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd ].join('-');
		whereClause = "date>='" + fdate + "' and date<='" + endDate + "'";
	} else if (timeFrequency === '10day') {
		dateObject.setDate(dateObject.getDate() + 9);
		var m = dateObject.getMonth() + 1; // getMonth() is zero-based
		var d = dateObject.getDate();
		var finalDate = [ dateObject.getFullYear(), (m > 9 ? '' : '0') + m, (d > 9 ? '' : '0') + d ].join('-');
		whereClause = "date>='" + fdate + "' and date<='" + finalDate + "'";
	} else {
		whereClause = "date>='" + fdate + "' and date<='" + fdate + "'";
	}

	// schema name
	var schemaName = 'new_25km_lmr';

	var clippingGeomQuery = "";
	if (wkt) {
		clippingGeomQuery = "(SELECT ST_GeomFromText('" + wkt + "', 4326) as geom)";
	} else if (gid) {
		if (country) {
			clippingGeomQuery = "(SELECT geom FROM " + from + " WHERE country = '" + country + "' AND __gid=" + gid + " LIMIT 1)";
		} else {
			clippingGeomQuery = "(SELECT geom FROM " + from + " WHERE gid=" + gid + " LIMIT 1)";
		}
	}

	var column = "raster";
	if (from === "country") {
		column += "_" + name.toLowerCase();
	} else if (["admin1", "admin2"].indexOf(from) > -1) {
		column += "_" + country;
	}
	
	db.task(t => {
		if (clippingGeomQuery) {
			return t.one(
				"SELECT row_to_json(fc) as data " +
				"FROM ( SELECT 'FeatureCollection' as type, array_to_json(array_agg(feats)) as features " +
				"FROM (SELECT 'Feature' as type, st_asgeojson((gv).geom)::json as geometry, " +
				"row_to_json((SELECT props FROM (SELECT round(((gv).val)::numeric, 2) as value) as props)) as properties " +
				"FROM ( SELECT val, geom FROM ( SELECT(ST_DumpAsPolygons(clipped_rast)).* FROM( " +
				"SELECT ST_Clip(rast, clipping_geom) AS clipped_rast FROM ( " +
				"SELECT a.st_union as rast, ST_MakeValid(b.geom) as clipping_geom FROM ( " +
				"SELECT ST_UNION(" + column + ", 'MEAN') FROM " + schemaName + "." + tableName + " WHERE " + whereClause + " ) as a, " +
				clippingGeomQuery + " as b ) as foo ) as bar ORDER BY val ) as foobar ) as gv ) as feats ) as fc;"
			);
		} else {
			return t.one(
				"SELECT row_to_json(fc) as data " + 
				"FROM ( SELECT 'FeatureCollection' as type, array_to_json(array_agg(feats)) as features " +
				"FROM ( SELECT 'Feature' as type, st_asgeojson((gv).geom)::json as geometry, " + 
				"row_to_json((SELECT props FROM (SELECT (gv).val as value) as props )) as properties " +
				"FROM ( SELECT val, geom FROM ( SELECT (ST_DumpAsPolygons( ST_UNION(" + column + ", 'MEAN'))).* " +
				"FROM " + schemaName + "." + tableName + " WHERE " + whereClause + " ) As foo ORDER BY val ) as gv ) as feats ) as fc;"
			);
		}
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
	var body = req.body;

	// Body Parameters
	var from = body.from;
	var country = body.country;
	var name = body.name;
	var graphParameter = body.graphParameter;

	// schema name
	var schemaName = 'new_25km_lmr';

	// URL Parameters
	var tableName = params.index;

	var column = "raster";
	if (from === "country") {
		column += "_" + name.toLowerCase();
	} else if (["admin1", "admin2"].indexOf(from) > -1) {
		column += "_" + country;
	}

	db.task(t => {
		return t.any(
			"SELECT row_to_json(foobar) As data " +
			" FROM ( SELECT foo.date as date, round((stats).mean::numeric, 3) as mean, round((stats).min::numeric, 3) as min, " + 
			"round((stats).max::numeric, 3) as max, round((stats).stddev::numeric, 3) as stddev " +
			"FROM ( SELECT date, (ST_SummaryStats(" + column + ")) as stats FROM " + schemaName + "." + tableName + " ORDER BY date ASC ) As foo ) As foobar;"
		);
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

exports.getRSSFeeds = function (req, res) {

	db.any("SELECT json_build_object('title', title, 'body', body, 'link', link, 'datetime', updated_on) AS data FROM rss_item ORDER BY updated_on DESC LIMIT 25;")
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

exports.getDownloadData = function (req, res) {

	var params = req.params;
	// URL Parameters
	var tableName = params.index;
	var fdate = params.date;

	// schema name
	var schemaName = 'new_25km_lmr';

	var whereClause = "date='" + fdate + "'";

	db.task(t => {
		return t.any(
			"SELECT from_nowcast, from_forecast FROM " + schemaName + "." + tableName + " WHERE " + whereClause + " LIMIT 1;"
		);
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
