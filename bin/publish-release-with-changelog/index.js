#! /usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');
const yargs = require('yargs');

const { getVersionFromPackage, getRepoFullnameFromPackage } = require('../utils');
const { getPublishReleaseFunction } = require('../publish-github-release');
const { parseChangelog } = require('../parser');


function publishLastChangelogAsReleaseToGithub() {
  const repoFullname = getValidRepoFullnameOrExit();
  const githubToken = getGithubTokenOrExit();

  const { version, releaseTitle, releaseDescription } = parseChangelog(shell.cat('CHANGELOG.md'))[0];

  checkVersionFromPackageEquals(version);
  const targetBranch = yargs.argv.branch || 'master';

  const publishRelease = getPublishReleaseFunction(repoFullname, githubToken, targetBranch);

  if (releaseDescription) {
    return handlePublishReleasePromise(
      publishRelease(`v${version}`, releaseTitle, releaseDescription),
      version,
      targetBranch);
  }
  return handlePublishReleasePromise(
    publishRelease(`v${version}`, releaseTitle),
    version,
    targetBranch);
}

function handlePublishReleasePromise(promise, version, targetBranch) {
  return promise.then(response => {
    console.log(response);
    console.log(`Succesfully published ${version} release for target ${targetBranch}`.green);
    shell.exit(0);
  })
  .catch(err => {
    console.log(`Error when pubishing ${version} release for target ${targetBranch}`.red);
    console.log(JSON.stringify(err).red);
    shell.exit(1);
  });
}

function getGithubTokenOrExit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log('Please add your Github token as GITHUB_TOKEN env variable'.red);
    shell.exit(1);
  }
  return token;
}

function getValidRepoFullnameOrExit() {
  const repoFullname = getRepoFullnameFromPackage();
  console.log(repoFullname);
  if (!repoFullname || repoFullname.split('/').length !== 2) {
    console.log('Please add your repo full name in "repository.fullname" of package.json'.red);
    shell.exit(1);
  }
  return repoFullname;
}

function checkVersionFromPackageEquals(version) {
  const versionFromPackage = getVersionFromPackage();

  if (versionFromPackage !== version) {
    console.log(`The package version (${versionFromPackage}) and the last changelog item version ${version}) don't match`.red);
    shell.exit(1);
  }
}


module.exports = publishLastChangelogAsReleaseToGithub;
