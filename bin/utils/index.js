#! /usr/bin/env node
const shell = require('shelljs');

if (!shell.which('jq')) {
  shell.echo('Sorry, this script requires jq: run "brew install jq" or download at https://stedolan.github.io/jq/');
  shell.exit(1);
}


module.exports = {
  extractEnv,
  getRepoFullnameFromPackage,
  getVersionFromPackage,
};

function extractEnv(envFile) {
  const rawEnv = shell.cat(envFile).stdout;
  const couples = rawEnv
  .replace(/'/g, '')
  .split('\n')
  .filter(couple => couple.indexOf('=') > -1);
  const env = {};
  couples.forEach(couple => {
    env[couple.split('=')[0]] = couple.split('=')[1];
  });
  return env;
}

function getRepoFullnameFromPackage() {
  const repoUrl = cleanStdout(shell.cat('package.json').exec('jq ".repository.url"').stdout);
  const urlAsArray = repoUrl.split('/');
  const indexOfGithubDomain = urlAsArray.indexOf('github.com');

  return `${urlAsArray[indexOfGithubDomain + 1]}/${urlAsArray[indexOfGithubDomain + 2]}`;
}

function getVersionFromPackage() {
  return cleanStdout(shell.cat('package.json').exec('jq ".version"').stdout);
}

function cleanStdout(stdoutString) {
  const cleanedStdout = stdoutString.trim().replace(/"/g, '');
  if (cleanedStdout !== 'null' && cleanedStdout !== 'undefined') {
    return cleanedStdout;
  }
  return '';
}
