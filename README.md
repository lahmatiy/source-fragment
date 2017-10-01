# source-fragment

[![NPM version](https://img.shields.io/npm/v/source-fragment.svg)](https://www.npmjs.com/package/source-fragment)
[![Build Status](https://travis-ci.org/lahmatiy/source-fragment.svg?branch=master)](https://travis-ci.org/lahmatiy/source-fragment)

Fetch source file fragment with highlighting

## Install

```
npm install source-fragment
```

## Example

Suppose we have the code (`example.js`):

```js
function hello() {
    return (
      'world' +
      '!!!'
    );
}
```

To get colored fragment of this code:

```js
var sf = require('source-fragment');

console.log(sf('example.js:2:12:5:6', { format: 'tty' }));
```

You'll see in console:

![Example output (tty)](https://user-images.githubusercontent.com/270491/31044865-9150bf3a-a5e0-11e7-8d28-192d5475e0da.png)

The same but in `HTML` format:

```js
sf('example.js:2:12:5:6', { format: 'html' });
// <div class="j5as83pdmd85mv2c-source">
// <style>...</style>
// <div class="j5as83pdmd85mv2c-line"><span class="j5as83pdmd85mv2c-num">  2</span>...</div>
// ...
// </div>
```

When pasted on HTML page looks like:

![Example output (html)](https://user-images.githubusercontent.com/270491/31044911-40e99b38-a5e1-11e7-9fb2-22dfd5c7b212.png)

## API

```
sourceFragment(loc[, options])
```

Options:

- `format`

  Type: `Object`  
  Default: `null` (no format is used)

  Defines formatter for a result. There are two predefined formats, that can be choosen by name (e.g. `sourceFragment('...', { format: 'html' })`):
  - `html` - formats result in HTML
  - `tty` – formats result using terminal escape codes, useful to output in console with color support

- `linesBefore`

  Type: `Number`  
  Default: `0`

  Lines added before a range start line.

- `linesAfter`

  Type: `Number`  
  Default: `0`

  Lines added after a range end line.

- `maxLines`

  Type: `Number`  
  Default: `Infinity`

  Limits lines number in result.


## License

MIT
