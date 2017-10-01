var assert = require('assert');
var path = require('path');
var sourceFragment = require('../lib');
var style = require('../lib/formatter/html').style;

describe('getFragment()', function() {
    it('html', function() {
        var result = sourceFragment(path.join(__dirname, 'fixture/script.js:2:12:5:6'), { format: 'html' });
        assert.equal(result, `<div class="j5as83pdmd85mv2c-source">
<style>${style}</style>
<div class="j5as83pdmd85mv2c-line" num="  1"><span class="j5as83pdmd85mv2c-skip">···</span></div>
<div class="j5as83pdmd85mv2c-line" num="  2">    <span class="j5as83pdmd85mv2c-token-keyword">return</span> <span class="j5as83pdmd85mv2c-range">(</span></div>
<div class="j5as83pdmd85mv2c-line" num="  3"><span class="j5as83pdmd85mv2c-range">        <span class="j5as83pdmd85mv2c-token-string">'world'</span> +</span></div>
<div class="j5as83pdmd85mv2c-line" num="  4"><span class="j5as83pdmd85mv2c-range">        <span class="j5as83pdmd85mv2c-token-string">'!!!'</span></span></div>
<div class="j5as83pdmd85mv2c-line" num="  5"><span class="j5as83pdmd85mv2c-range">    )</span>;</div>
<div class="j5as83pdmd85mv2c-line" num="  6"><span class="j5as83pdmd85mv2c-skip">···</span></div>
</div>`);
    });

    it('html', function() {
        var result = sourceFragment(path.join(__dirname, 'fixture/script.js:1:27:1:32'), { format: 'html' });
        assert.equal(result, `<div class="j5as83pdmd85mv2c-source">
<style>${style}</style>
<div class="j5as83pdmd85mv2c-line" num="  1">module.exports = <span class="j5as83pdmd85mv2c-token-keyword">function</span> <span class="j5as83pdmd85mv2c-range">hello</span>() {</div>
<div class="j5as83pdmd85mv2c-line" num="  2"><span class="j5as83pdmd85mv2c-skip">···</span></div>
</div>`);
    });

    it('tty', function() {
        var result = sourceFragment(path.join(__dirname, 'fixture/script.js:2:12:5:6'), { format: 'tty' });
        assert.equal(result, `\u001b[90m\u001b[37m  1\u001b[90m | ···
\u001b[37m  2\u001b[90m |     \u001b[31mreturn\u001b[90m \u001b[44m\u001b[37m(\u001b[90m\u001b[49m
\u001b[37m  3\u001b[90m | \u001b[44m\u001b[37m        \u001b[33m'world'\u001b[90m +\u001b[90m\u001b[49m
\u001b[37m  4\u001b[90m | \u001b[44m\u001b[37m        \u001b[33m'!!!'\u001b[90m\u001b[90m\u001b[49m
\u001b[37m  5\u001b[90m | \u001b[44m\u001b[37m    )\u001b[90m\u001b[49m;
\u001b[37m  6\u001b[90m | ···\u001b[39m`);
    });
});
