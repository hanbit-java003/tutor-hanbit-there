require('../../less/admin/there-group-edit.less');

var URLSearchParams = require('url-search-params');

var common = require('./common');

var params = new URLSearchParams(location.search);
var id = params.get('id');
var pageType;

$('.hta-cancel').on('click', function() {
    location.href = './there-group.html';
});

$('.hta-save').on('click', function() {

});

function init(id) {
    if (!id) {
        pageType = 'add';
        $('.hta-delete').hide();
    }
    else {
        pageType = 'edit';
        $('.hta-check-duplicate').hide();
        $('#hta-there-group-id').attr('disabled', true);
    }
}

init(id);