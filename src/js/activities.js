require('bootstrap');
require('eonasdan-bootstrap-datetimepicker');
require('eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css');
require('../less/activities.less');

var moment = require('moment');

var common = require('./common');
var tab = require('./ht-tab');
var carousel = require('./ht-carousel');
var htPrice = require('./ht-price');

var model = {
    name: '괌 코코팜 가든 비치',
    group: {
        nameEn: 'Guam',
        background: '/api/file/there-Guam'
    },
    photos: [
        '../img/activities/guam-dolphin-cruise01.jpg',
        '../img/activities/guam-dive-experience01.jpg',
        '../img/activities/guam-cocopalm-garden-beach01.jpg'
    ],
    video: '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/w68Gr2Wd66I" frameborder="0" allowfullscreen></iframe>',
    location: {
        lat: 13.628359,
        lng: 144.840244
    },
    intro: '자연 그대로의 모습을 간직하고있는 북부 리티디안 비치에서는 투몬비치와는 다른 투명함을 느낄수 있답니다.<br>\n' +
        '리티디안 비치가 험난한 도로 때문에 가기 힘들었다면 코코팜 가든 비치를 방문해보세요.<br>\n' +
        '같은 리티디안에 있는 코코팜 가든은 괌 뚜벅이 여행자도 손쉽게 이용 가능합니다.<br>\n' +
        '깊이 들어가지 않아도 수많은 산호와 물고기를 볼 수 있는, 해변에서 시간을 보내기에 필요한 모든 것이 갖춰져 있는 곳 괌의 지상 낙원입니다.',
    lists: [{
        title: '바우처 안내',
        type: 'icon',
        items: [{
            title: '티켓 형태',
            icon: 'tags',
            text: '예약 확정 E-메일(캡쳐가능)'
        }, {
            title: '발권소요시간',
            icon: 'clock-o',
            text: '24시간(영업일 기준)'
        }]
    }, {
        title: '안내 사항',
        type: 'dot',
        items: [{
            text: '최소 이용 예정 2일 전 예약주셔야 진행이 가능합니다.'
        }, {
            text: '금요일 오후 4시 이후,주말 예약 또한 시스템을 통해 문제 없이 접수됩니다. 다만, 현지 업체가 휴일인 관계로 차주 월요일부터 순차적으로 처리됨을 양해 부탁드립니다.'
        }, {
            text: '본 상품은 자유여행객을 위한 상품으로 타 여행사의 패키지 및 세미 패키지 이용 고객님은 이용하실 수 없습니다.'
        }, {
            text: '예약시 고객님께서 잘못 입력하신 정보(연락처, 이름, 이메일 주소 등) 및 분실에 따른 불이익에 대한 책임을 지지 않습니다.'
        }]
    }, {
        title: '변경 및 환불 규정',
        type: 'dot',
        items: [{
            text: '문의 사항은 영업시간 월-금 09:30 - 18:00(주말 및 공휴일 제외)내에 유선(1661-0882) 또는 카카오톡(ID검색 : @there)으로 요청해 주세요.'
        }, {
            text: '카카오톡(ID검색 : @there) 상담은 월-일 09:30 - 18:30 주말 및 공휴일에도 상담 가능합니다.'
        }, {
            text: '발권 진행 중 변경/환불시 수수료가 부과되거나 변경/환불이 불가할 수 있습니다.'
        }, {
            text: '결제 후 변경/환불에 대해서는 천재지변을 제외하고 취소 수수료가 발생하거나 변경/환불이 불가할 수 있습니다.'
        }, {
            text: '상품 이용 당일 취소나 불참(NO-SHOW)시에도 역시 환불이 불가합니다.'
        }]
    }]
}

function initActivity(model) {
    $('.ht-activity-name').html(model.name);
    $('.ht-activity-in').html('in ' + model.group.nameEn);
    $('.ht-section-activity').css('background-image',
        'url(' + model.group.background + ')');

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

initActivity(model);