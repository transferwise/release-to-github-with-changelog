describe('getPublishReleaseFunction', () => {
  const chai = require('chai');
  const expect = chai.expect;

  const { parseChangelog } = require('.');

  const CHANGELOG =
`# v0.0.2
## Title of version 2

<!-- -->

# v0.0.1
## Title of version 1`;

  describe('parseChangelog', () => {
    it('returns correct list of changelog items', () => {
      const items = parseChangelog(CHANGELOG);
      expect(items[0].version).to.equal('0.0.2');
    });

    [
`# 0.0.2
## Title of version 2
`,
`v0.0.2
## Title of version 2

<!-- -->`,
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
