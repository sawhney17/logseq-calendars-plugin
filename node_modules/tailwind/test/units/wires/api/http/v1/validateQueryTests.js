'use strict';

const assert = require('assertthat');

const validateQuery = require('../../../../../../src/wires/api/http/v1/validateQuery');

suite('validateQuery', () => {
  test('is a function.', async () => {
    assert.that(validateQuery).is.ofType('function');
  });

  test('throws an error if query is missing.', async () => {
    assert.that(() => {
      validateQuery();
    }).is.throwing('Query is missing.');
  });

  suite('orderBy', () => {
    test('is valid when value of orderBy is asc, ascending, desc or descending.', async () => {
      assert.that(() => {
        validateQuery({
          orderBy: {
            foo: 'asc',
            bar: 'ascending',
            baz: 'desc',
            bas: 'descending'
          }
        });
      }).is.not.throwing();
    });

    test('is invalid when value of orderBy is not asc, ascending, desc or descending.', async () => {
      assert.that(() => {
        validateQuery({
          orderBy: {
            foo: 'invalid-criteria'
          }
        });
      }).is.throwing('Invalid query.');
    });
  });
});
