var chalk = require('chalk');

var color = {
    source: 'gray',
    range: ['bgBlue', 'white'],

    // line
    'line-num': 'white',
    // line-splitter
    // line-content

    'token-string': 'yellow',
    'token-comment': 'gray',
    'token-keyword': 'red',
    'token-key': 'cyan',
    'token-value': 'cyan'
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
