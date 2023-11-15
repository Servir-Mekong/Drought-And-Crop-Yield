'use strict';

module.exports = {
    client: {
        css: [
            'air-quality-explorer/static/css/*.css',
        ],
        js: [
            'air-quality-explorer/static/app/*.js',
            'air-quality-explorer/static/app/config/*.js',
            'air-quality-explorer/static/app/controllers/*.js',
            'air-quality-explorer/static/app/services/map.js',
        ],
        views: [
            'air-quality-explorer/templates/*.html',
            'air-quality-explorer/templates/**/*.html',
        ],
        templates: ['static/templates.js']
    },
    server: {
        gulpConfig: ['gulpfile.js']
    }
};
