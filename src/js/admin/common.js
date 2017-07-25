require('bootstrap');

$('.hta-menu').on('click', function() {
    var subMenu = $(this).parent('.hta-menu-group').find('.hta-sub-menu');

    subMenu.slideToggle();
});

$('.hta-logo').on('click', function() {
    location.href = './';
});

$('.hta-sub-menu > li').on('click', function() {
    var link = $(this).attr('link');

    if (!link) {
        return;
    }

    location.href = link + '.html';
});

function openDialog(msg) {
    if ($('.hta-modal').length === 0) {
        var modalTemplate = require('../../template/admin/modal.hbs');
        var modalHtml = modalTemplate();
        var dialog = $(modalHtml);

        $('body').append(dialog);
    }

    $('.hta-modal').modal('show');
}

module.exports = {
    openDialog: openDialog
};