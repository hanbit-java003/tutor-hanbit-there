require('../../less/admin/there-info-edit.less');

var _ = require('lodash');
_.move = require('lodash-move').default;

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);

var common = require('./common');
var tab = require('./tab');

var groups = [];

var model = {
    location: {},
    areaInfo: [],
    traffics: []
};

// 개발용도로만 사용
window.printModel = function() {
    var json = JSON.stringify(model);
    var obj = JSON.parse(json);
    console.log(obj);
};

$.ajax({
    url: '/api/admin/there/groups',
    success: function(result) {
        groups = result;
        var thereGroupItemsTemplate = require('../../template/admin/there-group-items.hbs');
        var thereGroupItemsHtml = thereGroupItemsTemplate(result);

        $('#hta-there-group-select .dropdown-menu').html(thereGroupItemsHtml);

        $('#hta-there-group-select .dropdown-menu a').on('click', function(event) {
            common.addDropdownEvent(event, this);

            model.groupId = $(this).attr('group-id');
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

$('.hta-save').on('click', function() {
    model.id = $('#hta-there-id').val().trim();
    model.name = $('#hta-there-name').val().trim();
    model.nameEn = $('#hta-there-name-en').val().trim();
    model.timezone = $('#hta-there-timezone').val().trim();
    model.summary = $('#hta-there-summary').val().trim();
    model.location.lat = $('#hta-there-lat').val().trim();
    model.location.lng = $('#hta-there-lng').val().trim();

    if (!model.groupId) {
        alert('지역그룹을 선택하세요.');
        return;
    }
    else if (!model.id) {
        alert('지역ID를 입력하세요.');
        $('#hta-there-id').focus();
        return;
    }
    else if (!model.name) {
        alert('지역명을 입력하세요.');
        $('#hta-there-name').focus();
        return;
    }
    else if (!model.nameEn) {
        alert('영문지역명을 입력하세요.');
        $('#hta-there-name-en').focus();
        return;
    }
    else if (!model.timezone) {
        alert('시간대를 입력하세요.');
        $('#hta-there-timezone').focus();
        return;
    }
    else if (!model.summary) {
        alert('요약설명을 입력하세요.');
        $('#hta-there-summary').focus();
        return;
    }
    else if (!model.location.lat) {
        alert('위도를 입력하세요.');
        $('.hta-tab-header li[tab-id=location]').click();
        $('#hta-there-lat').focus();
        return;
    }
    else if (!model.location.lng) {
        alert('경도를 입력하세요.');
        $('.hta-tab-header li[tab-id=location]').click();
        $('#hta-there-lng').focus();
        return;
    }

    for (var i=0; i<model.areaInfo.length; i++) {
        if (!model.areaInfo[i].title) {
            alert('정보의 제목을 입력하세요.');
            return;
        }
        else if (!model.areaInfo[i].value) {
            alert('정보의 내용을 입력하세요.');
            return;
        }
    }

    for (var i=0; i<model.traffics.length; i++) {
        if (!model.traffics[i].icon) {
            alert('교통편의 아이콘을 입력하세요.');
            return;
        }
        else if (!model.traffics[i].title) {
            alert('교통편의 제목을 입력하세요.');
            return;
        }
        else if (!model.traffics[i].contents) {
            alert('교통편의 내용을 입력하세요.');
            return;
        }
    }
});

function init() {
    var group = _.find(groups, function(group) {
        return group.id === model.groupId;
    });

    if (group) {
        $('#hta-there-group-select .dropdown-title').html(group.name);
        $('#hta-there-group-select .dropdown-toggle').attr('disabled', true);
    }

    var id = model.id;

    if (id) {
        $('#hta-there-id').val(id);
        $('#hta-there-id').attr('disabled', true);
        $('.hta-check-duplicate').hide();
    }

    $('#hta-there-name').val(model.name);
    $('#hta-there-name-en').val(model.nameEn);
    $('#hta-there-timezone').val(model.timezone);
    $('#hta-there-summary').val(model.summary);

    model.location = model.location || {};

    $('#hta-there-lat').val(model.location.lat);
    $('#hta-there-lng').val(model.location.lng);

    var thereInfoTab = require('./there-info-tab');
    thereInfoTab.init(model.areaInfo);

    var thereTrafficTab = require('./there-traffic-tab');
    thereTrafficTab.init(model.traffics);
}

if (!params.get('id')) {
    init();
}
else {
    $.ajax({
        url: '/api/there/' + params.get('id'),
        success: function(result) {
            model = result;
            init();
        }
    });
}












