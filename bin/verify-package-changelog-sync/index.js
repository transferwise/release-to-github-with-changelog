#! /usr/bin/env node
const shell = require('shelljs');
const colors = require('colors');

const { getVersionFromPackage } = require('../utils');
const { parseChangelog } = require('../parser');

function verifyPackageAndChangelogSync() {
  const { version } = parseChangelog(shell.cat('CHANGELOG.md'))[0];

  const versionFromPackage = getVersionFromPackage();

  if (versionFromPackage !== version) {
    console.log(`The package version (${versionFromPackage}) and the last changelog item version (${version}) don't match`.red);
    shell.exit(1);
  } else {
    console.log(`The package version and the last changelog item version are in sync`.green);
  }
}

module.exports = verifyPackageAndChangelogSync;
