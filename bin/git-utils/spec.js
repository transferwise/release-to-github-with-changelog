describe('git-utils', function() {

  var chai = require('chai');
  var assert = chai.assert;
  var sinon = require('sinon');
  var proxyquire =  require('proxyquire');

  var VERSION = '0.0.1';

  var shellStub = {
    exec: sinon.spy()
  };
  var utilsStub = {
    getVersionFromPackage: function() { return VERSION; }
  };

  // when no overrides are specified, path.extname behaves normally
  var gitUtils = proxyquire('.', {
    'shelljs': shellStub,
    '../utils': utilsStub
  });

  describe('bumpPackageVersion', function() {

    it('should make correct shell query', function() {
      var res = gitUtils.bumpPackageVersion(VERSION);

      assert(shellStub.exec.calledWith('npm version --no-git-tag-version ' + VERSION));
    });
  });

  describe('addAndCommitPackage', function() {

    it('should add package.json', function() {
      gitUtils.addAndCommitPackage(VERSION);

      assert(shellStub.exec.calledWith('git add package.json'));
    });

    it('should commit package.json with correct message', function() {
      gitUtils.addAndCommitPackage(VERSION);

      var expectedMessage = '"Release ' + VERSION +'"';
      assert(shellStub.exec.lastCall.calledWith('git commit package.json -m ' + expectedMessage));
    });
  });

  describe('pushToMaster', function() {

    it('should push to origin master', function() {
      gitUtils.pushToMaster();

      assert(shellStub.exec.calledWith('git push origin master'));
    });
  });
});
