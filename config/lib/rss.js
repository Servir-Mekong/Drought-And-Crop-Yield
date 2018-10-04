'use strict';

var Parser = require('rss-parser'),
    parser = new Parser(),
    db = require('./db');

var updateOrInsert = function (title, body, link, created_on) {
    db.any('SELECT id FROM rss_item WHERE link=${link}', {
        link: link
    })
	.then(data => {
        if (data.length === 0) {
            // First time insert
            return db.none('INSERT INTO rss_item(title, body, link, created_on, updated_on) VALUES(${title}, ${body}, ${link}, ${created_on}, ${updated_on})', {
                title: title,
                body: body,
                link: link,
                created_on: created_on,
                updated_on: created_on
            });
        } //else {
            // Update
            // todo: fix this
            /*db.none('UPDATE rss_item SET title=REPLACE(${title}, \'"\', \'\"\'), body=REPLACE(${body}, \'"\', \'\"\'), link=REPLACE(${link}, \'"\', \'\"\'), updated_on={updated_on} WHERE id=${id}', {
                title: title,
                body: body,
                link: link,
                updated_on: new Date(),
                id: parseInt(data[0]['id'])
            });*/
        //}
	})
	.catch(error => {
		console.log('ERROR:', error); // print the error;
	});
};

var fetchSingleRSS = function (url) {
    return parser.parseURL(url)
    .then(response => {
        var items = response.items;
        items.forEach(item => {
            var title = item.title;
            var body = item.description || item.content;
            var link = item.link;
            var created_on = item.pubDate || new Date();
            if (title.toLowerCase().indexOf('drought') !== -1 || body.toLowerCase().indexOf('drought') !== -1) {
                updateOrInsert(title, body, link, created_on);
            }
        });
    })
    .catch(error => {
		console.log('ERROR PARSER:', error); // print the error;
	});
};

var fetchRSS = function (urls) {
    urls.forEach(url => {
        fetchSingleRSS(url);
    });
};

module.exports.fetchRSS = fetchRSS;
