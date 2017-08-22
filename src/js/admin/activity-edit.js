require('../../less/admin/activity-edit.less');

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);

var common = require('./common');

var model = {};
var validId = false;
var photos = [];

$.ajax({
    url: '/api/admin/there/groups',
    success: function(result) {
        var thereGroupItemsTemplate = require('../../template/admin/there-group-items.hbs');
        var thereGroupItemsHtml = thereGroupItemsTemplate(result);

        $('#hta-there-group-select .dropdown-menu').html(thereGroupItemsHtml);

        $('#hta-there-group-select .dropdown-menu a').on('click', function(event) {
            common.addDropdownEvent(event, this);

            $('#hta-there-select .dropdown-title').html('지역');
            $('#hta-there-select .dropdown-menu').empty();
            $('.hta-activity-list').empty();
            delete model.thereId;

            var groupId = $(this).attr('group-id');
            requestTheres(groupId);
        });
    }
});

function requestTheres(groupId) {
    $.ajax({
        url: '/api/admin/there/list',
        data: {
            groupId: groupId
        },
        success: function(result) {
            var thereItemsTemplate = require('../../template/admin/there-items.hbs');
            var thereItemsHtml = thereItemsTemplate(result);

            $('#hta-there-select .dropdown-menu').html(thereItemsHtml);

            $('#hta-there-select .dropdown-menu a').on('click', function(event) {
                common.addDropdownEvent(event, this);

                var thereId = $(this).attr('there-id');
                model.thereId = thereId;
            });
        }
    });
}

$('#hta-activity-photos').on('change', function() {
    if (this.files.length === 0) {
        return;
    }

    for (var i=0; i<this.files.length; i++) {
        var file = this.files[i];

        if (!file.type.startsWith('image/')) {
            continue;
        }

        photos.push(file);

        var fileReader = new FileReader();

        fileReader.onload = function(event) {
            var preview = $('<li></li>');

            preview.css({
                'background-image': 'url(' + event.target.result + ')',
                'width': '50px',
                'height': '50px'
            });

            $('.hta-photos').append(preview);
        };

        fileReader.readAsDataURL(file);
    }
});

$('#hta-activity-id').on('change', function() {
    validId = false;
});

$('.hta-check-duplicate').on('click', function() {
    var id = $('#hta-activity-id').val().trim();

    if (!id) {
        alert('액티비티ID를 입력하세요.');
        $('#hta-activity-id').focus();
        return;
    }
    else if (!/^[a-zA-Z][0-9a-zA-Z\-]{3,}$/.test(id)) {
        alert('잘못된 ID형식입니다.');
        $('#hta-activity-id').focus();
        return;
    }

    $.ajax({
        url: '/api/admin/activity/' + id,
        method: 'OPTIONS',
        success: function(result) {
            if (!result.exists) {
                alert('사용할 수 있는 ID입니다.');
                validId = true;
            }
            else {
                alert('사용할 수 없는 ID입니다.');
                $('#hta-activity-id').focus();
                validId = false;
            }
        }
    });
});