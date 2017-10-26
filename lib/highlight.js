var LANG = {
    none: String,
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
                wrap('line-num', num) +
                wrap('line-splitter', highlight ? ' > ' : ' | ') +
                wrap('line-content', content)
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
    var parser = typeof options.lang === 'function' ? options.lang : LANG[options.lang] || LANG.none;

    // prepare text
    var rangeStart = -1;
    var rangeEnd = -1;
    var rangeName = 'range';

    if (options.range) {
        var left = formatter.escape(text.substr(0, options.range[0]));
        var range = formatter.escape(text.substring(options.range[0], options.range[1]));
        var right = formatter.escape(text.substr(options.range[1]));

        rangeStart = left.length;
        rangeEnd = rangeStart + range.length;

        text = left + range + right;
    } else {
        text = formatter.escape(text);
    }

    var lines = parser(text, formatter.wrap, rangeStart, rangeEnd, rangeName).split('\n');
    var tabBySpaces = repeat(' ', options.tabSize || 8);
    var rangeWrapStart = formatter.wrap(rangeName, '|').split('|')[0];
    var offsetRx = new RegExp('^(' + escapeRx(rangeWrapStart) + ')?( +)');
    var startLine = options.startLine || 0;
    var lastLine = options.lastLine || Infinity;
    var linesCount = lines.length;
    var numLength = Math.max(String(Math.min(lastLine, linesCount)).length, 3);
    var minOffset = Infinity;

    lines = lines
        .slice(Math.max(startLine - 1, 0), lastLine)
        .map(function(line) {
            return line.replace(/^[\t ]+/, function(offset) {
                var wsOnlyList = offset.length === line.length;
                
                offset = offset.replace(/\t/g, tabBySpaces);
                
                if (!wsOnlyList) {
                    minOffset = Math.min(minOffset, offset.length);
                }
                
                return offset;
            });
        });

    if (minOffset === Infinity || !options.collapseOffset) {
        minOffset = 0;
    }

    lines = lines
        .map(function(line) {
            return line.replace(offsetRx, function(m, rangeSpan, spaces) {
                return (rangeSpan || '') + repeat('\xA0', Math.max(spaces.length - minOffset, 0));
            });
        });

    if (startLine > 1) {
        startLine--;
        lines.unshift(formatter.wrap('skip', '\xB7\xB7\xB7'));
    }

    if (lastLine < linesCount) {
        lines.push(formatter.wrap('skip', '\xB7\xB7\xB7'));
    }

    lines = lines
        .map(function(line, num) {
            return formatter.buildLine(
                lead(startLine + num, numLength, '\xA0'), // num
                line,                                     // content
                num === options.highlight                 // highlight
            );
        });

    return formatter.wrap('source', lines.join('\n'));
};
