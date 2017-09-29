var UID = 'j5as83pdmd85mv2c';

function isolateName(name) {
    return UID + '-' + name;
}

function fetchStyle() {
    return require('fs')
        .readFileSync(__dirname + '/style.css', 'utf8')
        // simple minification
        .replace(/\/\*(.|\s)+?\*\//g, '') // comments
        .replace(/([:;,])\s+/g, '$1')     // spaces after colon and comma
        .replace(/\r?\n\s*/g, '')         // new lines
        .replace(/[\n\s]+{/g, '{')        // whitespaces before left curly bracket
        .replace(/;}/g, '}')              // semicolon before right curly bracket
        // isolate class names
        .replace(/\.([a-z]+)/gi, '.' + isolateName('$1'));
}

/*function base36(val) {
    return Math.round(val).toString(36);
}

function genUID(len) {
    // uid should starts with alpha
    var result = base36(10 + 25 * Math.random());

    if (!len) {
        len = 16;
    }

    while (result.length < len) {
        result += base36(new Date * Math.random());
    }

    return result.substr(0, len);
}*/

module.exports = {
    source: fetchStyle(),
    isolateName: isolateName
};
