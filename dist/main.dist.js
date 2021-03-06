// A collection of usefull prototypes
// Copyright (c) 2014 Fabian Moron Zirfas

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


/**
 * This is Prototypes.jsx
 */

try {
	Object.defineProperty({}, 'a', {value: 0});
}
catch(err) {
	// failed: so we're in IE8
	(function() {
		var defineProperty = Object.defineProperty;
		Object.defineProperty = function (object, property, descriptor) {
			delete descriptor.configurable;
			delete descriptor.enumerable;
			delete descriptor.writable;
			try {
				return defineProperty(object, property, descriptor);
			}
			catch(err) {
				object[property] = descriptor.value;
			}
		};
	}());
}

Object.defineProperties || (Object.defineProperties=function defineProperties(object, descriptors) {
	var property;
	for (property in descriptors) {
		Object.defineProperty(object, property, descriptors[property]);
	}
	return object;
});

var lambda = function (l) {
	var fn = l.match(/\((.*)\)\s*=>\s*(.*)/);
	var p = [];
	var b = "";

	if (fn.length > 0) fn.shift();
	if (fn.length > 0) b = fn.pop();
	if (fn.length > 0) p = fn.pop()
		.replace(/^\s*|\s(?=\s)|\s*$|,/g, '')
		.split(' ');

	// prepend a return if not already there.
	fn = ((!/\s*return\s+/.test(b)) ? "return " : "") + b;

	p.push(fn);

	try {
		return Function.apply({}, p);
	} catch (e) {
		return null;
	}
};

/**
 * from here
 * http://www.paulfree.com/28/javascript-array-filtering/#more-28
 */
if (typeof (Array.prototype.where) === 'undefined') {
	Array.prototype.where = function (f) {
		var fn = f;
		// if type of parameter is string
		if (typeof f == "string")
		// try to make it into a function
			if ((fn = lambda(fn)) === null)
			// if fail, throw exception
				throw "Syntax error in lambda string: " + f;
			// initialize result array
		var res = [];
		var l = this.length;
		// set up parameters for filter function call
		var p = [0, 0, res];
		// append any pass-through parameters to parameter array
		for (var i = 1; i < arguments.length; i++) {
			p.push(arguments[i]);
		}
		// for each array element, pass to filter function
		for (var j = 0; j < l; j++) {
			// skip missing elements
			if (typeof this[j] == "undefined") continue;
			// param1 = array element
			p[0] = this[j];
			// param2 = current indeex
			p[1] = j;
			// call filter function. if return true, copy element to results
			if ( !! fn.apply(this, p)) res.push(this[j]);
		}
		// return filtered result
		return res;
	};
}
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

	Array.prototype.forEach = function(callback, thisArg) {

		var T, k;

		if (this === null) {
			throw new TypeError(' this is null or not defined');
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== "function") {
			throw new TypeError(callback + ' is not a function');
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (arguments.length > 1) {
			T = thisArg;
		}

		// 6. Let k be 0
		k = 0;

		// 7. Repeat, while k < len
		while (k < len) {

			var kValue;

			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			if (k in O) {

				// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
				kValue = O[k];

				// ii. Call the Call internal method of callback with T as the this value and
				// argument list containing kValue, k, and O.
				callback.call(T, kValue, k, O);
			}
			// d. Increase k by 1.
			k++;
		}
		// 8. return undefined
	};
}
if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun/*, thisArg*/) {
		'use strict';

		if (this === void 0 || this === null) {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== 'function') {
			throw new TypeError();
		}

		var res = [];
		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t) {
				var val = t[i];

				// NOTE: Technically this should Object.defineProperty at
				//       the next index, as push can be affected by
				//       properties on Object.prototype and Array.prototype.
				//       But that method's new, and collisions should be
				//       rare, so use the more-compatible alternative.
				if (fun.call(thisArg, val, i, t)) {
					res.push(val);
				}
			}
		}

		return res;
	};
}
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(searchElement, fromIndex) {

		var k;

		// 1. Let O be the result of calling ToObject passing
		//    the this value as the argument.
		if (this === null) {
			throw new TypeError('"this" is null or not defined');
		}

		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get
		//    internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If len is 0, return -1.
		if (len === 0) {
			return -1;
		}

		// 5. If argument fromIndex was passed let n be
		//    ToInteger(fromIndex); else let n be 0.
		var n = +fromIndex || 0;

		if (Math.abs(n) === Infinity) {
			n = 0;
		}

		// 6. If n >= len, return -1.
		if (n >= len) {
			return -1;
		}

		// 7. If n >= 0, then Let k be n.
		// 8. Else, n<0, Let k be len - abs(n).
		//    If k is less than 0, then let k be 0.
		k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

		// 9. Repeat, while k < len
		while (k < len) {
			var kValue;
			// a. Let Pk be ToString(k).
			//   This is implicit for LHS operands of the in operator
			// b. Let kPresent be the result of calling the
			//    HasProperty internal method of O with argument Pk.
			//   This step can be combined with c
			// c. If kPresent is true, then
			//    i.  Let elementK be the result of calling the Get
			//        internal method of O with the argument ToString(k).
			//   ii.  Let same be the result of applying the
			//        Strict Equality Comparison Algorithm to
			//        searchElement and elementK.
			//  iii.  If same is true, return k.
			if (k in O && O[k] === searchElement) {
				return k;
			}
			k++;
		}
		return -1;
	};
}
if (typeof (String.prototype.localeCompare) === 'undefined') {
	String.prototype.localeCompare = function (str, locale, options) {
		return ((this == str) ? 0 : ((this > str) ? 1 : -1));
	};
}
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Colors = function () {
    function Colors() {
        _classCallCheck(this, Colors);
    }

    _createClass(Colors, [{
        key: "solidColor",
        value: function solidColor(c, m, y, k) {
            var color = new SolidColor();
            color.cmyk.black = k;
            color.cmyk.cyan = c;
            color.cmyk.yellow = y;
            color.cmyk.magenta = m;

            return color;
        }
    }]);

    return Colors;
}();

exports["default"] = Colors;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logging = function () {
  function Logging(jobNumber, operator, error) {
    _classCallCheck(this, Logging);

    this.jobNumber = jobNumber;
    this.operator = operator;
    this.error = error;
  }

  _createClass(Logging, [{
    key: 'logger',
    value: function logger() {
      var currentdate = new Date();
      var datetime = currentdate.getDate() + '/' + (currentdate.getMonth() + 1) + '/' + currentdate.getFullYear() + ' @ ' + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds();

      // var filepath = "G33STORE-1/4_Joe/scripts/_logs/cinemark/" + this.jobNumber + ".txt";
      var filepath = 'G33STORE-1/4_Joe/scripts/_logs/cinemark/' + this.jobNumber + '.txt';
      var write_file = File(filepath);

      if (!write_file.exists) {
        write_file = new File(filepath);
        var out;
        if (write_file !== '') {
          out = write_file.open('w', undefined, undefined);
          write_file.encoding = "UTF-8";
          write_file.lineFeed = "Macintosh";
        }
        if (out !== false) {
          // write_file.writeln(this.operator + ' worked ' + this.jobNumber + ' at ' + datetime + '\nAny Errors: ' + this.error + '\n');
          write_file.writeln(this.operator + ' worked ' + this.jobNumber + ' at ' + datetime + '\nAny Errors: ' + this.error + '\n');
          write_file.close();
        }
      } else {
        var append_file = File(filepath);
        append_file.open('a', undefined, undefined);
        if (append_file !== '') {
          // append_file.writeln(this.operator + ' worked ' + this.jobNumber + ' at ' + datetime + '\nAny Errors: ' + this.error + '\n');
          append_file.writeln(this.operator + ' worked ' + this.jobNumber + ' at ' + datetime + '\nAny Errors: ' + this.error + '\n');
          append_file.close();
        }
      }
    }
  }]);

  return Logging;
}();

exports['default'] = Logging;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SaveFiles = function () {
    function SaveFiles(saveFile) {
        _classCallCheck(this, SaveFiles);

        this.saveFile = saveFile;
    }

    _createClass(SaveFiles, [{
        key: 'saveTIF',
        value: function saveTIF() {
            saveTiff = new TiffSaveOptions();
            saveTiff.alphaChannels = true;
            saveTiff.annotations = true;
            saveTiff.byteOrder = ByteOrder.MACOS;
            saveTiff.embedColorProfile = true;
            saveTiff.imageCompression = TIFFEncoding.TIFFLZW;
            saveTiff.layerCompression = LayerCompression.ZIP;
            saveTiff.layers = false;
            saveTiff.saveImagePyramid = false;
            saveTiff.spotColors = false;
            saveTiff.transparency = false;
            app.activeDocument.saveAs(this.saveFile, saveTiff, true, Extension.LOWERCASE);
        }
    }, {
        key: 'savePDF',
        value: function savePDF() {
            pdfSaveOpts = new PDFSaveOptions();
            pdfSaveOpts.pDFPreset = 'MMT PDFx4';
            app.activeDocument.saveAs(this.saveFile, pdfSaveOpts);
        }
    }]);

    return SaveFiles;
}();

exports['default'] = SaveFiles;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Selections = function () {
    function Selections() {
        _classCallCheck(this, Selections);
    }

    _createClass(Selections, [{
        key: "selection",
        value: function selection(x, y, width, height) {
            selectedRegion = Array(Array(x, y), Array(x + width, y), Array(x + width, y + height), Array(x, y + height));

            return selectedRegion;
        }
    }]);

    return Selections;
}();

exports["default"] = Selections;

},{}],5:[function(require,module,exports){
'use strict';

var _SaveFiles = require('./SaveFiles');

var _SaveFiles2 = _interopRequireDefault(_SaveFiles);

var _Selections = require('./Selections');

var _Selections2 = _interopRequireDefault(_Selections);

var _Colors = require('./Colors');

var _Colors2 = _interopRequireDefault(_Colors);

var _Logging = require('./Logging');

var _Logging2 = _interopRequireDefault(_Logging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var doc = app.activeDocument,
    jobnumber = prompt('Job Number: ', '123456P01');
materialWidth = 54, panelSelection = new _Selections2['default'](), fullWidth = parseInt(doc.width), fullHeight = parseInt(doc.height), res = doc.resolution, overlap = 2, overlapWidth = overlap * res, availableMaterial = materialWidth - 1 - overlap, numPanels = Math.ceil(fullWidth / availableMaterial), panelWidth = fullWidth / numPanels * res, error = '';
colors = new _Colors2['default'](),
// saveAsTif = new SaveFiles(File('G33STORE-1/WIP/' + jobnumber + '/prep_art/' + jobnumber + 'panels.tif'));
saveAsTif = new _SaveFiles2['default'](File('G33STORE-1/WIP/' + jobnumber + '/prep_art/' + jobnumber + 'panels.tif'));

// alert('Panels: ' + numPanels + ' | Width: ' + (panelWidth/res).toFixed(2));
alert('Panels: ' + numPanels + ' | Width: ' + (panelWidth / res).toFixed(2));

black = colors.solidColor(0, 0, 0, 100);
red = colors.solidColor(0, 100, 100, 0);

function createMarks(layerName, opacity, color, markWidth, offsetX) {
    var newLayer = doc.artLayers.add();

    newLayer.name = layerName;
    doc.activeLayer.fillOpacity = opacity;

    for (var i = 1; i < numPanels; i++) {
        var x = i * offsetX,
            y = 0,
            width = markWidth,
            height = fullHeight * res;
        selectedRegion = panelSelection.selection(x, y, width, height);
        doc.selection.select(selectedRegion);
        doc.selection.fill(color);
    }
}
try {
    createMarks('Overlap', 50, red, overlapWidth, panelWidth);
    createMarks('Panel Breaks', 100, black, 3, panelWidth);
    saveAsTif.saveTIF();
} catch (e) {
    // error += 'Line: ' + e.line.toString() + ', ' + e.name.toString() + ', ' + e.message.toString() + '. ';
    error += 'Line: ' + e.line.toString() + ', ' + e.name.toString() + ', ' + e.message.toString() + '.';

    alert('There was an error...');
}

var log = new _Logging2['default'](jobnumber, 'Joe', error);
log.logger();

},{"./Colors":1,"./Logging":2,"./SaveFiles":3,"./Selections":4}]},{},[5]);
