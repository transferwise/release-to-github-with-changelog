describe('GithubClient', function() {

  var chai = require('chai');
  var assert = chai.assert;
  var expect = chai.expect;
  var sinon = require('sinon');
  var proxyquire =  require('proxyquire');

  var REPO_FULLNAME = 'foo/bar';
  var TOKEN = 'token';
  var EXIT_1_ERROR = new Error('exit 1');
  var VERSION = '0.0.1';
  var RELEASE_TITLE = 'This release is awesome';

  var shellStub = {
    exec: sinon.spy(),
    exit: sinon.stub()
  };
  shellStub.exit.withArgs(1).throws(EXIT_1_ERROR);

  // when no overrides are specified, path.extname behaves normally
  var GithubClient = proxyquire('.', {
    'shelljs': shellStub
  });

  describe('construction', function() {

    it('should contain correct properties', function() {
      var githubClient = new GithubClient(REPO_FULLNAME, TOKEN);

      expect(githubClient.repoFullname).to.equal(REPO_FULLNAME);
      expect(githubClient.token).to.equal(TOKEN);
    });
  });

  describe('publishRelease', function() {
    var githubClient;
    beforeEach(function() {
      githubClient = new GithubClient(REPO_FULLNAME, TOKEN);
    });

    afterEach(function() {
      shellStub.exec.reset();
    });

    it('should exit if no version provided', function() {
      try {
        githubClient.publishRelease();
      } catch(e) {
        expect(e).to.equal(EXIT_1_ERROR);
      }
    });

    it('should exit if no title provided', function() {
      try {
        githubClient.publishRelease(VERSION);
      } catch(e) {
        expect(e).to.equal(EXIT_1_ERROR);
      }
    });

    it('should make correct curl call', function() {
      var expectedReleaseResource = {
        "tag_name": "v" + VERSION,
        "target_commitish": "master",
        "name": RELEASE_TITLE
      };
      var expectedCurlCommand = 'curl -H ' +
      '"Accept: application/vnd.github.v3+json" ' +
      '-H "Authorization: token token" ' +
      '-H "Content-Type: application/json" ' +
      '-X POST -d \'' + JSON.stringify(expectedReleaseResource)+ '\' ' +
      'https://api.github.com/repos/' + REPO_FULLNAME + '/releases';

      githubClient.publishRelease(VERSION, RELEASE_TITLE);

      var call = shellStub.exec.getCall(0);
      expect(call.args[0]).to.equal(expectedCurlCommand);
    });

    it('should add release description to release resource if provided', function() {
      var releaseDescription = 'Wonderful description';
      var expectedReleaseResource = {
        "tag_name": "v" + VERSION,
        "target_commitish": "master",
        "name": RELEASE_TITLE,
        "body": releaseDescription
      };

      githubClient.publishRelease(VERSION, RELEASE_TITLE, releaseDescription);

      var call = shellStub.exec.getCall(0);
      expect(call.args[0]).to.contain(JSON.stringify(expectedReleaseResource));
    });
  });
});
