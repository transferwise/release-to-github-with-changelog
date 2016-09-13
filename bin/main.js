#! /usr/bin/env node
var shell = require('shelljs');
var colors = require('colors');

var utils = require('./utils');
var GithubClient = require('./github-client');

var SEPARATOR = '<!-- -->';

var REPO_FULLNAME = utils.getRepoFullnameFromPackage();
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;


if (!REPO_FULLNAME || !REPO_FULLNAME.split('/').length == 2) {
  console.log('Please add your repo full name in "repository.fullname" of package.json'.red);
  shell.exit(1);
}

if (!GITHUB_TOKEN) {
  console.log('Please add your Github token in GITHUB_TOKEN env variable'.red);
  shell.exit(1);
}

function publisItemAsReleaseToGithub(item) {
  var githubClient = new GithubClient(REPO_FULLNAME, GITHUB_TOKEN);
  var parts = item.split('\n');
  var tagName = parts[0].trim().replace(/#/g, '').trim();
  var releaseTitle = parts[1].trim().replace(/#/g, '').trim();

  var versionFromPackage = utils.getVersionFromPackage();
  var versionFromLastChangelogItem = tagName.replace('v', '');
  if (versionFromPackage !== versionFromLastChangelogItem) {
    console.log(('The package version (' + versionFromPackage + ') and the last ' +
    'changelog item version (' + versionFromLastChangelogItem + ')  don\'t match').red);
    shell.exit(1);
  }

  if (parts.length > 2) {
    githubClient.publishRelease(tagName, releaseTitle, parts.slice(2).join('\n'));
  } else {
    githubClient.publishRelease(tagName, releaseTitle);
  }
}

function publishLastChangelogAsReleaseToGithub() {
  var changelogItems = shell.cat('CHANGELOG.md').split(SEPARATOR);
  publisItemAsReleaseToGithub(changelogItems[0]);
}

publishLastChangelogAsReleaseToGithub();
