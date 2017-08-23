require('../../less/admin/activity-edit.less');

var _ = require('lodash');
_.move = require('lodash-move').default;

var UrlSearchParams = require('url-search-params');
var params = new UrlSearchParams(location.search);

var common = require('./common');

var model = {
    lists: []
};
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

$('.hta-activity-info-list .hta-add-row').on('click', function() {
    model.lists.push({
        title: '제목',
        type: 'dot',
        items: []
    });

    setInfoLists();
});

function setInfoLists() {
    $('.hta-activity-info tbody').empty();

    var template = require('../../template/admin/activity-info.hbs');

    for (var i=0; i<model.lists.length; i++) {
        model.lists[i].no = i + 1;

        var html = template(model.lists[i]);

        $('.hta-activity-info tbody').append(html);
    }

    addInfoListsEvents();
}

function addInfoListsEvents() {
    addBtnRowEvents();

    $('.hta-activity-info tbody tr').off('dblclick');
    $('.hta-activity-info tbody tr').on('dblclick', function() {
        var row = $(this);
        var rowIndex = $(this).index();
        var info = model.lists[rowIndex];
        var template = require('../../template/admin/activity-info-edit.hbs');
        var html = template(info);

        row.replaceWith(html);

        addBtnRowEvents();
    });

    $('.hta-activity-info tbody tr').off('click');
    $('.hta-activity-info tbody tr').on('click', function() {
        $('.hta-activity-info tbody tr').removeClass('selected');
        $(this).addClass('selected');

        var index = $(this).index();

        require('./activity-info-items')
            .init(model.lists[index].items, function(itemCount) {
                $('.hta-activity-info tbody tr.selected .hta-item-count').text(itemCount);
            });
    });
}

function addBtnRowEvents() {
    $('.hta-activity-info .hta-btn-row').off('click');
    $('.hta-activity-info .hta-btn-row').on('click', function() {
        $('.hta-activity-info-item-list').hide();

        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var info = model.lists[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            info.title = row.find('.hta-activity-info-title').val().trim();
            info.type = row.find('.hta-activity-info-type').val().trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(model.lists, function(value, index) {
                return rowIndex === index;
            });

            setInfoLists();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            model.lists = _.move(model.lists, rowIndex, rowIndex - 1);

            setInfoLists();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= model.lists.length - 1) {
                return;
            }

            model.lists = _.move(model.lists, rowIndex, rowIndex + 1);

            setInfoLists();
            return;
        }

        var template = require('../../template/admin/activity-info.hbs');
        var html = template(info);
        row.replaceWith(html);

        addInfoListsEvents();
    });
}