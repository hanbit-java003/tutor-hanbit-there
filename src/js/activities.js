require('bootstrap');
require('eonasdan-bootstrap-datetimepicker');
require('eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');
require('../less/activities.less');

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);
var moment = require('moment');

var common = require('./common');
var tab = require('./ht-tab');
var carousel = require('./ht-carousel');
var htPrice = require('./ht-price');

function initActivity(model) {
    $('.ht-activity-name').html(model.name);
    $('.ht-activity-in').html('in ' + model.there.nameEn);
    $('.ht-section-activity').css('background-image',
        'url(' + model.there.background + ')');

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

    $('.ht-activity-intro-text').html(model.intro);

    var listTemplate = require('../template/activities/info-list.hbs');

    for (var i=0; i<model.lists.length; i++) {
        var listHtml = listTemplate(model.lists[i]);

        $('.ht-activity-info-text').append(listHtml);
    }

    tab.setCallback(function(tabId) {
        if (tabId === 'map') {
            $googleMaps.event.trigger(areaMap, 'resize');
            areaMap.panTo(model.location);
        }
    });

    $('#ht-datepicker').datetimepicker({
        inline: true,
        locale: 'ko',
        dayViewHeaderFormat: 'YYYY년 MMMM',
        format: 'YYYYMMDD',
        useCurrent: false,
        minDate: moment().add(1, 'days').startOf('day'),
        maxDate: moment().add(2, 'months').endOf('month'),
        disabledDates: ['20170815']
    });

    $('#ht-datepicker').on('dp.change', function(event) {
        $('.ht-booking-datepick-msg').hide();
        $('.ht-booking-options-box').show();
    });

    $('#ht-booking-option-1 .ht-options > li').on('click', function() {
        $('.ht-price-box').removeClass('disabled');

        htPrice.setUpdateListener(function() {
            var total = 0;
            var modelIds = ['adult', 'kid', 'baby'];

            modelIds.forEach(function(modelId) {
                var model = htPrice.getModel(modelId);

                if (!model) {
                    return;
                }

                total += model.count * model.price;
            });

            var point = parseInt(total * 0.02);

            $('.ht-booking-price-total .total').text('₩' + total.toLocaleString());
            $('.ht-booking-price-point .point').html(point.toLocaleString() + '<span>P</span>');
        });

        htPrice.setModel('adult', {
            count: 1,
            price: 32340
        });
        htPrice.setModel('kid', {
            count: 0,
            price: 12540
        });
        htPrice.setModel('baby', {
            count: 0,
            price: 0
        });
    });
}

function init(id) {
    $.ajax({
        url: '/api/activity/' + id,
        success: function(result) {
            initActivity(result);
        }
    });
}

init(params.get('id'));