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

function openDialog(options) {
    var modalTemplate = require('../../template/admin/modal.hbs');
    var modalHtml = modalTemplate({
        title: options.title || 'HT Admin',
        body: options.body,
        buttons: options.buttons || []
    });
    var dialog = $(modalHtml);

    $('body').append(dialog);

    $('.hta-dialog-btn').on('click', function() {
        if (typeof options.handler === 'function') {
            var btnId = $(this).attr('btn-id');

            options.handler(btnId);
        }
    });

    $('.hta-modal').on('hidden.bs.modal', function() {
        $('.hta-modal').remove();
    });

    $('.hta-modal').modal('show');
}

function hideDialog() {
    $('.hta-modal').modal('hide');
}

module.exports = {
    openDialog: openDialog,
    closeDialog: hideDialog
};