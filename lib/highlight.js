var LANG = {
    text: String,
    js: require('./syntax/javascript'),
    es6: require('./syntax/javascript'),
    css: require('./syntax/css')
};
var FORMATTER = {
    html: require('./formatter/html'),
    tty: require('./formatter/tty')
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

function escapeRx(str) {
    return str.replace(/([\/\\\(\)\[\]\?\{\}\|\*\+\-\.\^\$])/g, '\\$1');
}

function normalizeFormatter(formatter) {
    var wrap = formatter.wrap || function(type, str) {
        return str;
    };

    return {
        wrap: wrap,
        escape: formatter.escape || function(str) {
            return str;
        },
        buildLine: formatter.buildLine || function(num, content, highlight) {
            return wrap('line',
                wrap('num', num) +
                wrap('splitter', highlight ? ' > ' : ' | ') +
                content
            );
        }
    };
}

/**
* Function that produce html code from text.
* @param {string} text
* @param {object=} options
* @param {Array.<Number>=} options.range
* @param {string=} options.lang
* @param {boolean=} options.keepFormat
* @param {boolean=} options.lines
* @param {function(line, idx){}=} options.wrapper
* @return {string|Array.<string>}
*/
module.exports = function highlight(text, options) {
    if (!options) {
        options = {};
    }

    var formatter = normalizeFormatter(FORMATTER[options.format] || options.format || {});
    var parser = LANG[options.lang] || LANG.text;

    // prepare text
    var rangeStart = -1;
    var rangeEnd = -1;
    var rangeName = '';

    if (options.range) {
        var left = formatter.escape(text.substr(0, options.range[0]));
        var range = formatter.escape(text.substring(options.range[0], options.range[1]));
        var right = formatter.escape(text.substr(options.range[1]));

        rangeStart = left.length;
        rangeEnd = rangeStart + range.length;
        rangeName = options.range[2] || 'range';

        text = left + range + right;
    } else {
        text = formatter.escape(text);
    }

    var lines = parser(text, formatter.wrap, rangeStart, rangeEnd, rangeName).split('\n');
    var rangeWrapStart = formatter.wrap(rangeName, '|').split('|')[0];
    var offsetRx = new RegExp('^(' + escapeRx(rangeWrapStart) + ')?([ \\t]+)');
    var detectMinOffsetRx = new RegExp('^(' + escapeRx(rangeWrapStart) + ')?(\\xA0*)(.*)');
    var startLine = options.startLine || 0;
    var lastLine = options.lastLine || Infinity;
    var linesCount = lines.length;
    var numLength = Math.max(String(Math.min(lastLine, linesCount)).length, 3);

    lines = lines.slice(Math.max(startLine, 1) - 1, lastLine);

    var minOffset = Math.min.apply(null, lines.map(function(line) {
        if (!line || line == formatter.wrap(rangeName, '')) {
            return Infinity;
        }
        return line.match(detectMinOffsetRx)[2].length;
    }));
    var minOffsetRx = new RegExp('^(' + escapeRx(rangeWrapStart) + ')?\xA0{' + minOffset + '}');

    lines = lines
        .map(function(line) {
            return line.replace(offsetRx, function(m, rangeSpan, spaces) {
                return (rangeSpan || '') + repeat('\xA0', spaces.replace(/\t/g, '    ').length);
            });
        });

    if (startLine > 0) {
        lines.unshift(formatter.wrap('skip', '\xB7\xB7\xB7'));
    }
    if (lastLine < linesCount) {
        lines.push(formatter.wrap('skip', '\xB7\xB7\xB7'));
    }

    lines = lines
        .map(function(line, num) {
            return formatter.buildLine(
                lead(startLine + num, numLength, '\xA0'), // num
                line.replace(minOffsetRx, '$1'),          // content
                num === options.highlight                 // highlight
            );
        });

    return formatter.wrap('source', lines.join('\n'));
};
