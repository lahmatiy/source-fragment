var assert = require('assert');
var path = require('path');
var lib = require('../lib');

describe('getColoredSourceFragment()', function() {
    it('html', function() {
        var result = lib.getColoredSourceFragment(path.join(__dirname, 'fixture/script.js:2:12:5:6'), { formatter: 'html' });
        assert.equal(result, `<div class="j5as83pdmd85mv2c-source">
<style>.j5as83pdmd85mv2c-source{margin:0;padding:0;font-family:Consolas,Monaco,monospace;font-size:12px;line-height:16px}.j5as83pdmd85mv2c-line{max-width:600px;overflow:hidden;text-overflow:ellipsis}.j5as83pdmd85mv2c-num{color:#BBB;margin-right:8px}.j5as83pdmd85mv2c-line:first-child .j5as83pdmd85mv2c-num,.j5as83pdmd85mv2c-skip-before + .j5as83pdmd85mv2c-line .j5as83pdmd85mv2c-num{margin-right:12px}.j5as83pdmd85mv2c-range{background:#F8F0D0;padding:2px 4px 2px 4px}.j5as83pdmd85mv2c-line:first-child .j5as83pdmd85mv2c-range,.j5as83pdmd85mv2c-skip-before + .j5as83pdmd85mv2c-line .j5as83pdmd85mv2c-range{padding-left:2px;margin-left:-2px}.j5as83pdmd85mv2c-skip-before,.j5as83pdmd85mv2c-skip-after{color:#CCC}.j5as83pdmd85mv2c-token-string{color:blue}.j5as83pdmd85mv2c-token-comment{color:#008200}.j5as83pdmd85mv2c-token-keyword{color:#006699;font-weight:bold}.j5as83pdmd85mv2c-token-key{color:#006699}.j5as83pdmd85mv2c-token-value{color:#AA8844;font-weight:bold}</style>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  2</span><span class="j5as83pdmd85mv2c-skip">···</span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  3</span>    <span class="j5as83pdmd85mv2c-token-keyword">return</span> <span class="j5as83pdmd85mv2c-range">[</span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  4</span><span class="j5as83pdmd85mv2c-range">        <span class="j5as83pdmd85mv2c-token-string">'wor'</span> +</span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  5</span><span class="j5as83pdmd85mv2c-range">        <span class="j5as83pdmd85mv2c-token-string">'ld'</span></span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  6</span><span class="j5as83pdmd85mv2c-range">    ]</span>;</div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  7</span><span class="j5as83pdmd85mv2c-skip">···</span></div>
</div>`);
    });

    it('tty', function() {
        var result = lib.getColoredSourceFragment(path.join(__dirname, 'fixture/script.js:2:12:5:6'), { formatter: 'tty' });
        assert.equal(result, `\u001b[90m\u001b[37m  2\u001b[90m | ···
\u001b[37m  3\u001b[90m |     \u001b[33mreturn\u001b[90m \u001b[44m\u001b[37m[\u001b[90m\u001b[49m
\u001b[37m  4\u001b[90m | \u001b[44m\u001b[37m        \u001b[36m'wor'\u001b[90m +\u001b[90m\u001b[49m
\u001b[37m  5\u001b[90m | \u001b[44m\u001b[37m        \u001b[36m'ld'\u001b[90m\u001b[90m\u001b[49m
\u001b[37m  6\u001b[90m | \u001b[44m\u001b[37m    ]\u001b[90m\u001b[49m;
\u001b[37m  7\u001b[90m | ···\u001b[39m`);
    });
});
