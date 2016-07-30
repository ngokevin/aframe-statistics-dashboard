var assert = require('assert');

var Url = require('./index');


describe('new Urlgray()', function() {
    it('initializes object', function() {
        var url = new Url('http://localhost');
        assert.equal(url, 'http://localhost');
        assert.equal(url.url, 'http://localhost');
    });

    it('handles double wrapping', function() {
        var url = new Url(new Url('http://localhost'));
        assert.equal(url, 'http://localhost');
        assert.equal(url.url, 'http://localhost');
    });
});


describe('Urlgray.q', function() {
    it('sets query with key/val args', function() {
        assert.equal(new Url('http://localhost').q('foo', 'bar'),
                     'http://localhost?foo=bar');
    });

    it('appends query with key/val args', function() {
        assert.equal(new Url('http://localhost/?foo=bar').q('qux', 'qaz'),
                     'http://localhost/?foo=bar&qux=qaz');
    });

    it('sets query with object arg', function() {
        assert.equal(new Url('http://localhost').q({foo: 'bar', qux: 'qaz'}),
                     'http://localhost?foo=bar&qux=qaz');
    });

    it('appends query with object arg', function() {
        assert.equal(new Url('http://localhost/?foo=bar').q({qux: 'qaz'}),
                     'http://localhost/?foo=bar&qux=qaz');
    });

    it('chains', function() {
        assert.equal(new Url('http://localhost/').q({foo: 'bar'})
                                                 .q('qux', 'qaz'),
                     'http://localhost/?foo=bar&qux=qaz');
    });

    it('handles empty', function() {
        assert.equal(Url(''), '');
        assert.equal(Url('').q({foo: 'bar'}), '?foo=bar');
    });
});


describe('Urlgray.base', function() {
    it('returns base', function() {
        var url = new Url('http://localhost/?foo=bar');
        assert.equal(url.base, 'http://localhost/');
        assert.equal(url, 'http://localhost/?foo=bar');
    });
});


describe('Urlgray.query', function() {
    it('returns query', function() {
        var url = new Url('http://localhost/?foo=bar');
        assert.deepEqual(url.query, {foo: 'bar'});
        assert.equal(url, 'http://localhost/?foo=bar');
    });
});


describe('Urlgray.unQ', function() {
    it('removes query', function() {
        assert.equal(new Url('http://localhost/?foo=bar').unQ('foo'),
                     'http://localhost/');
    });

    it('chains', function() {
        assert.equal(new Url('http://localhost/').q({foo: 'bar'})
                                                 .unQ('foo'),
                     'http://localhost/');
    });
});


describe('_getBase', function() {
    it('returns base', function() {
        assert.equal(Url._getBase('http://localhost/?foo=bar'),
                     'http://localhost/');
    });
});


describe('_getQueryString', function() {
    it('returns querystring', function() {
        assert.equal(Url._getQueryString('http://localhost/?foo=bar'),
                     'foo=bar');
    });

    it('returns empty querystring', function() {
        assert.equal(Url._getQueryString('http://localhost/'),
                     '');
    });
});


describe('_parseQuery', function() {
    it('parses query', function() {
        assert.deepEqual(
            Url._parseQuery('http://localhost/?foo=bar&qux=qaz&a=b'),
            {foo: 'bar', qux: 'qaz', a: 'b'});
    });

    it('parses empty query', function() {
        assert.deepEqual(Url._parseQuery('http://localhost/'),
                         {});
    });

    it('parses array value', function() {
        assert.deepEqual(Url._parseQuery('http://localhost/?foo=bar&foo=qaz'),
                         {foo: ['bar', 'qaz']});
    });

    it('parses three-element array value', function() {
        assert.deepEqual(
            Url._parseQuery('http://localhost/?foo=bar&foo=qaz&foo=qux'),
            {foo: ['bar', 'qaz', 'qux']});
    });

    it('handles empty', function() {
        assert.deepEqual(Url._parseQuery(''), {});
    });
});


describe('_setQuery', function() {
    it('sets', function() {
        assert.equal(Url._setQuery('http://localhost/', 'foo', 'bar'),
                     'http://localhost/?foo=bar');
    });

    it('sets with one existing parameter', function() {
        assert.equal(Url._setQuery('http://localhost/?foo=bar', 'qux', 'qaz'),
                     'http://localhost/?foo=bar&qux=qaz');
    });

    it('overwrites', function() {
        assert.equal(Url._setQuery('http://localhost/?qux=qaz', 'qux', 'bar'),
                     'http://localhost/?qux=bar');
    });

    it('overwrites with one existing parameter', function() {
        assert.equal(Url._setQuery('http://localhost/?foo=bar&qux=qaz', 'qux',
                                   'bar'),
                     'http://localhost/?foo=bar&qux=bar');
    });

    it('handles array value', function() {
        assert.equal(Url._setQuery('http://localhost/', 'foo',
                                   ['bar', 'baz']),
                     'http://localhost/?foo=bar&foo=baz');
    });

    it('handles array with one existing parameter', function() {
        assert.equal(Url._setQuery('http://localhost/?qux=qaz', 'foo',
                                   ['bar', 'baz']),
                     'http://localhost/?foo=bar&qux=qaz&foo=baz');
    });

    it('handles array value overwrite', function() {
        assert.equal(Url._setQuery('http://localhost/?foo=qaz', 'foo',
                                   ['bar', 'baz']),
                     'http://localhost/?foo=bar&foo=baz');
    });
});


describe('_unQuery', function() {
    it('unsets', function() {
        assert.equal(Url._unQuery('http://localhost/?foo=bar', 'foo'),
                     'http://localhost/');
    });

    it('unsets multiple', function() {
        assert.equal(Url._unQuery('http://localhost/?foo=bar&qux=qaz&a=b',
                                  ['foo', 'a']),
                     'http://localhost/?qux=qaz');
    });

    it('unsets array', function() {
        assert.equal(Url._unQuery('http://localhost/?foo=bar&foo=baz',
                                  ['foo', 'bar']),
                     'http://localhost/');
    });
});
