# prependify

*Prepend your browserify generated bundle-file with any given text.*

[![License][license-image]][license-url]
[![Music][music-image]][music-url]


## Install
```sh
npm install prependify
```

## Usage
```js
var browserify = require('browserify');
var prependify = require('prependify');

var b = browserify();
b.add('/path/to/your/file');
b.plugin(prependify, 'some text');
b.bundle().pipe(somewhere);
```


[license-url]: http://zedshaw.com/archive/why-i-algpl/
[license-image]: http://img.shields.io/:license-mit-blue.svg
[music-url]: http://somafm.com/defcon/
[music-image]: https://img.shields.io/badge/music-SomaFM-FF0000.svg
