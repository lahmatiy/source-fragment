var UID = 'j5as83pdmd85mv2c';
var style = fetchStyle();

function isolateName(name) {
    return UID + '-' + name;
}

function fetchStyle() {
    return require('fs')
        .readFileSync(__dirname + '/html.css', 'utf8')
        // simple minification
        .replace(/\/\*(.|\s)+?\*\//g, '') // comments
        .replace(/([:;,])\s+/g, '$1')     // spaces after colon and comma
        .replace(/\r?\n\s*/g, '')         // new lines
        .replace(/[\n\s]+{/g, '{')        // whitespaces before left curly bracket
        .replace(/;}/g, '}')              // semicolon before right curly bracket
        // isolate class names
        .replace(/\.([a-z]+)/gi, '.' + isolateName('$1'));
}

function escapeHtml(str) {
    return str
        .replace(/\r\n|\n\r|\r/g, '\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;');
}

module.exports = {
    escape: escapeHtml,
    wrap: function(type, str) {
        switch (type) {
            case 'source':
                return [
                    '<div class="' + isolateName('source') + '">',
                    '<style>' + style + '</style>',
                    str,
                    '</div>'
                ].join('\n');

            case 'line':
                return '<div class="' + isolateName(type) + '">' + str + '</div>';

            case 'splitter':
                return '';

            default:
                return '<span class="' + isolateName(type) + '">' + str + '</span>';
        }
    }
};
