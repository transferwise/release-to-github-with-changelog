#! /usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');
const curlUtils = require('../curl-utils');

const formCurlHeader = curlUtils.formCurlHeader;
const GITHUB_REPOS_URI = 'https://api.github.com/repos';

class GithubReleaseClient {
  constructor(repoFullname, token, branch) {
    this.repoFullname = repoFullname;
    this.token = token;
    this.branch = branch || 'master';
  }

  publishRelease(version, releaseTitle, releaseDescription) {
    if (!version) {
      console.error('Please specify a version for the release to publish'.red);
      shell.exit(1);
    }

    if (!releaseTitle) {
      console.error('Please specify a title for the release to publish'.red);
      shell.exit(1);
    }

    const releaseResourceCmd = formGithubReleaseResource({
      version,
      title: releaseTitle,
      description: releaseDescription,
      branch: this.branch,
    });

    const releaseUri = getReleasesUri(this.repoFullname);

    const shellCommand = 'curl '
      + formCurlHeader('Accept', 'application/vnd.github.v3+json') + ' '
      + formCurlHeader('Authorization', `token ${this.token}`) + ' '
      + formCurlHeader('Content-Type', 'application/json') + ' '
      + '-X POST -d \'' + JSON.stringify(releaseResourceCmd) + '\' '
      + releaseUri;

    console.log(`Publishing new release against "${this.branch}" branch, to `.blue + releaseUri);
    shell.exec(
      shellCommand,
      (code, stdout, stderr) => {
        if (code === 0) {
          const releaseResource = JSON.parse(stdout);
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
  }
}

function getReleasesUri(repoFullname) {
  return [GITHUB_REPOS_URI, repoFullname, 'releases'].join('/');
}

function formGithubReleaseResource({ version, title, description, branch }) {
  const releaseResource = {
    tag_name: version.indexOf('v') < 0 ? `v${version}` : version,
    target_commitish: branch,
    name: title,
  };
  if (description) {
    releaseResource.body = description;
  }
  return releaseResource;
}

function getPublishReleaseFunction(repoFullname, token, branch) {
  const githubReleaseClient = new GithubReleaseClient(repoFullname, token, branch);
  return (version, releaseTitle, releaseDescription) => (
    githubReleaseClient.publishRelease(version, releaseTitle, releaseDescription)
  );
}

module.exports = {
  getPublishReleaseFunction,
};
