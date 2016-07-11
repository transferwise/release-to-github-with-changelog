describe('curl-utils', function() {
  var curlUtils = require('.');
  var expect = require('chai').expect;

  describe('formCurlHeader', function() {
    it('should return correct curl string for header', function() {
      var header = curlUtils.formCurlHeader('foo', 'bar');

      expect(header).to.equal('-H "foo: bar"');
    });
  });
});
