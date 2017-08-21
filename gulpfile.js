'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	defaultAssets = require('./config/assets/default'),
	glob = require('glob'),
	gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	runSequence = require('run-sequence'),
	plugins = gulpLoadPlugins({
		rename: {
			'gulp-angular-templatecache': 'templateCache'
		}
	}),
	pngquant = require('imagemin-pngquant'),
	path = require('path'),
	endOfLine = require('os').EOL,
	argv = require('yargs').argv,
	protractor = require('gulp-protractor').protractor,
	webdriver_update = require('gulp-protractor').webdriver_update,
	webdriver_standalone = require('gulp-protractor').webdriver_standalone,
	KarmaServer = require('karma').Server;

// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
	process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
	process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
	process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
	return plugins.nodemon({
		script: 'server.js',
		nodeArgs: ['--debug'],
		ext: 'js,html',
		watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
	});
});

// Watch Files For Changes
gulp.task('watch', function () {
	// Start livereload
	plugins.livereload.listen();

	// Add watch rules
	gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.server.allJS, ['jshint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.js, ['jshint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.livereload.changed);
	gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.livereload.changed);

	if (process.env.NODE_ENV === 'production') {
		gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'jshint']);
		gulp.watch(defaultAssets.client.views, ['templatecache', 'jshint']).on('change', plugins.livereload.changed);
	} else {
		gulp.watch(defaultAssets.server.gulpConfig, ['jshint']);
		gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
	}
});

// CSS linting task
gulp.task('csslint', function (done) {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.csslint('.csslintrc'))
		.pipe(plugins.csslint.reporter())
		.pipe(plugins.csslint.reporter(function (file) {
			if (!file.csslint.errorCount) {
				done();
			}
		}));
});

// JS linting task
gulp.task('jshint', function () {
	var assets = _.union(
		defaultAssets.server.gulpConfig,
		defaultAssets.server.allJS,
		defaultAssets.client.js
	);

	return gulp.src(assets)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.jshint.reporter('fail'));
});

// JS minifying task
gulp.task('uglify', function () {
	var assets = _.union(
		defaultAssets.client.js,
		defaultAssets.client.templates
	);

	return gulp.src(assets)
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify({
			mangle: false
		}))
		.pipe(plugins.concat('application.min.js'))
		.pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
	return gulp.src(defaultAssets.client.css)
		.pipe(plugins.cssmin())
		.pipe(plugins.concat('application.min.css'))
		.pipe(gulp.dest('public/dist'));
});

// Sass task
gulp.task('sass', function () {
	return gulp.src(defaultAssets.client.sass)
		.pipe(plugins.sass())
		.pipe(plugins.autoprefixer())
		.pipe(plugins.rename(function (file) {
			file.dirname = file.dirname.replace(path.sep + 'scss', path.sep + 'css');
		}))
		.pipe(gulp.dest('./modules/'));
});

// Less task
gulp.task('less', function () {
	return gulp.src(defaultAssets.client.less)
		.pipe(plugins.less())
		.pipe(plugins.autoprefixer())
		.pipe(plugins.rename(function (file) {
			file.dirname = file.dirname.replace(path.sep + 'less', path.sep + 'css');
		}))
		.pipe(gulp.dest('./modules/'));
});

// Imagemin task
gulp.task('imagemin', function () {
	return gulp.src(defaultAssets.client.img)
		.pipe(plugins.imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('public/dist/img'));
});

// Angular template cache task
gulp.task('templatecache', function () {
	var re = new RegExp('\\' + path.sep + 'client\\' + path.sep, 'g');

	return gulp.src(defaultAssets.client.views)
		.pipe(plugins.templateCache('templates.js', {
			root: 'modules/',
			module: 'rheas',
			templateHeader: '(function () {' + endOfLine + '	\'use strict\';' + endOfLine + endOfLine + '	angular' + endOfLine + '		.module(\'<%= module %>\'<%= standalone %>)' + endOfLine + '		.run(templates);' + endOfLine + endOfLine + '	templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + '	function templates($templateCache) {' + endOfLine,
			templateBody: '		$templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
			templateFooter: '	}' + endOfLine + '})();' + endOfLine,
			transformUrl: function (url) {
				return url.replace(re, path.sep);
			}
		}))
		.pipe(gulp.dest('build'));
});

// Karma test runner task
gulp.task('karma', function (done) {
	new KarmaServer({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});

// Downloads the selenium webdriver
gulp.task('webdriver_update', webdriver_update);

// Start the standalone selenium server
// NOTE: This is not needed if you reference the
// seleniumServerJar in your protractor.conf.js
gulp.task('webdriver_standalone', webdriver_standalone);

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
	runSequence('less', 'sass', ['csslint', 'jshint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
	runSequence('env:dev', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project in development mode
gulp.task('default', function (done) {
	runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', function (done) {
	runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
	runSequence('templatecache', 'build', 'env:prod', 'lint', ['nodemon', 'watch'], done);
});
