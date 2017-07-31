var areaInfo = [];

function init(_areaInfo) {
    areaInfo = _areaInfo;
    setAreaInfo();

    $('[tab-id=info] .hta-add-row').on('click', function() {
        areaInfo.push({
            title: '제목',
            value: '내용'
        });

        setAreaInfo();
    });
}

function setAreaInfo() {
    $('.hta-area-info tbody').empty();

    var template = require('../../template/admin/there-info.hbs');

    for (var i=0; i<areaInfo.length; i++) {
        areaInfo[i].no = i + 1;

        var html = template(areaInfo[i]);

        $('.hta-area-info tbody').append(html);
    }

    addAreaInfoEvents();
}

function addAreaInfoEvents() {
    addBtnRowEvents();

    $('.hta-area-info tbody tr').off('dblclick');
    $('.hta-area-info tbody tr').on('dblclick', function() {
        var row = $(this);
        var rowIndex = $(this).index();
        var info = areaInfo[rowIndex];
        var template = require('../../template/admin/there-info-edit.hbs');
        var html = template(info);

        row.replaceWith(html);

        addBtnRowEvents();
    });
}

function addBtnRowEvents() {
    $('.hta-area-info .hta-btn-row').off('click');
    $('.hta-area-info .hta-btn-row').on('click', function() {
        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var info = areaInfo[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            info.title = row.find('.hta-area-info-title').val().trim();
            info.value = row.find('.hta-area-info-value').val().trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(areaInfo, function(value, index) {
                return rowIndex === index;
            });

            setAreaInfo();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            areaInfo = _.move(areaInfo, rowIndex, rowIndex - 1);

            setAreaInfo();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= areaInfo.length - 1) {
                return;
            }

            areaInfo = _.move(areaInfo, rowIndex, rowIndex + 1);

            setAreaInfo();
            return;
        }

        var template = require('../../template/admin/there-info.hbs');
        var html = template(info);
        row.replaceWith(html);

        addAreaInfoEvents();
    });
}

module.exports = {
    init: init
};