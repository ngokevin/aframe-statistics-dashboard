# indexof-property

[![frozen](http://badges.github.io/stability-badges/dist/frozen.svg)](http://github.com/badges/stability-badges)

Compiles an optimized indexof function for a known property. 

```js
//let's search for the 'name' property
var indexOf = require('indexof-property')('name')

var list = [
	{ name: 'foo', data: 5 },
	{ name: 'bar', data: 10 },
	{ name: 'beep', data: 0 },
	{ name: 'foobar', data: -5 },
	{ name: 'beep', data: 20 }
]

// prints 2
console.log( indexOf(list, 'beep') )

// prints -1
console.log( indexOf(list, 'blah') )

// prints 4
console.log( indexOf(list, 'beep', 3) )
```

The function compiles with bracket notation to support unusual property names, e.g. `"border-radius"`.

## Usage

[![NPM](https://nodei.co/npm/indexof-property.png)](https://nodei.co/npm/indexof-property/)

#### `require('indexof-property')(property)`

Compiles a new function that searches for the specified `property` name. The new function has the signature:

```i = indexOf(array, value[, start])```

Which searches for the first strictly equal match to `value` and returns that index, or -1 if none was found. The `start` index defaults to zero if unspecified.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/indexof-property/blob/master/LICENSE.md) for details.
