'use strict';

const rss = require('./rss');
const CronJob = require('cron').CronJob;

var rssLinks = [
    'https://earthobservatory.nasa.gov/feeds/earth-observatory.rss', 'https://reliefweb.int/updates/rss.xml', 'https://feeds.feedburner.com/LatestMekongRiverCommissionNews',
    'http://www.asianews.it/en.xml', 'http://www.fao.org/emergencies/resources/rss/map-rss/en/', 'http://www.fao.org/asiapacific/news/rss/en/', 
    'http://www.fao.org/emergencies/resources/rss/news-rss/en/', 'https://www.ncei.noaa.gov/news.xml', 'https://feeds.feedburner.com/IWMI-Regional-News', 
    'https://feeds.feedburner.com/IWMI-news'
];

// runs everyday at 11:30
const fetchRSSFeedsJob = new CronJob('00 30 11 * * 0-6', function () {
// every 2 minutes for debugging purpose
//const fetchRSSFeedsJob = new CronJob('*/2 * * * *', function () {
    rss.fetchRSS(rssLinks);
});

var getRSSFeedsJob = function () {
    return fetchRSSFeedsJob;
};

module.exports.getRSSFeedsJob = getRSSFeedsJob;
