#! /usr/bin/env node
var shell = require('shelljs');

if (!shell.which('jq')) {
  shell.echo('Sorry, this script requires jq: run "brew install jq" or download at https://stedolan.github.io/jq/');
  shell.exit(1);
}


module.exports = {
  extractEnv: extractEnv,
  getRepoFullnameFromPackage: getRepoFullnameFromPackage,
  getVersionFromPackage: getVersionFromPackage
};

function extractEnv(envFile) {
  var rawEnv = shell.cat(envFile).stdout;
  var couples = rawEnv
  .replace(/\'/g, '')
  .split('\n')
  .filter(function(couple) {
    return couple.indexOf('=') > -1;
  });
  var env = {};
  couples.forEach(function(couple) {
    env[couple.split('=')[0]] = couple.split('=')[1]
  });
  return env;
}

function getRepoFullnameFromPackage() {
  return cleanStdout(
    shell.cat('package.json').exec('jq ".repository.fullname"').stdout
  );
}

function getVersionFromPackage() {
  return cleanStdout(
    shell.cat('package.json').exec('jq ".version"').stdout
  );
}

function cleanStdout(stdoutString) {
  var cleanedStdout = stdoutString.trim().replace(/\"/g, '');
  if (cleanedStdout != 'null' && cleanedStdout != 'undefined') {
    return cleanedStdout;
  }
}
