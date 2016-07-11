#! /usr/bin/env node
var colors = require('colors');

module.exports = {
  error: {
    MISSSING_BUMP_LEVEL: 'Please specify a bump level'.red + ' docs here https://docs.npmjs.com/cli/version',
    MISSING_RELEASE_TITLE: 'Please specify a release title'.red
  },
  info: {
    MISSING_RELEASE_DESCRIPTION: 'You can write a markdown description for you release as 3rd argument'.blue
  }
}
