require('../../less/admin/there-info-edit.less');

var _ = require('lodash');
_.move = require('lodash-move').default;

var common = require('./common');
var tab = require('./tab');

var model = {
    background: './img/theres/Guam.jpg',
    name: '괌',
    nameEn: 'Guam',
    summary: '남태평양 푸른 바다의 넘실거림을 보고있자니<br>어제가 오늘인 듯, 오늘이 어제인 듯 시간의 흐름이 느껴지지 않는곳, 괌',
    timezone: 'Pacific/Guam',
    location: {
        lat: 13.444304,
        lng: 144.793732
    },
    areaInfo: [{
        title: '언어',
        value: '영어'
    }, {
        title: '화폐',
        value: '달러(USD, Doller)'
    }, {
        title: '비자',
        value: '45일 미만 무비자 체류'
    }, {
        title: 'TIP',
        value: '110v이므로 변환플러그(돼지코)가 필요'
    }],
    traffics: [{
        title: '레드 괌 셔틀 버스',
        icon: 'bus',
        contents: '주요 호텔과 쇼핑센터는 물론 유명 레스토랑까지 노선에 포함돼 있어 유용하다.'
    }, {
        title: '택시 Taxi',
        icon: 'taxi',
        contents: '호텔이나 쇼핑센터 같은 지정된 지점에서 탑승. 팁은 요금의 10%면 적당'
    }, {
        title: '투몬 셔틀 버스',
        icon: 'bus',
        contents: '투몬과 타무닝 지역을 연결하며 북부, 남부노선이 있고 약 8분 간격 운행'
    }, {
        title: '렌트카 Rent-a-Car',
        icon: 'car',
        contents: '괌 자유여행자들에게 최고의 교통수단이다. 그러다보니, 여행 전 예약해서 준비해둘것.'
    }, {
        title: '갤러리아 무료 셔틀 버스',
        icon: 'bus',
        contents: '투몬 지역과 타무닝 지역의 주요 호텔을 3개의 노선이 운행'
    }]
};

$.ajax({
    url: '/api/admin/there/groups',
    success: function(result) {
        var thereGroupItemsTemplate = require('../../template/admin/there-group-items.hbs');
        var thereGroupItemsHtml = thereGroupItemsTemplate(result);

        $('#hta-there-group-select .dropdown-menu').html(thereGroupItemsHtml);

        $('#hta-there-group-select .dropdown-menu a').on('click', function(event) {
            common.addDropdownEvent(event, this);
        });
    }
});

$('#hta-there-background').on('change', function() {
    if (this.files.length === 0) {
        return;
    }

    for (var i=0; i<this.files.length; i++) {
        var file = this.files[i];

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일이 아닙니다.');
            return;
        }
    }

    var fileReader = new FileReader();

    fileReader.onload = function(event) {
        $('#hta-there-background-preview')
            .css({
                'background-image': 'url(' + event.target.result + ')',
                'height': '250px'
            });
    };

    fileReader.readAsDataURL(this.files[0]);
});

function setAreaInfo() {
    $('.hta-area-info tbody').empty();

    var template = require('../../template/admin/there-info.hbs');
    var areaInfo = model.areaInfo;

    for (var i=0; i<areaInfo.length; i++) {
        areaInfo[i].no = i + 1;

        var html = template(areaInfo[i]);

        $('.hta-area-info tbody').append(html);
    }

    addAreaInfoEvents();
}

function addAreaInfoEvents() {
    addBtnRowEvents();

    $('.hta-area-info tbody tr').off('dblclick');
    $('.hta-area-info tbody tr').on('dblclick', function() {
        var row = $(this);
        var rowIndex = $(this).index();
        var info = model.areaInfo[rowIndex];
        var template = require('../../template/admin/there-info-edit.hbs');
        var html = template(info);

        row.replaceWith(html);

        addBtnRowEvents();
    });
}

function addBtnRowEvents() {
    $('.hta-btn-row').off('click');
    $('.hta-btn-row').on('click', function() {
        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var info = model.areaInfo[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            info.title = row.find('.hta-area-info-title').val().trim();
            info.value = row.find('.hta-area-info-value').val().trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(model.areaInfo, function(value, index) {
                return rowIndex === index;
            });

            setAreaInfo();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            model.areaInfo = _.move(model.areaInfo, rowIndex, rowIndex - 1);

            setAreaInfo();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= model.areaInfo.length - 1) {
                return;
            }

            model.areaInfo = _.move(model.areaInfo, rowIndex, rowIndex + 1);

            setAreaInfo();
            return;
        }

        var template = require('../../template/admin/there-info.hbs');
        var html = template(info);
        row.replaceWith(html);

        addAreaInfoEvents();
    });
}

function setTraffics() {
    var template = require('../../template/admin/there-traffic.hbs');
    var traffics = model.traffics;

    for (var i=0; i<traffics.length; i++) {
        traffics[i].no = i + 1;

        var html = template(traffics[i]);

        $('.hta-traffics tbody').append(html);
    }
}

setAreaInfo();
setTraffics();














