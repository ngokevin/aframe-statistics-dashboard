(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.returnExports = factory();
  }
}(this, function () {
    'use strict';

    function Urlgray(url) {
        if (!(this instanceof Urlgray)) {
            return new Urlgray(url);
        }
        if (url instanceof Urlgray) {
            url = url.url;
        }

        this.url = url;

        Object.defineProperty(this, 'base', {
            get: function() {
                return _getBase(this.url);
            }
        });

        Object.defineProperty(this, 'query', {
            get: function() {
                return _parseQuery(this.url);
            }
        });

        return this;
    }


    Urlgray.prototype.valueOf = Urlgray.prototype.toString = function() {
        // Give Urlgray a string representation.
        return this.url;
    };

    Urlgray.prototype.q = function(arg1, arg2) {
        // Set query parameter(s).
        var root = this;
        var url = root.url;

        if (arguments.length === 1) {
            // Parameter is an object containing key-values.
            Object.keys(arg1).forEach(function(key) {
                root.url = _setQuery(root.url, key, arg1[key]);
            });
        } else if (arguments.length === 2) {
            // Parameters are a key and a value.
            root.url = _setQuery(url, arg1, arg2);
        }

        return root;
    };

    Urlgray.prototype.getQ = function(key) {
        var q = _parseQuery(this.url);
        if (key) {
            return q[key];
        }
        return q;
    };

    Urlgray.prototype.unQ = function(params) {
        this.url = _unQuery(this.url, params);
        return this;
    };

    function _build(url, queryObj) {
        // Adds encoded queryObj to base of url.
        var querystring = _encode(queryObj);

        var search = '';
        if (querystring) {
            search = '?' + querystring;
        }
        return _getBase(url) + search;
    }

    function _decodeURIComponent(url) {
        return decodeURIComponent(url.replace(/\+/g, ' '));
    }

    function _encode(kwargs) {
        // Query parameters object to string.
        if (typeof kwargs === 'string') {
            return _encodeURIComponent(kwargs);
        }
        var params = [];
        if ('__keywords' in kwargs) {
            delete kwargs.__keywords;
        }
        Object.keys(kwargs).sort().forEach(function(key) {
            var value = kwargs[key];
            if (value === undefined) {
                params.push(encodeURIComponent(key));
            } else {
                params.push(encodeURIComponent(key) + '=' +
                            encodeURIComponent(value));
            }
        });
        return params.join('&');
    }

    function _encodeURIComponent(url) {
        return encodeURIComponent(url).replace(/%20/g, '+');
    }

    function _getBase(url) {
        // Returns base portion of url.
        return url.split('?')[0];
    }

    function _getQueryString(url) {
        // Returns querystring portion of url (as string).
        var qPos = url.indexOf('?');
        if (qPos === -1) {
            return '';
        }
        return url.substr(qPos + 1);
    }

    function _parseQuery(url) {
        // Get params as an object from url.
        // If url is not defined, gets from window.search.
        var qs;
        if (!url) {
            try {
              qs = window.location.search;
            } catch(e) {
              return {};
            }
        } else {
            qs = _getQueryString(url);
        }

        if (qs[0] === '?') {
            // Strip leading ? if necessary.
            qs = qs.substring(1);
        }

        // Parse.
        var query = {};
        qs  // a=b&c=d
            .split('&')  // ['a=b, c=d'].
            .map(function(q) {
                return q.split('=').map(_decodeURIComponent);
            })  // [['a', 'b'], ['c', 'd']].
            .filter(function(p) {
                // Remove undefined.
                return !!p[0] && !!p[1];
            })
            .forEach(function(q) {
                // To object.
                var key = q[0];
                var val = q[1];

                if (query[key] && query[key].constructor !== Array) {
                    // If already exists as value, make it an array.
                    query[key] = [query[key], val];
                } else if (query[key] && query[key].constructor === Array) {
                    // If already exists as array, push it.
                    query[key].push(val);
                } else {
                    // Set it.
                    query[key] = val;
                }
            });

        return query;
    }

    function _setQuery(url, key, val, noOverwrite) {
        // Set query on url.
        var query = _parseQuery(url);

        if (val.constructor === Array) {
            // Handle setting array value by recursing.
            url = _unQuery(url, key);

            val.forEach(function(v) {
                url = _setQuery(url, key, v, true);
            });
            return url;
        } else if (noOverwrite) {
            var querystring = _encode(query);
            var newParam = {};
            newParam[key] = val;

            if (querystring) {
                return _getBase(url) + '?' + querystring + '&' +
                       _encode(newParam);
            } else {
                return _build(url, newParam);
            }
        } else {
            query[key] = val;
            return _build(url, query);
        }
    }

    function _unQuery(url, params) {
        var query = _parseQuery(url);
        if (params.constructor === String) {
            params = [params];
        }
        params.forEach(function(param) {
            delete query[param];
        });

        return _build(url, query);
    }

    Urlgray._decodeURIComponent = _decodeURIComponent;
    Urlgray._getBase= _getBase;
    Urlgray._getQueryString= _getQueryString;
    Urlgray._encode = _encode;
    Urlgray._encodeURIComponent = _encodeURIComponent;
    Urlgray._parseQuery = _parseQuery;
    Urlgray._setQuery = _setQuery;
    Urlgray._unQuery = _unQuery;

    return Urlgray;
}));
