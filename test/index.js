var assert = require('assert');
var path = require('path');
var lib = require('../lib');

describe('getColoredSource()', function() {
    it('should work', function() {
        var result = lib.getColoredSource(path.join(__dirname, 'fixture/script.js:2:12:5:6'));
        assert.equal(result, `<div class="j5as83pdmd85mv2c-colored-source">
<style>.j5as83pdmd85mv2c-colored-source{margin:0;padding:0;font-family:Consolas,Monaco,monospace;font-size:12px;line-height:16px}.j5as83pdmd85mv2c-line{max-width:600px;overflow:hidden;text-overflow:ellipsis}.j5as83pdmd85mv2c-num{color:#BBB;margin-right:2px}.j5as83pdmd85mv2c-line:first-child .j5as83pdmd85mv2c-num,.j5as83pdmd85mv2c-skip-before + .j5as83pdmd85mv2c-line .j5as83pdmd85mv2c-num{margin-right:6px}.j5as83pdmd85mv2c-range{background:#F8F0D0;padding:2px 4px 2px 4px}.j5as83pdmd85mv2c-line:first-child .j5as83pdmd85mv2c-range,.j5as83pdmd85mv2c-skip-before + .j5as83pdmd85mv2c-line .j5as83pdmd85mv2c-range{padding-left:2px;margin-left:-2px}.j5as83pdmd85mv2c-skip-before,.j5as83pdmd85mv2c-skip-after{color:#CCC}.j5as83pdmd85mv2c-token-string{color:blue}.j5as83pdmd85mv2c-token-comment{color:#008200}.j5as83pdmd85mv2c-token-keyword{color:#006699;font-weight:bold}.j5as83pdmd85mv2c-token-key{color:#006699}.j5as83pdmd85mv2c-token-value{color:#AA8844;font-weight:bold}</style>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  2</span> <span class="j5as83pdmd85mv2c-skip-before">&middot;&middot;&middot;</span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  3</span>     <span class="j5as83pdmd85mv2c-token-keyword">return</span> <span class="j5as83pdmd85mv2c-range">[</span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  4</span> <span class="j5as83pdmd85mv2c-range">        <span class="j5as83pdmd85mv2c-token-string">'wor'</span> +</span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  5</span> <span class="j5as83pdmd85mv2c-range">        <span class="j5as83pdmd85mv2c-token-string">'ld'</span></span></div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  6</span> <span class="j5as83pdmd85mv2c-range">    ]</span>;</div>
<div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  7</span> <span class="j5as83pdmd85mv2c-skip-after">&middot;&middot;&middot;</span></div>
</div>`);
    });
});
