var traffics = [];

function init(_traffics) {
    traffics = _traffics;
    setTraffics();

    $('[tab-id=traffic] .hta-add-row').on('click', function() {
        traffics.push({
            icon: 'bus',
            title: '교통편',
            contents: '내용'
        });

        setTraffics();
    });
}

function setTraffics() {
    $('.hta-traffics tbody').empty();

    var template = require('../../template/admin/there-traffic.hbs');

    for (var i=0; i<traffics.length; i++) {
        traffics[i].no = i + 1;

        var html = template(traffics[i]);

        $('.hta-traffics tbody').append(html);
    }

    addTrafficsEvents();
}

function addTrafficsEvents() {
    addBtnRowEvents();

    $('.hta-traffics tbody tr').off('dblclick');
    $('.hta-traffics tbody tr').on('dblclick', function() {
        var row = $(this);
        var rowIndex = $(this).index();
        var info = traffics[rowIndex];
        var template = require('../../template/admin/there-traffic-edit.hbs');
        var html = template(info);

        row.replaceWith(html);

        addBtnRowEvents();
    });
}

function addBtnRowEvents() {
    $('.hta-traffics .hta-btn-row').off('click');
    $('.hta-traffics .hta-btn-row').on('click', function() {
        var row = $(this).parents('tr');
        var rowIndex = row.index();
        var traffic = traffics[rowIndex];

        if ($(this).hasClass('hta-apply-row')) {
            traffic.icon = row.find('.hta-traffic-icon').val().trim();
            traffic.title = row.find('.hta-traffic-title').val().trim();
            traffic.contents = row.find('.hta-traffic-contents').val().trim();
        }
        else if ($(this).hasClass('hta-remove-row')) {
            _.remove(traffics, function(value, index) {
                return rowIndex === index;
            });

            setTraffics();
            return;
        }
        else if ($(this).hasClass('hta-up-row')) {
            if (rowIndex < 1) {
                return;
            }

            traffics = _.move(traffics, rowIndex, rowIndex - 1);

            setTraffics();
            return;
        }
        else if ($(this).hasClass('hta-down-row')) {
            if (rowIndex >= traffics.length - 1) {
                return;
            }

            traffics = _.move(traffics, rowIndex, rowIndex + 1);

            setTraffics();
            return;
        }

        var template = require('../../template/admin/there-traffic.hbs');
        var html = template(traffic);
        row.replaceWith(html);

        addTrafficsEvents();
    });
}

module.exports = {
    init: init
};