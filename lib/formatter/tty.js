var chalk = require('chalk');

var color = {
    source: 'gray',
    num: 'white',
    range: ['bgBlue', 'white'],

    'token-string': 'cyan',
    'token-comment': 'gray',
    'token-keyword': 'yellow',
    'token-key': 'cyan',
    'token-value': 'yellow'
};

module.exports = {
    wrap: function(type, str) {
        if (color.hasOwnProperty(type)) {
            var styles = Array.isArray(color[type]) ? color[type] : [color[type]];

            str = styles.reduce((fn, key) => fn[key], chalk)(str);
        }

        return str;
    }
};
