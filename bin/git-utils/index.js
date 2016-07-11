#! /usr/bin/env node
var shell = require('shelljs');
var argv = require('yargs').argv;

var utils = require('../utils');


module.exports = {
  bumpPackageVersion: bumpPackageVersion,
  addAndCommitPackage: addAndCommitPackage,
  pushToMaster: pushToMaster
};

function bumpPackageVersion(bumpLevel) {
  shell.exec('npm version --no-git-tag-version ' + bumpLevel);
}

function addAndCommitPackage() {
  var version = utils.getVersionFromPackage();
  addAndCommitForVersion(version);
}

function addAndCommitForVersion(version) {
  shell.exec('git add package.json');
  shell.exec('git commit package.json -m ' + getReleaseMessage(version));
}

function getReleaseMessage(version) {
  return '"Release ' + version +'"';
}

function pushToMaster() {
  shell.exec('git push origin master');
}
