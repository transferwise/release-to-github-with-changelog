const SEPARATOR = '<!-- -->';

function parseChangelogItem(item) {
  const parts = item.trim().split('\n');
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

function isUsableItem(potentialItem) {
  return potentialItem.split('\n').length > 1;
}

function isChangelogCorrectlyFormatted(items) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!isUsableItem(item)) return false;
  }
  return true;
}

const BADLY_FORMATTED_CHANGELOG = `An item in your CHANGELOG seems to be badly
formatted. Please check you have no trailing separator at the end of your CHANGELOG`;
function checkChangelogIsCorrectlyFormatted(items) {
  if (!isChangelogCorrectlyFormatted(items)) throw new Error(BADLY_FORMATTED_CHANGELOG);
}

function parseChangelog(stdOut) {
  const changelogItems = stdOut.split(SEPARATOR);
  checkChangelogIsCorrectlyFormatted(changelogItems);
  return changelogItems.filter(isUsableItem).map(parseChangelogItem);
}

module.exports = {
  SEPARATOR,
  parseChangelog,
  parseChangelogItem,
};
