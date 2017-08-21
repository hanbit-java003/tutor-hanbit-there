var _ = require('lodash');
var hangul = require('hangul-js');

var list = [];

var inputbox;
var setList;

var searchTimer;
var lastSearchTime = _.now();

var eventAttached = false;

function init(searchinput, originList, setListFunction) {
    list = originList;
    inputbox = searchinput;
    setList = setListFunction;

    if (!eventAttached) {
        addEvents();
        eventAttached = true;
    }

    search();
}

module.exports = {
    init: init
};

function addEvents() {
    inputbox.on('paste cut', function(event) {
        setTimeout(search, 100);
    });

    inputbox.on('keyup', function(event) {
        switch (event.keyCode) {
            case 27:    // esc
                inputbox.val('');
            case 8:     // backspace
            case 46: {  // delete
                search();
                break;
            }
        }
    });

    inputbox.on('input', function() {
        clearTimeout(searchTimer);
        var delay = 200;
        var now = _.now();

        if (now - lastSearchTime > 1000) {
            delay = 0;
        }

        searchTimer = setTimeout(function() {
            search();
        }, delay);
    });
}

function hangulSearch(text, keyword) {
    var disassembled = hangul.disassemble(keyword);
    var isChosung = true;

    for (var i=0; i<disassembled.length; i++) {
        if (!hangul.isCho(disassembled[i])) {
            isChosung = false;
            break;
        }
    }

    if (!isChosung) {
        return hangul.search(text, keyword) > -1;
    }

    var chosung = _.map(hangul.d(text, true), function(arr) {
        return arr[0];
    });

    return hangul.search(chosung, keyword) > -1;
}

function search() {
    var keyword = _.kebabCase(inputbox.val().toLowerCase());

    list.forEach(function(item) {
        var id = item.id.toLowerCase();
        var name = item.name.toLowerCase();

        if (id.includes(keyword) || hangulSearch(name, keyword)) {
            delete item.hidden;
        }
        else {
            item.hidden = true;
        }
    });

    setList(list);

    lastSearchTime = _.now();
}