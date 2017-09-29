var keywords =
    'break case catch continue ' +
    'default delete do else false ' +
    'for function if in instanceof ' +
    'new null return super switch ' +
    'this throw true try typeof var while with ' +
    'let const of class extends yield async await';

var keywordRegExp = new RegExp('\\b(' + keywords.split(' ').join('|') + ')\\b', 'g');

module.exports = function(text, wrap, rangeStart, rangeEnd, rangeName) {
    function addMatch(kind, start, end, rn) {
        if (lastMatchPos != start) {
            result.push(text.substring(lastMatchPos, start).replace(keywordRegExp, wrap('token-keyword', '$1')));
        }

        lastMatchPos = end ? end + 1 : start;

        if (kind) {
            result.push(wrap('token-' + kind, text.substring(start, lastMatchPos)) + (rn || ''));
        }
    }

    var result = [];
    var sym = text.split('');
    var lastMatchPos = 0;
    var rangeWrapper = wrap(rangeName, '|').split('|');
    var inRange = false;
    var resultRangeStart = -1;
    var resultRangeEnd;
    var start;
    var strSym;

    for (var i = 0; i < sym.length; i++) {
        if (i >= rangeStart) {
            if (i < rangeEnd) {
                if (!inRange) {
                    inRange = true;
                    addMatch(null, rangeStart);
                    result.push(rangeWrapper[0]);
                    resultRangeStart = result.join('').length;
                }
            } else {
                if (inRange) {
                    inRange = false;
                    addMatch(null, rangeEnd);
                    result.push(rangeWrapper[1]);
                    resultRangeEnd = result.join('').length;
                }
            }
        }

        if (sym[i] == '\'' || sym[i] == '\"') {
            strSym = sym[i];
            start = i;
            while (++i < sym.length) {
                if (sym[i] == '\\') {
                    if (sym[i + 1] == '\n') {
                        addMatch('string', start, i);
                        start = ++i + 1;
                    } else {
                        i += 2;
                    }
                }

                if (sym[i] == strSym) {
                    addMatch('string', start, i);
                    break;
                }

                if (sym[i] == '\n') {
                    break;
                }
            }
        } else if (sym[i] == '/') {
            start = i;
            i++;

            if (sym[i] == '/') {
                while (++i < sym.length) {
                    if (sym[i] == '\n') {
                        break;
                    }
                }

                addMatch('comment', start, i - 1);
            } else if (sym[i] == '*') {
                while (++i < sym.length) {
                    if (sym[i] == '*' && sym[i + 1] == '/') {
                        addMatch('comment', start, ++i);
                        break;
                    } else if (sym[i] == '\n') {
                        addMatch('comment', start, i - 1, '\n');
                        lastMatchPos = start = i + 1;
                    }
                }
            }
        }
    }

    addMatch(null, text.length);
    result = result.join('');

    if (resultRangeStart != -1) {
        if (!resultRangeEnd) {
            resultRangeEnd = result.length;
            result += '</span>';
        }

        result =
            result.substr(0, resultRangeStart) +
            result.substring(resultRangeStart, resultRangeEnd)
                .replace(/\n/g, rangeWrapper[1] + '\n' + rangeWrapper[0]) +
            result.substr(resultRangeEnd);
    }

    return result;
};
