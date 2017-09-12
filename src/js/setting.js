require('bootstrap');
require('jquery-mask-plugin');
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
    $('#ht-member-phone-input').mask('000-0000-0000');

    if (member.detail.info === 'Y') {
        $('#ht-member-info-check').attr('checked', true);
    }

    if (member.detail.avatar) {
        $('.ht-setting-avatar-img')
            .css('background-image', 'url(' + member.detail.avatar + ')');
    }

    $('#ht-setting-avatar-select').on('click', function() {
        $('#ht-setting-avatar-input').click();
    });

    $('#ht-setting-avatar-input').on('change', function() {
        if (this.files.length === 0) {
            return;
        }

        var file = this.files[0];
        var fileReader = new FileReader();

        fileReader.addEventListener('load', function(event) {
            var preview = event.target.result;

            $('.ht-setting-avatar-img')
                .css('background-image', 'url(' + preview + ')');
        });

        fileReader.readAsDataURL(file);
    });
}

$('.ht-setting-cancel').on('click', function() {
    history.back();
});

$('.ht-setting-save').on('click', function() {
    var member = {
        currentPw: $('#ht-member-cpw-input').val().trim(),
        password: $('#ht-member-npw-input').val().trim(),
        detail: {
            name: $('#ht-member-name-input').val().trim(),
            phone: $('#ht-member-phone-input').cleanVal().trim(),
            info: $('#ht-member-info-check')[0].checked ? 'Y' : 'N'
        }
    };

    var npwc = $('#ht-member-npwc-input').val().trim();

    if (member.currentPw || member.password || npwc) {
        if (!member.currentPw) {
            alert('현재 비밀번호를 입력하세요.');
            $('#ht-member-cpw-input').focus();
            return;
        }
        else if (!member.password) {
            alert('새 비밀번호를 입력하세요.');
            $('#ht-member-npw-input').focus();
            return;
        }
        else if (member.password !== npwc) {
            alert('새 비밀번호 확인이 다릅니다.');
            $('#ht-member-npwc-input').focus();
            return;
        }
    }

    var formData = new FormData();
    formData.append('member', JSON.stringify(member));

    var images = $('#ht-setting-avatar-input')[0].files;
    if (images.length > 0) {
        formData.append('avatar', images[0]);
    }

    common.ajax({
        url: '/api/member/save',
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(result) {
            alert('정상적으로 저장되었습니다.');

            location.reload();
        }
    });
});




