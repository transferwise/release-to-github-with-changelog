describe('getPublishReleaseFunction', () => {
  const chai = require('chai');
  const expect = chai.expect;

  const { parseChangelog } = require('.');

  const CHANGELOG =
`# v22.0.12
## Title of high version

# v10.111.2
## Title of version 111.2
### Example
\`\`\`
// notes
\`\`\`

# v0.0.111
## Title of version 1`;

  describe('parseChangelog', () => {
    it('returns correct list of changelog items', () => {
      const items = parseChangelog(CHANGELOG);
      expect(items[0].version).to.equal('22.0.12');
      expect(items[0].releaseTitle).to.equal('Title of high version');

      expect(items[1].version).to.equal('10.111.2');
      expect(items[1].releaseTitle).to.equal('Title of version 111.2');
      expect(items[1].releaseDescription).to.equal(`### Example
\`\`\`
// notes
\`\`\``);

      expect(items[2].version).to.equal('0.0.111');
      expect(items[2].releaseTitle).to.equal('Title of version 1');

    });

    [
`# 0.0.2
## Title of version 2
`,
`v0.0.2
## Title of version 2,
`,
    ].forEach(badlyFormattedChangelog => {
      it('throws when badly formatted CHANGELOG', () => {
        let exception;

        try {
          parseChangelog(badlyFormattedChangelog);
        } catch (e) {
          exception = e;
        }

        expect(exception).to.not.equal(undefined);
      });
    });
  });
});
