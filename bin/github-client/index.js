#! /usr/bin/env node
var shell = require('shelljs');
var colors = require('colors');
var curlUtils = require('../curl-utils');

var formCurlHeader = curlUtils.formCurlHeader;
var GITHUB_REPOS_URI = 'https://api.github.com/repos';

module.exports = GithubClient;

function GithubClient(repoFullname, token) {
  this.repoFullname = repoFullname;
  this.token = token;
}

GithubClient.prototype.publishRelease = function(version, releaseTitle, releaseDescription) {
  if (!version) {
    console.error('Please specify a version for the release to publish'.red);
    shell.exit(1);
  }

  if (!releaseTitle) {
    console.error('Please specify a title for the release to publish'.red);
    shell.exit(1);
  }

  var releaseResource = formGithubReleaseResource(
    version, releaseTitle, releaseDescription
  );

  var releaseUri = getReleasesUri(this.repoFullname);

  var shellCommand = 'curl '
    + formCurlHeader('Accept', 'application/vnd.github.v3+json') + ' '
    + formCurlHeader('Authorization', 'token ' + this.token) + ' '
    + formCurlHeader('Content-Type', 'application/json') + ' '
    + '-X POST -d \'' + JSON.stringify(releaseResource) + '\' '
    + releaseUri;

  console.log('Publishing new release to '.blue + releaseUri);
  shell.exec(
    shellCommand,
    function(code, stdout, stderr) {
      var releaseResource = JSON.parse(stdout);
      if (code === 0) {
        if (releaseResource.id) {
          console.log('Successfully created new release, with id '.green + releaseResource.id);
        } else {
          console.log(stdout.red);
        }
      } else {
        console.error('Exit with code 0:'.underline.red, stderr.red);
      }
    }
  );
};

function getReleasesUri(repoFullname) {
  return [GITHUB_REPOS_URI, repoFullname, 'releases'].join('/');
}

function formGithubReleaseResource(version, title, description) {
  var releaseResource = {
    'tag_name': version.indexOf('v') < 0 ? 'v' + version : version,
    'target_commitish': 'master',
    'name': title
  };
  if (description) {
    releaseResource.body = description;
  }
  return releaseResource;
};
