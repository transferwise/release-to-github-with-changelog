#! /usr/bin/env node
var shell = require('shelljs');
var argv = require('yargs').argv;
var colors = require('colors');

var utils = require('./utils');
var gitUtils = require('./git-utils');
var messages = require('./messages');
var GithubClient = require('./github-client');

var SEPARATOR = '\n=-=-=-=-=\n\n';

var REPO_FULLNAME = utils.getRepoFullnameFromPackage();
var GITHUB_ENV_FILE = '.github_env';
var env = utils.extractEnv(GITHUB_ENV_FILE);
var TOKEN = env.TOKEN;


if (!REPO_FULLNAME) {
  console.log('Please add "fullname" field to "repository" in package.json'.red);
  shell.exit(1);
}

if (!TOKEN) {
  console.log('Please add your Github token in an .github_env file'.red, 'TOKEN=yourToken');
  shell.exit(1);
}

if (shell.grep('.github_env', '.gitignore').stdout.indexOf('.github_env') < 0) {
  console.log('You should probably add .github_env to your .gitignore'.red);
  shell.exit(1);
}

function publisItemAsReleaseToGithub(item) {
  var githubClient = new GithubClient(REPO_FULLNAME, TOKEN);
  var parts = item.split('\n');
  var tagName = parts[0].replace(/#/g, '').trim();
  var releaseTitle = parts[1].replace(/#/g, '').trim();

  if (parts.length > 2) {
    githubClient.publishRelease(tagName, releaseTitle, parts.slice(2).join('\n'));
  } else {
    githubClient.publishRelease(tagName, releaseTitle);
  }
}

function publishLastChangelogAsReleaseToGithub() {
  var changelogItems = shell.cat('CHANGELOG.md').split(SEPARATOR);
  var lastItem = changelogItems[0];
  publisItemAsReleaseToGithub(changelogItems[0]);
}

publishLastChangelogAsReleaseToGithub();
