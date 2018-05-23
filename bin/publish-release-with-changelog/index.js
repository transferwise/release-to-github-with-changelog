#! /usr/bin/env node
const fs = require('fs');
const shell = require('shelljs');
const colors = require('colors');
const yargs = require('yargs');

const { getRepoFullnameFromPackage } = require('../utils');
const { getPublishReleaseFunction } = require('../publish-github-release');
const { parseChangelog } = require('../parser');
const verifyPackageAndChangelogSync = require('../verify-package-changelog-sync');

function publishLastChangelogAsReleaseToGithub() {
  const repoFullname = getValidRepoFullnameOrExit();
  const githubToken = getGithubTokenOrExit();

  verifyPackageAndChangelogSync();

  const {
    version,
    releaseTitle,
    releaseDescription,
    preRelease,
  } = parseChangelog(fs.readFileSync('CHANGELOG.md', 'utf8'))[0];

  const targetBranch = yargs.argv.branch || 'master';

  const publishRelease = getPublishReleaseFunction(repoFullname, githubToken, targetBranch);

  if (releaseDescription) {
    return handlePublishReleasePromise(
      publishRelease(`v${version}`, releaseTitle, releaseDescription, preRelease),
      version,
      targetBranch,
      preRelease);
  }
  return handlePublishReleasePromise(
    publishRelease(`v${version}`, releaseTitle, undefined, preRelease),
    version,
    targetBranch,
    preRelease);
}

function handlePublishReleasePromise(promise, version, targetBranch, preRelease) {
  return promise.then(response => {
    console.log(response);
    console.log(`Succesfully published ${preRelease ? 'pre-release ' : ''}${version} release for target ${targetBranch}`.green);
    shell.exit(0);
  })
  .catch(err => {
    console.log(`Error when pubishing ${preRelease ? 'pre-release ' : ''}${version} release for target ${targetBranch}`.red);
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
  if (!repoFullname || repoFullname.split('/').length !== 2) {
    console.log('Please add your Github repo url under "repository.url" in package.json'.red);
    shell.exit(1);
  }
  return repoFullname;
}

module.exports = publishLastChangelogAsReleaseToGithub;
