require('bootstrap');
require('../less/theres.less');

var common = require('./common');
var tab = require('./ht-tab');

var moment = require('moment-timezone');

var URLSearchParams = require('url-search-params');
var params = new URLSearchParams(location.search);
var theresId = params.get('id');

try {
    var model = require('./model/theres/' + theresId);
}
catch (e) {
    var model = require('./model/theres/Guam');
}

$('.ht-section-there').css('background-image',
    'url(' + model.background + ')');
$('.ht-there-name').html(model.name);
$('.ht-there-summary').html(model.summary);

var areaInfoTemplate = require('../template/theres/area-info.hbs');
var areaInfoHtml = areaInfoTemplate(model);

$('.ht-area-info').html(areaInfoHtml);

var areaDatetimeTemplate = require('../template/theres/area-datetime.hbs');
var areaDatetimeHtml = areaDatetimeTemplate({
    time: moment().tz(model.timezone).format('hh:mm'),
    apm: moment().tz(model.timezone).format('a'),
    date: moment().tz(model.timezone).format('YYYY.MM.DD')
});

$('.ht-weather-datetime').html(areaDatetimeHtml);

var lat = model.location.lat;
var lng = model.location.lng;

var apiKey = '162ac90797a6d87292b1b9dd87e80fe7';
var apiUrl = 'http://api.openweathermap.org/data/2.5/weather' +
    '?lat=' + lat + '&lon=' + lng +
    '&appid=' + apiKey +
    '&units=metric' +
    '&callback=?';

apiUrl = 'https://samples.openweathermap.org/data/2.5/weather' +
    '?lat=35&lon=139' +
    '&appid=b1b15e88fa797225412429c1c50c122a1' +
    '&units=metics' +
    '&callback=?';

$.getJSON(apiUrl, function(result) {
    var icon = result.weather[0].icon;
    var degree = result.main.temp;

    var areaForecastTemplate = require('../template/theres/area-forecast.hbs');
    var areaForecastHtml = areaForecastTemplate({
        icon: './img/weather/' + icon + '.svg',
        degree: parseInt(degree)
    });

    $('.ht-weather-forecast').html(areaForecastHtml);
});








