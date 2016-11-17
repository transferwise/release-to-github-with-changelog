#! /usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');

const { getVersionFromPackage, getRepoFullnameFromPackage } = require('./utils');
const { getPublishReleaseFunction } = require('./publish-github-release');
const { parseChangelog } = require('./parser');


function publishLastChangelogAsReleaseToGithub() {
  const repoFullname = getValidRepoFullnameOrExit();
  const githubToken = getGithubTokenOrExit();

  const { version, releaseTitle, releaseDescription } = parseChangelog(shell.cat('CHANGELOG.md'))[0];
  console.log(releaseTitle, releaseDescription);

  checkVersionFromPackageEquals(version);

  const publishRelease = getPublishReleaseFunction(repoFullname, githubToken);

  if (releaseDescription) {
    publishRelease(`v${version}`, releaseTitle, releaseDescription);
  } else {
    publishRelease(`v${version}`, releaseTitle);
  }
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


publishLastChangelogAsReleaseToGithub();
