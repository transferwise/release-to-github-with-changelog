const SEPARATOR = '<!-- -->';

function parseChangelogItem(item) {
  const parts = item.split('\n');
  const tagName = parts[0].trim().replace(/#/g, '').trim();
  const releaseTitle = parts[1].trim().replace(/#/g, '').trim();
  const releaseDescription = parts.length > 1 && parts.slice(2).join('\n');

  const version = tagName.replace('v', '');

  return {
    version,
    releaseTitle,
    releaseDescription,
  };
}

function parseChangelog(stdOut) {
  const changelogItems = stdOut.split(SEPARATOR);
  return changelogItems.map(parseChangelogItem);
}

module.exports = {
  SEPARATOR,
  parseChangelog,
  parseChangelogItem,
};
