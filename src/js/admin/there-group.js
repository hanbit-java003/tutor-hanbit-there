require('../../less/admin/there-group.less');

var _ = require('lodash');
var common = require('./common');

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
}