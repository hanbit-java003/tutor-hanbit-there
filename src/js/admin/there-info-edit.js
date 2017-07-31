require('../../less/admin/there-info-edit.less');

var _ = require('lodash');
_.move = require('lodash-move').default;

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);

var common = require('./common');
var tab = require('./tab');

var model = {
    location: {},
    areaInfo: [],
    traffics: []
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

function init() {
    var id = params.get('id');

    $('#hta-there-id').val(id);

    if (id) {
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












