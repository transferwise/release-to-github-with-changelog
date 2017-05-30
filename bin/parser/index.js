function parseChangelogItem(item) {
  const parts = item.trim().split('\n');
  const tagName = parts[0].trim().replace(/#/g, '').trim();
  const releaseTitle = parts[1].trim().replace(/#/g, '').trim();

  if (!tagName || !releaseTitle) throw new Error(BADLY_FORMATTED_CHANGELOG);

  const releaseDescription = parts.length > 1 && parts.slice(2).join('\n');

  const version = tagName.replace('v', '');

  return {
    version,
    releaseTitle,
    releaseDescription,
  };
}

const BADLY_FORMATTED_CHANGELOG = `Your CHANGELOG.md seems to be badly formatted.
Every item should start with:
#v1.0.0
##Release title`;

function parseChangelog(stdOut) {
  try {
    return getItemsAsStrings(stdOut).map(parseChangelogItem);
  } catch (e) {
    console.error(e.message);
    throw new Error(BADLY_FORMATTED_CHANGELOG);
  }
}

function getItemsAsStrings(changelog) {
  let items = [];

  let regexMatches = getRegexMatchesForChangelogItems(changelog);

  if (regexMatches.length < 1) throw new Error(BADLY_FORMATTED_CHANGELOG);

  for (let i = 0; i < regexMatches.length; i++) {
    const match = regexMatches[i];
    if (i < regexMatches.length - 1) {
      const nextMatch = regexMatches[i+1];
      items.push(changelog.substring(match.index, nextMatch.index));
    } else {
      items.push(changelog.substring(match.index));
    }
  }

  return items;
}

function getRegexMatchesForChangelogItems(changelog) {
  const itemVersionRegex = /#\s?(v\d\.\d\.?\d?)/g;
  let match;
  let regexMatches = [];
  while ((match = itemVersionRegex.exec(changelog)) !== null) {
    regexMatches.push(match);
  }
  return regexMatches;
}

module.exports = {
  parseChangelog,
  parseChangelogItem,
};
