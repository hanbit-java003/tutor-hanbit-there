require('bootstrap');
require('../less/setting.less');

var common = require('./common');
var tab = require('./ht-tab');

common.ajax({
    url: '/api/member/get',
    success: function(result) {
        if (!result.signedIn) {
            alert('로그인이 필요한 페이지입니다.');
            location.href = '/';
        }

        getMemberDetail();
    }
});

function getMemberDetail() {
    common.ajax({
        url: '/api/member/detail',
        success: function(result) {
            init(result);
        }
    });
}

function init(member) {
    $('.ht-setting-email').html(member.email);
    $('#ht-member-name-input').val(member.detail.name);
    $('#ht-member-phone-input').val(member.detail.phone);

    if (member.detail.info === 'Y') {
        $('#ht-member-info-check').attr('checked', true);
    }

    if (member.detail.avatar) {
        $('.ht-setting-avatar-img')
            .css('background-image', 'url(' + member.detail.avatar + ')');
    }
}





