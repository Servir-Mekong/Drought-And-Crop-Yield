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

var findSchemaFromDate = function (date) {

	var _schemaList = [];
	return db.one('SELECT array_to_json(array_agg(row_to_json(t))) FROM ( SELECT nspname FROM pg_catalog.pg_namespace ) t;')
	.then(function (data) {
		// success
		for (var i = 0; i < data.array_to_json.length; i++) {
			var nspname = data.array_to_json[i].nspname;
			if (nspname.startsWith('nowcast') || nspname.startsWith('forecast_nmme') || nspname.startsWith('forecast_esp')) {
				_schemaList.push(nspname);
			}
		}

		for (var i = 0; i < _schemaList.length; i++) { // jshint ignore:line
			var splitSchema = _schemaList[i].split("_");
			var dateString = splitSchema[splitSchema.length - 1];

			if (dateString.slice(0, 4) === '1981' && new Date(parseInt(dateString.slice(0, 4)) + 1, parseInt(dateString.slice(4, 6)) + 10, parseInt(dateString.slice(6, 8)) + 29) >= date) {

				return _schemaList[i];

			} else if (new Date(parseInt(dateString.slice(0, 4)) + 2, parseInt(dateString.slice(4, 6)) + 10, parseInt(dateString.slice(6, 8)) + 29) >= date) {

				return _schemaList[i];

			}
		}

	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
		console.log('ERROR');
	});
};

var isInArray = function (array, item) {

	return array.indexOf(item) > -1;

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

	var whereClause = "date='" + fdate + "'";

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
				"SELECT a." + column + " as rast, ST_MakeValid(b.geom) as clipping_geom FROM ( " +
				"SELECT " + column + " FROM " + tableName + " WHERE " + whereClause + " ) as a, " +
				clippingGeomQuery + " as b ) as foo ) as bar ORDER BY val ) as foobar ) as gv ) as feats ) as fc;"
			);
		} else {
			return t.one(
				"SELECT row_to_json(fc) as data " + 
				"FROM ( SELECT 'FeatureCollection' as type, array_to_json(array_agg(feats)) as features " +
				"FROM ( SELECT 'Feature' as type, st_asgeojson((gv).geom)::json as geometry, " + 
				"row_to_json((SELECT props FROM (SELECT (gv).val as value) as props )) as properties " +
				"FROM ( SELECT val, geom FROM ( SELECT (ST_DumpAsPolygons( " + column  + ")).*" +
				"FROM " + tableName + " WHERE " + whereClause + " ) As foo ORDER BY val ) as gv ) as feats ) as fc;"
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
			"FROM ( SELECT date, (ST_SummaryStats(" + column + ")) as stats FROM baseflow ORDER BY date ASC ) As foo ) As foobar;"
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

exports.getMethodData = function (req, res) {

	var params = req.params;

	// URL Parameters
	var tableName = params.index;
	var _fdate = params.date;
	var fdate_split = _fdate.split("-");
	var fdate = fdate_split[0] + "-" + ("0" + fdate_split[1]).slice(-2) + "-" + ("0" + fdate_split[2]).slice(-2);

	var whereClause = "date='" + fdate + "'";

	db.task(t => {
		return t.any(
			"SELECT from_nowcast, from_nmme FROM " + tableName + " WHERE " + whereClause + " LIMIT 1;"
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

