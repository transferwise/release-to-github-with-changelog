describe('getPublishReleaseFunction', () => {
  const chai = require('chai');
  const expect = chai.expect;
  const sinon = require('sinon');
  const proxyquire =  require('proxyquire');

  const REPO_FULLNAME = 'foo/bar';
  const TOKEN = 'token';
  const EXIT_1_ERROR = new Error('exit 1');
  const VERSION = '0.0.1';
  const RELEASE_TITLE = 'This release is awesome';

  const shellStub = {
    exec: sinon.spy(),
    exit: sinon.stub(),
  };
  shellStub.exit.withArgs(1).throws(EXIT_1_ERROR);

  // when no overrides are specified, path.extname behaves normally
  const { getPublishReleaseFunction } = proxyquire('.', {
    shelljs: shellStub,
  });

  describe('publishRelease default', () => {
    let publishRelease;
    beforeEach(() => {
      publishRelease = getPublishReleaseFunction(REPO_FULLNAME, TOKEN);
    });

    afterEach(() => {
      shellStub.exec.reset();
    });

    it('should exit if no version provided', () => {
      try {
        publishRelease();
      } catch (e) {
        expect(e).to.equal(EXIT_1_ERROR);
      }
    });

    it('should exit if no title provided', () => {
      try {
        publishRelease(VERSION);
      } catch (e) {
        expect(e).to.equal(EXIT_1_ERROR);
      }
    });

    it('should make correct curl call and use master by default', () => {
      const expectedReleaseResource = {
        tag_name: `v${VERSION}`,
        target_commitish: 'master',
        name: RELEASE_TITLE,
      };
      const expectedCurlCommand = `curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token token" -H "Content-Type: application/json" -X POST -d '${JSON.stringify(expectedReleaseResource)}' https://api.github.com/repos/${REPO_FULLNAME}/releases`;

      publishRelease(VERSION, RELEASE_TITLE);

      const call = shellStub.exec.getCall(0);
      expect(call.args[0]).to.equal(expectedCurlCommand);
    });

    it('should add release description to release resource if provided', () => {
      const releaseDescription = 'Wonderful description';
      const expectedReleaseResource = {
        tag_name: `v${VERSION}`,
        target_commitish: 'master',
        name: RELEASE_TITLE,
        body: releaseDescription,
      };

      publishRelease(VERSION, RELEASE_TITLE, releaseDescription);

      const call = shellStub.exec.getCall(0);
      expect(call.args[0]).to.contain(JSON.stringify(expectedReleaseResource));
    });
  });

  describe('publishRelease for branch', () => {
    it('should make correct curl call and use master by default', () => {
      const publishRelease = getPublishReleaseFunction(REPO_FULLNAME, TOKEN, 'release');

      const expectedReleaseResource = {
        tag_name: `v${VERSION}`,
        target_commitish: 'release',
        name: RELEASE_TITLE,
      };
      const expectedCurlCommand = `curl -H "Accept: application/vnd.github.v3+json" -H "Authorization: token token" -H "Content-Type: application/json" -X POST -d '${JSON.stringify(expectedReleaseResource)}' https://api.github.com/repos/${REPO_FULLNAME}/releases`;

      publishRelease(VERSION, RELEASE_TITLE);

      const call = shellStub.exec.getCall(0);
      expect(call.args[0]).to.equal(expectedCurlCommand);
    });
  });
});
