require('../../less/admin/there-info.less');

var common = require('./common');

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
            setList(result);
        }
    });
}

function setList(theres) {
    var theresTemplate = require('../../template/admin/theres.hbs');
    var theresHtml = theresTemplate(theres);

    $('.hta-there-list').html(theresHtml);
}