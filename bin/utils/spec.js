describe('utils', () => {
  let utils;

  const chai = require('chai');
  const expect = chai.expect;
  const sinon = require('sinon');
  const proxyquire =  require('proxyquire');

  const EXIT_1_ERROR = new Error('exit 1');

  const shellStub = {
    exec: sinon.stub(),
    exit: sinon.stub(),
    echo: sinon.spy(),
    which: sinon.stub(),
    cat: sinon.stub(),
  };

  shellStub.exit.withArgs(1).throws(EXIT_1_ERROR);
  shellStub.which.withArgs('jq').returns(true);

  const ENV_FILE_NAME = '.env';
  const TOKEN_VALUE = 'dsscdsxsaasxsdsd';
  const ENV_FILE_STDOUT = `TOKEN=${TOKEN_VALUE}\n`;

  shellStub.cat.withArgs(ENV_FILE_NAME).returns({
    stdout: ENV_FILE_STDOUT,
  });

  const VERSION = '0.0.1';
  const REPO_FULLNAME = 'foo/bar';
  const packageJson = {
    version: VERSION,
    repository: {
      fullname: REPO_FULLNAME,
    },
  };

  shellStub.cat.withArgs('package.json').returns({
    stdout: JSON.stringify(packageJson),
    exec: shellStub.exec,
  });

  describe('if no jq installed', () => {
    before(() => {
      shellStub.which.withArgs('jq').returns(false);
    });

    after(() => {
      shellStub.which.reset();
    });

    it('should exit', () => {
      try {
        utils = proxyquire('.', {
          shelljs: shellStub,
        });
      } catch (e) {
        expect(e).to.equal(EXIT_1_ERROR);
      }
    });
  });

  describe('if jq installed', () => {
    before(() => {
      shellStub.which.withArgs('jq').returns(true);
      utils = proxyquire('.', {
        shelljs: shellStub,
      });
    });

    describe('extractEnv', () => {
      it('should read from provided file', () => {
        const env = utils.extractEnv(ENV_FILE_NAME);

        sinon.assert.calledWith(shellStub.cat, ENV_FILE_NAME);
      });

      it('should return correct key value map', () => {
        const env = utils.extractEnv(ENV_FILE_NAME);

        expect(env.TOKEN).to.equal(TOKEN_VALUE);
      });
    });

    describe('getRepoFullnameFromPackage', () => {
      it('should read from package.json', () => {
        shellStub.exec.withArgs('jq ".repository.url"').returns({
          stdout: `"https://github.com/${REPO_FULLNAME}"\n`,
        });

        const repoName = utils.getRepoFullnameFromPackage();

        sinon.assert.calledWith(shellStub.cat, 'package.json');
      });

      it('should return correct value from package.json', () => {
        shellStub.exec.withArgs('jq ".repository.url"').returns({
          stdout: `"https://github.com/${REPO_FULLNAME}"\n`,
        });

        const repoName = utils.getRepoFullnameFromPackage();

        expect(repoName).to.equal(REPO_FULLNAME);
      });

      it('should return only the repo fullname (without .git)', () => {
        shellStub.exec.withArgs('jq ".repository.url"').returns({
          stdout: `"https://github.com/${REPO_FULLNAME}.git"\n`,
        });

        const repoName = utils.getRepoFullnameFromPackage();

        expect(repoName).to.equal(REPO_FULLNAME);
      });
    });

    describe('getVersionFromPackage', () => {
      before(() => {
        shellStub.exec.withArgs('jq ".version"').returns({
          stdout: `"${VERSION}"\n`,
        });
      });

      it('should read from package.json', () => {
        const repoName = utils.getVersionFromPackage();

        sinon.assert.calledWith(shellStub.cat, 'package.json');
      });

      it('should return correct value from package.json', () => {
        const repoName = utils.getVersionFromPackage();

        expect(repoName).to.equal(VERSION);
      });
    });
  });
});
