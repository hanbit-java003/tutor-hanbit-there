require('../../less/admin/there-info.less');

var common = require('./common');

$.ajax({
    url: '/api/admin/there/list',
    data: {
        groupId: 'America'
    },
    success: function(result) {
        setList(result);
    }
});

function setList(theres) {
    var theresTemplate = require('../../template/admin/theres.hbs');
    var theresHtml = theresTemplate(theres);

    $('.hta-there-list').html(theresHtml);
}