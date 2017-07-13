var callback = [];

$('.ht-tab-btns > li').on('click', function() {
    if ($(this).hasClass('active')) {
        return;
    }

    var tabIndex = $(this).index();

    var tabBtns = $(this).parent('.ht-tab-btns').find('li');
    tabBtns.removeClass('active');
    $(tabBtns[tabIndex]).addClass('active');

    var tabContents = $(this).parents('.ht-tab').find('.ht-tab-contents > li');
    tabContents.removeClass('active');
    $(tabContents[tabIndex]).addClass('active');

    if (typeof callback[tabIndex] === 'function') {
        callback[tabIndex]();
    }
});

module.exports = {
    setCallback: function(tabIndex, handler) {
        callback[tabIndex] = handler;
    }
};