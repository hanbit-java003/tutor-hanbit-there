require('../../less/admin/there-info.less');
var _ = require('lodash');

var common = require('./common');

var thereList = [];

$.ajax({
    url: '/api/admin/there/groups',
    success: function(result) {
        var thereGroupItemsTemplate = require('../../template/admin/there-group-items.hbs');
        var thereGroupItemsHtml = thereGroupItemsTemplate(result);

        $('#hta-there-group-select .dropdown-menu').html(thereGroupItemsHtml);

        $('#hta-there-group-select .dropdown-menu a').on('click', function(event) {
            common.addDropdownEvent(event, this);

            var groupId = $(this).attr('group-id');
            requestList(groupId);
        });
    }
});

function requestList(groupId) {
    $.ajax({
        url: '/api/admin/there/list',
        data: {
            groupId: groupId
        },
        success: function(result) {
            thereList = result;

            setList(result);
        }
    });
}

function setList(theres) {
    var theresTemplate = require('../../template/admin/theres.hbs');
    var theresHtml = theresTemplate(theres);

    $('.hta-there-list').html(theresHtml);
}

$('#hta-there-search-input').on('paste cut', function(event) {
    setTimeout(search, 100);
});

$('#hta-there-search-input').on('keyup', function(event) {
    switch (event.keyCode) {
        case 27:    // esc
            $('#hta-there-search-input').val('');
        case 8:     // backspace
        case 46: {  // delete
            search();
            break;
        }
    }
});

$('#hta-there-search-input').on('keypress compositionend', function() {
    search();
});

function search() {
    var keyword = _.kebabCase($('#hta-there-search-input').val().toLowerCase());

    thereList.forEach(function(there) {
        var id = there.id.toLowerCase();
        var name = there.name.toLowerCase();

        if (id.includes(keyword) || name.indexOf(keyword) > -1) {
            delete there.hidden;
        }
        else {
            there.hidden = true;
        }
    });

    setList(thereList);
}