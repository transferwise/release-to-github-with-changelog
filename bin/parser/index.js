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

const BADLY_FORMATTED_CHANGELOG = `Your CHANGELOG.md seems to be badly formatted.
Every item should start with #v1.0.0\n##Release title\n`;

function parseChangelog(stdOut) {
  try {
    return getItemsFromStdOut(stdOut);
  } catch (e) {
    console.error(e.message);
    throw new Error(BADLY_FORMATTED_CHANGELOG);
  }
}

function getItemsFromStdOut(stdOut) {
  let indexes = [];
  let items = [];

  const itemVersionRegex = /#\s?(v\d\.\d\.?\d?)/g;
  let match;
  while ((match = itemVersionRegex.exec(stdOut)) !== null) {
    indexes.push({ version: match[1], index: match.index })
  }

  if (indexes.length < 1) throw new Error(BADLY_FORMATTED_CHANGELOG);

  for (let i = 0; i < indexes.length; i++) {
    if (i < indexes.length - 1) {
      items.push(parseChangelogItem(stdOut.substring(indexes[i].index, indexes[i+1].index)));
    } else {
      items.push(parseChangelogItem(stdOut.substring(indexes[i].index)));
    }
  }

  return items;
}

module.exports = {
  parseChangelog,
  parseChangelogItem,
};
