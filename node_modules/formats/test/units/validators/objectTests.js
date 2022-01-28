'use strict';

const assert = require('assertthat');

const formats = require('../../../lib/formats'),
      validator = require('../../../lib/validators/object');

suite('object', () => {
  test('is a function.', done => {
    assert.that(validator).is.ofType('function');
    done();
  });

  test('returns a function.', done => {
    assert.that(validator()).is.ofType('function');
    done();
  });

  test('throws on unknown properties.', done => {
    assert.that(() => {
      validator({ nonExistent: 'foobar' });
    }).is.throwing('Unknown property nonExistent.');
    done();
  });

  suite('basics', () => {
    test('returns false for a non-object.', done => {
      assert.that(validator()(23)).is.false();
      done();
    });

    test('returns false for null.', done => {
      assert.that(validator()(null)).is.false();
      done();
    });

    test('returns false for undefined.', done => {
      assert.that(validator()(undefined)).is.false();
      done();
    });

    test('returns true for an object.', done => {
      assert.that(validator()({ foo: 'bar' })).is.true();
      done();
    });

    test('returns true for an empty object.', done => {
      assert.that(validator()({})).is.true();
      done();
    });

    suite('isOptional', () => {
      test('returns false for a missing mandatory object with null.', done => {
        assert.that(validator({ isOptional: false })(null)).is.false();
        done();
      });

      test('returns false for a missing mandatory object with undefined.', done => {
        assert.that(validator({ isOptional: false })(undefined)).is.false();
        done();
      });

      test('returns true for a missing optional object with null.', done => {
        assert.that(validator({ isOptional: true })(null)).is.true();
        done();
      });

      test('returns true for a missing optional object with undefined.', done => {
        assert.that(validator({ isOptional: true })(undefined)).is.true();
        done();
      });

      test('returns true for a missing optional object with sub-schemas.', done => {
        assert.that(validator({ schema: { foo: 'bar' }, isOptional: true })(null)).is.true();
        done();
      });
    });

    suite('schema', () => {
      suite('simple values', () => {
        suite('single value', () => {
          test('returns false if the schema is not fulfilled.', done => {
            assert.that(validator({
              schema: {
                foo: formats.number()
              }
            })({
              foo: 'bar'
            })).is.false();
            done();
          });

          test('returns true if the schema is fulfilled.', done => {
            assert.that(validator({
              schema: {
                foo: formats.string()
              }
            })({
              foo: 'bar'
            })).is.true();
            done();
          });
        });

        suite('multiple values', () => {
          test('returns false if the schema is not fulfilled.', done => {
            assert.that(validator({
              schema: {
                foo: formats.string(),
                bar: formats.number()
              }
            })({
              foo: 'bar',
              bar: null
            })).is.false();
            done();
          });

          test('returns true if the schema is fulfilled.', done => {
            assert.that(validator({
              schema: {
                foo: formats.string(),
                bar: formats.number()
              }
            })({
              foo: 'bar',
              bar: 23
            })).is.true();
            done();
          });
        });
      });

      suite('complex values', () => {
        suite('single value', () => {
          test('returns false if the schema is not fulfilled.', done => {
            assert.that(validator({
              schema: {
                foo: formats.object()
              }
            })({
              foo: null
            })).is.false();
            done();
          });

          test('returns true if the schema is fulfilled.', done => {
            assert.that(validator({
              schema: {
                foo: formats.object({
                  schema: {
                    bar: formats.string()
                  }
                })
              }
            })({
              foo: {
                bar: 'baz'
              }
            })).is.true();
            done();
          });
        });
      });
    });

    suite('isSchemaRelaxed', () => {
      test('throws an error when no schema is given.', done => {
        assert.that(() => {
          validator({ isSchemaRelaxed: true })({
            foo: 'bar'
          });
        }).is.throwing('Schema is missing.');
        done();
      });

      test('returns false if set to false and the object contains more than the schema.', done => {
        assert.that(validator({
          schema: {
            foo: formats.string()
          },
          isSchemaRelaxed: false
        })({
          foo: 'bar',
          bar: 23
        })).is.false();
        done();
      });

      test('returns true if set to false and the object fulfills the schema.', done => {
        assert.that(validator({
          schema: {
            foo: formats.string(),
            bar: formats.number()
          },
          isSchemaRelaxed: false
        })({
          foo: 'bar',
          bar: 23
        })).is.true();
        done();
      });

      test('returns true if set to true and the object contains more than the schema.', done => {
        assert.that(validator({
          schema: {
            foo: formats.string()
          },
          isSchemaRelaxed: true
        })({
          foo: 'bar',
          bar: 23
        })).is.true();
        done();
      });

      test('returns true if set to true and the object fulfills the schema.', done => {
        assert.that(validator({
          schema: {
            foo: formats.string(),
            bar: formats.number()
          },
          isSchemaRelaxed: true
        })({
          foo: 'bar',
          bar: 23
        })).is.true();
        done();
      });
    });
  });

  suite('default', () => {
    test('returns the value if valid.', done => {
      assert.that(validator({ default: { foo: 'bar' }})({ foo: 'baz' })).is.equalTo({ foo: 'baz' });
      done();
    });

    test('returns the default value if not valid.', done => {
      assert.that(validator({ default: { foo: 'bar' }})(23)).is.equalTo({ foo: 'bar' });
      done();
    });
  });
});
