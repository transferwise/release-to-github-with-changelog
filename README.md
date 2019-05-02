# release2hub

[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]

[npm-url]: https://npmjs.org/package/release2hub
[travis-image]: https://img.shields.io/travis/yunnysunny/release2hub.svg?style=flat-square
[travis-url]: https://travis-ci.org/yunnysunny/release2hub
[david-image]: https://img.shields.io/david/yunnysunny/release2hub.svg?style=flat-square
[david-url]: https://david-dm.org/yunnysunny/release2hub
[node-image]: https://img.shields.io/badge/node.js-%3E=_6-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

[![NPM](https://nodei.co/npm/release2hub.png?downloads=true)](https://nodei.co/npm/node-release2hub/) 

## Goal
The origin project is hosted on [transferwise/release-to-github-with-changelog](https://github.com/transferwise/release-to-github-with-changelog), this project is an enhancement of the original, adding some features, such as the support of Windows.

Keep the released npm package in sync with the GitHub repo master branch:
- the last `CHANGELOG.md` item is in sync with the last release on Github, with corresponding version tag
- the `package.json` version is in sync with the `master` branch version tag

![alt tag](img/changelog_releases_sync.png)

## Usage

### The usage of CLI 
#### release2hub
The sources of truth are `CHANGELOG.md` and `package.json`.
Your interface is your `CHANGELOG.md`.

Usage: release2hub [options]

Options:
                                                                                     
--branch [branchName]         Default is master.             
--remote [isUseRemoteUrl]  Default is false, if set true, the change log will send to git origin remote url, otherwise, it will use the field of `repository.url` form package.json.

#### release-check4hub
You can include a check of your `CHANGELOG.md` format in your test command by using the provided `release-check4hub` command.

### The usage of CHANGELOG.md
Every `CHANGELOG.md` item should represent a release note of the version it describes:
```
# v0.2.0 //version tag
## The release title
// The release description in markdown

# v0.1.9
...
```


## Example
### Example of package.json
> Don't forget the `repository.url`. It will be parsed to extract the repository full name (`myOrg/myRepo` in this example).

```json
{
  "version": "0.2.0",
  "respository": {
    "type": "git",
    "url": "git+https://github.com/myOrg/myRepo.git"
  },
  "files": ["dist"],
  "scripts": {
    "build": // build dist files
    "release": "npm publish && npm run release2hub",
    "release": "npm publish && npm run release2hub --branch=releases", // optional branch name
    "test": "release-check4hub && karma start"
  }
}
```

### Example of CHANGELOG.md

```
# v0.2.0
## We can fly
Great news! The machine can now also fly!

# v0.1.0
## We can move
### What the machine does
It can move, a bit slowly but still it moves.

//...
```

## LICENSE

[MIT](LICENSE)
