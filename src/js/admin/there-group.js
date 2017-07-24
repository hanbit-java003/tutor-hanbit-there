require('../../less/admin/there-group.less');

var _ = require('lodash');
var common = require('./common');

$('.hta-there-group-add').on('click', function() {
    location = './there-group-edit.html';
});

$.ajax({
    url: '/api/admin/there/groups',
    success: function(result) {
        setList(result);
    }
});

function setList(groups) {
    var thereGroupsTemplate = require('../../template/admin/there-groups.hbs');
    var thereGroupsHtml = thereGroupsTemplate(groups);

    $('.hta-there-groups tbody').html(thereGroupsHtml);

    $('.hta-total-there-groups').text(groups.length);
    $('.hta-total-theres').text(_.reduce(groups, function(total, group) {
        return total + group.thereCount;
    }, 0));

    attachEvents();
}

function attachEvents() {
    $('.hta-there-group-order').on('click', function(event) {
        event.stopPropagation();

        var dir = $(this).attr('dir');
        var row = $(this).parents('tr');

        var param = {};

        if (dir === 'up') {
            if (row.prev().length === 0) {
                return;
            }

            param.idUp = row.attr('group-id');
            param.idDown = row.prev().attr('group-id');
        }
        else if (dir === 'down') {
            if (row.next().length === 0) {
                return;
            }

            param.idUp = row.next().attr('group-id');
            param.idDown = row.attr('group-id');
        }

        $.ajax({
            url: '/api/admin/there/group/order',
            data: param,
            success: function(result) {
                setList(result);
            }
        })
    });

    $('.hta-there-groups > tbody > tr').on('click', function() {
        var id = $(this).attr('group-id');

        location.href = './there-group-edit.html?id=' + id;
    });
}