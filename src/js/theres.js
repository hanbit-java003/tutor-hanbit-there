require('bootstrap');
require('../less/theres.less');

var common = require('./common');
var tab = require('./ht-tab');

var moment = require('moment-timezone');

var URLSearchParams = require('url-search-params');
var params = new URLSearchParams(location.search);
var theresId = params.get('id');

$.ajax({
    url: '/api/there/' + theresId,
    success: function(result) {
        initThere(result);
    }
});

function initThere(model) {
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

    var areaTrafficTemplate = require('../template/theres/area-traffic.hbs');
    var areaTrafficHtml = areaTrafficTemplate(model);

    $('.ht-traffic-list').html(areaTrafficHtml);

    var loadGoogleMapsApi = require('load-google-maps-api-2');

    loadGoogleMapsApi.key = 'AIzaSyAHX_Y_cP2i1v9lchEPJ4yROwzh9nK6of0';
    loadGoogleMapsApi.language = 'ko';
    loadGoogleMapsApi.version = '3';

    var $googleMaps;
    var areaMap;

    loadGoogleMapsApi().then(function(googleMaps) {
        $googleMaps = googleMaps;
        areaMap = new googleMaps.Map($('#ht-area-map')[0], {
            center: model.location,
            scrollwheel: false,
            zoom: 12
        });
        var marker = new googleMaps.Marker({
            position: model.location,
            map: areaMap,
            title: '여기가 ' + model.name
        });
    }).catch(function(error) {
        console.error(error);
    });

    tab.setCallback(2, function() {
        $googleMaps.event.trigger(areaMap, 'resize');
        areaMap.panTo(model.location);
    });

    $('.ht-area-name').text(model.nameEn);
}

var activities = require('./model/theres/' + theresId + '-activities');
var activityTemplate = require('../template/ht-activity.hbs');

for (var i=0; i<activities.length; i++) {
    var activityModel = activities[i];
    var activityHtml = activityTemplate(activityModel);

    $('.ht-activities-list').append(activityHtml);
}














