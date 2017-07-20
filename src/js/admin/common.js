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