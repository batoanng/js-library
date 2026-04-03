import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createYeomanTestHelpers,
  nodejsAddGeneratorPath,
} from './helpers';

test('nodejs-add fails when run outside a generated Node.js base project', async () => {
  const helpers = await createYeomanTestHelpers();

  await assert.rejects(
    async () =>
      helpers
        .run(nodejsAddGeneratorPath)
        .inTmpDir(() => {})
        .withArguments(['queue'])
        .run(),
    /can only be generated inside a t-generator Node\.js server project/,
  );
});
