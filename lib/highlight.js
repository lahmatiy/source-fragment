var style = require('./style');
var LANG = {
    text: String,
    js: require('./syntax/javascript'),
    es6: require('./syntax/javascript'),
    css: require('./syntax/css')
};

function lead(num, len, leadChar) {
    // convert to string and lead first digits by leadChar
    return String(num).replace(/\d+/, function(number) {
        // substract number length from desired length converting len to Number and indicates how much leadChars we need to add
        // here is no isNaN(len) check, because comparation of NaN and a Number is always false
        return (len -= number.length - 1) > 1 ? new Array(len).join(leadChar || 0) + number : number;
    });
}

function repeat(str, count) {
    return (new Array(parseInt(count, 10) + 1 || 0)).join(str);
}

function escapeHtml(str) {
    return str
        .replace(/\r\n|\n\r|\r/g, '\n')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;');
}

function normalize(text) {
    text = text
        // cut first empty lines
        .replace(/^(?:\s*[\n]+)+?([ \t]*)/, '$1')
        .trimRight();

    // fix empty strings
    text = text.replace(/\n[ \t]+\n/g, '\n\n');

    // normalize text offset
    var minOffset = 1000;
    var lines = text.split(/\n+/);
    var startLine = Number(text.match(/^function/) != null); // fix for function.toString()

    for (var i = startLine; i < lines.length; i++) {
        var m = lines[i].match(/^\s*/);
        if (m[0].length < minOffset) {
            minOffset = m[0].length;
        }
        if (minOffset == 0) {
            break;
        }
    }

    if (minOffset > 0) {
        text = text.replace(new RegExp('(^|\\n) {' + minOffset + '}', 'g'), '$1');
    }

    return text;
}

function wrap(type, str, block) {
    return block
        ? '<div class="' + style.isolateName(type) + '">' + str + '</div>'
        : '<span class="' + style.isolateName(type) + '">' + str + '</span>';
}

/**
* Function that produce html code from text.
* @param {string} text
* @param {string=} lang
* @param {object=} options
* @param {Array.<Number>=} options.range
* @param {boolean=} options.noLineNumber
* @param {boolean=} options.keepFormat
* @param {boolean=} options.lines
* @param {function(line, idx){}=} options.wrapper
* @return {string|Array.<string>}
*/
module.exports = function highlight(text, lang, options) {
    if (!options) {
        options = {};
    }

    // prepare text
    var rangeStart = -1;
    var rangeEnd = -1;
    var rangeName = '';

    if (options.range) {
        var left = escapeHtml(text.substr(0, options.range[0]));
        var range = escapeHtml(text.substring(options.range[0], options.range[1]));
        var right = escapeHtml(text.substr(options.range[1]));

        rangeStart = left.length;
        rangeEnd = rangeStart + range.length;
        rangeName = options.range[2] || 'range';

        text = left + range + right;
    } else {
        text = escapeHtml(text);
    }

    if (!options.keepFormat) {
        text = normalize(text || '');
    }

    var parser = LANG[lang] || LANG.text;
    var lines = parser(text, wrap, rangeStart, rangeEnd, rangeName).split('\n');
    var rangeWrapStart = wrap(rangeName, '|').split('|')[0];
    var offsetRx = new RegExp('^(' + rangeWrapStart + ')?([ \\t]+)');
    var detectMinOffsetRx = new RegExp('^(' + rangeWrapStart + ')?(\\xA0*)(.*)');
    var startLine = options.startLine || 0;
    var lastLine = options.lastLine || Infinity;
    var linesCount = lines.length;
    var numLength = Math.max(String(Math.min(lastLine, linesCount)).length, 3);

    lines = lines.slice(startLine - 1, lastLine);

    var minOffset = Math.min.apply(null, lines.map(function(line) {
        if (!line || line == wrap(rangeName, '')) {
            return Infinity;
        }
        return line.match(detectMinOffsetRx)[2].length;
    }));
    var minOffsetRx = new RegExp('^(' + rangeWrapStart + ')?\xA0{' + minOffset + '}');

    lines = lines
        .map(function(line) {
            return line.replace(offsetRx, function(m, rangeSpan, spaces) {
                return (rangeSpan || '') + repeat('\xA0', spaces.replace(/\t/g, '    ').length);
            });
        });

    if (startLine > 0) {
        lines.unshift(wrap('skip-before', '&middot;&middot;&middot;'));
    }
    if (lastLine < linesCount) {
        lines.push(wrap('skip-after', '&middot;&middot;&middot;'));
    }

    lines = lines
        .map(function(line, num) {
            return (
                wrap('line',
                    wrap('num', lead(startLine + num, numLength, '\xA0')) + ' ' +
                    line.replace(minOffsetRx, '$1'),
                    true
                )
            );
        });

    lines.unshift(
        '<div class="' + style.isolateName('colored-source') + '">',
        '<style>' + style.source + '</style>'
    );
    lines.push(
        '</div>'
    );

    return lines.join('\n');
};
