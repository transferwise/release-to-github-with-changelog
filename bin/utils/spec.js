describe('utils', function() {
  var utils;

  var chai = require('chai');
  var assert = chai.assert;
  var expect = chai.expect;
  var sinon = require('sinon');
  var proxyquire =  require('proxyquire');

  var EXIT_1_ERROR = new Error('exit 1');

  var shellStub = {
    exec: sinon.stub(),
    exit: sinon.stub(),
    echo: sinon.spy(),
    which: sinon.stub(),
    cat: sinon.stub()
  };
  shellStub.exit.withArgs(1).throws(EXIT_1_ERROR);
  shellStub.which.withArgs('jq').returns(true);
  var ENV_FILE_NAME = '.env';
  var TOKEN_VALUE = 'dsscdsxsaasxsdsd';
  var ENV_FILE_STDOUT = 'TOKEN=' + TOKEN_VALUE + '\n';
  shellStub.cat.withArgs(ENV_FILE_NAME).returns({
    stdout: ENV_FILE_STDOUT
  });
  var VERSION = '0.0.1';
  var REPO_FULLNAME = 'foo/bar';
  var packageJson = {
    version: VERSION,
    repository: {
      fullname: REPO_FULLNAME
    }
  };
  shellStub.cat.withArgs('package.json').returns({
    stdout: JSON.stringify(packageJson),
    exec: shellStub.exec
  });

  describe('if no jq installed', function() {
    before(function() {
      shellStub.which.withArgs('jq').returns(false);
    });

    after(function() {
      shellStub.which.reset();
    });

    it('should exit', function() {
      try {
        utils = proxyquire('.', {
          'shelljs': shellStub
        });
      } catch(e) {
        expect(e).to.equal(EXIT_1_ERROR);
      }
    });
  });

  describe('if jq installed', function() {
    before(function() {
      shellStub.which.withArgs('jq').returns(true);
      utils = proxyquire('.', {
        'shelljs': shellStub
      });
    });

    describe('extractEnv', function() {

      it('should read from provided file', function() {
        var env = utils.extractEnv(ENV_FILE_NAME);

        sinon.assert.calledWith(shellStub.cat, ENV_FILE_NAME);
      });

      it('should return correct key value map', function() {
        var env = utils.extractEnv(ENV_FILE_NAME);

        expect(env.TOKEN).to.equal(TOKEN_VALUE)
      });
    });

    describe('getRepoFullnameFromPackage', function() {
      before(function() {
        shellStub.exec.withArgs('jq ".repository.fullname"').returns({
          stdout: '"' + REPO_FULLNAME + '"\n'
        })
      });

      it('should read from package.json', function() {
        var repoName = utils.getRepoFullnameFromPackage();

        sinon.assert.calledWith(shellStub.cat, 'package.json');
      });

      it('should return correct value from package.json', function() {
        var repoName = utils.getRepoFullnameFromPackage();

        expect(repoName).to.equal(REPO_FULLNAME);
      });
    });

    describe('getVersionFromPackage', function() {
      before(function() {
        shellStub.exec.withArgs('jq ".version"').returns({
          stdout: '"' + VERSION + '"\n'
        })
      });

      it('should read from package.json', function() {
        var repoName = utils.getVersionFromPackage();

        sinon.assert.calledWith(shellStub.cat, 'package.json');
      });

      it('should return correct value from package.json', function() {
        var repoName = utils.getVersionFromPackage();

        expect(repoName).to.equal(VERSION);
      });
    });
  });
});
