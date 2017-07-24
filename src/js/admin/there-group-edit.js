require('../../less/admin/there-group-edit.less');

var URLSearchParams = require('url-search-params');

var common = require('./common');

var params = new URLSearchParams(location.search);
var id = params.get('id');
var pageType;
var validId = false;

$('.hta-cancel').on('click', function() {
    location.href = './there-group.html';
});

$('.hta-save').on('click', function() {
    var groupId = $('#hta-there-group-id').val().trim();
    var groupName = $('#hta-there-group-name').val().trim();

    if (!validId) {
        alert('지역그룹ID 중복체크를 해주세요.');
        return;
    }
    else if (!groupId) {
        alert('지역그룹ID를 입력하세요.');
        $('#hta-there-group-id').focus();
        return;
    }
    else if (!groupName) {
        alert('지역그룹명을 입력하세요.');
        $('#hta-there-group-name').focus();
        return;
    }

    var url;

    if (pageType === 'add') {
        url = '/api/admin/there/group/add';
    }
    else if (pageType === 'edit') {
        url = '/api/admin/there/group/' + id;
    }

    $.ajax({
        url: url,
        method: 'POST',
        data: {
            id: groupId,
            name: groupName
        },
        success: function(result) {
            location.href = './there-group.html';
        }
    });
});

function init(id) {
    if (!id) {
        pageType = 'add';
        $('.hta-delete').hide();

        $('#hta-there-group-id').on('change', function() {
            validId = false;
        });

        $('.hta-check-duplicate').on('click', function() {
            var groupId = $('#hta-there-group-id').val().trim();

            if (!groupId) {
                alert('지역그룹ID를 입력하세요.');
                $('#hta-there-group-id').focus();
                return;
            }

            $.ajax({
                url: '/api/admin/there/group/' + groupId,
                method: 'OPTIONS',
                success: function(result) {
                    if (!result.exists) {
                        alert('사용할 수 있는 ID입니다.');
                        validId = true;
                    }
                    else {
                        alert('사용할 수 없는 ID입니다.');
                        $('#hta-there-group-id').focus();
                        validId = false;
                    }
                }
            });
        });
    }
    else {
        pageType = 'edit';
        $('.hta-check-duplicate').hide();
        $('#hta-there-group-id').attr('disabled', true);
        
        $.ajax({
            url: '/api/admin/there/group/' + id,
            method: 'GET',
            success: function (result) {
                $('#hta-there-group-id').val(result.id);
                $('#hta-there-group-name').val(result.name);
                validId = true;
            }
        });

        $('.hta-delete').on('click', function() {
            $.ajax({
                url: '/api/admin/there/group/' + id,
                method: 'DELETE',
                success: function(result) {
                    location.href = './there-group.html';
                },
                error: function() {
                    alert('포함된 지역이 있으면 삭제할 수 없습니다.');
                }
            });
        });
    }
}

init(id);