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
    }
});