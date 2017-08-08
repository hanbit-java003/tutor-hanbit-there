require('bootstrap');
require('../less/activities.less');

var common = require('./common');
var tab = require('./ht-tab');
var carousel = require('./ht-carousel');

var model = {
    name: '괌 코코팜 가든 비치',
    photos: [
        '../img/activities/guam-dolphin-cruise01.jpg',
        '../img/activities/guam-dive-experience01.jpg',
        '../img/activities/guam-cocopalm-garden-beach01.jpg'
    ],
    video: '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/w68Gr2Wd66I" frameborder="0" allowfullscreen></iframe>',
    location: {
        lat: 13.628359,
        lng: 144.840244
    }
}

function initActivity(model) {
    carousel.init($('.ht-activity-photos'),
        model.photos,
        function(slide) {
            var slideElement = $('<li></li>');
            slideElement.css('background-image', 'url(' + slide + ')');

            return slideElement;
        }, {
            slideDuration: 1000,
            slideInterval: 5000
        });

    if (model.video) {
        $('.ht-activity-video').html(model.video);
    }

    var loadGoogleMapsApi = require('load-google-maps-api-2');

    loadGoogleMapsApi.key = 'AIzaSyAHX_Y_cP2i1v9lchEPJ4yROwzh9nK6of0';
    loadGoogleMapsApi.language = 'ko';
    loadGoogleMapsApi.version = '3';

    var $googleMaps;
    var areaMap;

    loadGoogleMapsApi().then(function(googleMaps) {
        $googleMaps = googleMaps;
        areaMap = new googleMaps.Map($('#ht-activity-map')[0], {
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
}

initActivity(model);