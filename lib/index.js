var path = require('path');
var fs = require('fs');
var highlight = require('./highlight');
var sourceCache = {};

function decodeBase64(str) {
    return new Buffer(str, 'base64').toString();
}

function convertToRange(source, start, end) {
    var lines = source.split('\n');
    var rangeStart = (lines.slice(0, start.line - 1).join('\n').length || -1) + start.column;
    var rangeEnd = (lines.slice(0, end.line - 1).join('\n').length || -1) + end.column;

    return [rangeStart, rangeEnd];
}

function findSourceInMap(map, filename) {
    if (Array.isArray(map.sources)) {
        for (var i = 0; i < map.sources.length; i++) {
            if (path.normalize(map.sources[i]) == filename) {
                if (Array.isArray(map.sourcesContent)) {
                    return map.sourcesContent[i] || '';
                }
            }
        }
    }

    if (Array.isArray(map.sections)) {
        for (var i = 0; i < map.sections.length; i++) {
            var result = findSourceInMap(map.sections[i].map, filename);
            if (result !== false) {
                return result;
            }
        }
    }

    return false;
}

function getSource(fn) {
    if (sourceCache[fn]) {
        return sourceCache[fn];
    }

    var source = fs.readFileSync(path.resolve(fn), 'utf8');
    var sourceMap = source.split('//# sourceMappingURL=');

    if (sourceMap.length > 1) {
        sourceMap = sourceMap.pop().trim();

        if (!/[\r\n]/.test(sourceMap)) {
            sourceMap = sourceMap.split(';').pop();
            if (/^base64,/.test(sourceMap)) {
                sourceMap = decodeBase64(sourceMap.substr(7), true);
            }
            sourceMap = JSON.parse(sourceMap);

            source = findSourceInMap(sourceMap, fn) || source;
        }
    }

    sourceCache[fn] = source;

    return source;
}

function sliceString(str, start, end) {
    var lines = str
        .split('\n')
        .slice(start.line - 1, end.line);

    return lines
        .concat(lines.pop().substr(0, end.column - 1))
        .join('\n')
        .substr(start.column - 1);
}

function getSourceFragment(loc, start, end) {
    function ifNaN(value, fallback) {
        return isNaN(value) ? fallback : value;
    }

    var m = loc.match(/^(.*?)(?::(\d+):(\d+)(?::(\d+):(\d+))?)?$/);
    var source = getSource(m[1]);
    var numbers = m.slice(2).map(Number);

    if (!start) {
        start = {
            line: numbers[0] || 0,
            column: numbers[1] || 0
        };
    }

    if (!end) {
        end = {
            line: ifNaN(numbers[2], 10e6),
            column: ifNaN(numbers[3], 10e6)
        };
    }

    return sliceString(source, start, end);
}

function getColoredSourceFragment(loc, options) {
    var m = loc.match(/^(.*?)(?::(\d+):(\d+)(?::(\d+):(\d+))?)?$/);
    var source = getSource(m[1]);
    var numbers = m.slice(2).map(Number);
    var startLine = 0;
    var lastLine = Infinity;
    var range;

    options = options || {};

    if (!numbers.some(isNaN)) {
        if (numbers[0]) {
            startLine = Math.max(0, numbers[0] - (options.linesBefore || 0));
            if (!numbers[2] && options.maxLines) {
                lastLine = startLine + options.maxLines;
            }
        }

        if (numbers[2]) {
            lastLine = Math.min(
                numbers[2] + (options.linesAfter || 0),
                startLine + (options.maxLines || Infinity) - 1
            );
        }

        range = convertToRange(
            source,
            { line: numbers[0], column: numbers[1] },
            { line: numbers[2], column: numbers[3] }
        ).concat('range');
    }

    return highlight(source, {
        formatter: options.formatter,
        lang: 'js',
        range: range,
        startLine: startLine,
        lastLine: lastLine
    });
}

module.exports = {
    convertToRange: convertToRange,
    getSource: getSource,
    getSourceFragment: getSourceFragment,
    getColoredSourceFragment: getColoredSourceFragment
};
