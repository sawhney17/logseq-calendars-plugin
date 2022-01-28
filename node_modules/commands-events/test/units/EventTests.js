'use strict';

const assert = require('assertthat'),
      uuid = require('uuidv4');

const Event = require('../../src/Event');

suite('Event', () => {
  /* eslint-disable no-new */
  test('throws an error when no context is given.', done => {
    assert.that(() => {
      new Event({
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Context is missing.');
    done();
  });

  test('throws an error when no context name is given.', done => {
    assert.that(() => {
      new Event({
        context: {},
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Context name is missing.');
    done();
  });

  test('throws an error when no aggregate is given.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'bar'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Aggregate is missing.');
    done();
  });

  test('throws an error when no aggregate name is given.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'bar'
        },
        aggregate: {
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Aggregate name is missing.');
    done();
  });

  test('throws an error when no aggregate id is given.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'bar'
        },
        aggregate: {
          name: 'baz'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Aggregate id is missing.');
    done();
  });

  test('throws an error when no event name is given.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Event name is missing.');
    done();
  });

  test('throws an error when type is not a string.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        type: 23,
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Type must be a string.');
    done();
  });

  test('throws an error when data is not an object.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        data: 'foobarbaz',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Data must be an object.');
    done();
  });

  test('throws an error when no metadata are given.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo'
      });
    }).is.throwing('Metadata are missing.');
    done();
  });

  test('throws an error when no correlation id is given.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing();
    done();
  });

  test('throws an error when no causation id is given.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing();
    done();
  });

  test('throws an error when authorization metadata is not an object.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          isAuthorized: 'bar'
        }
      });
    }).is.throwing('Authorization must be an object.');
    done();
  });

  test('throws an error when authorization metadata owner is missing.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          isAuthorized: {}
        }
      });
    }).is.throwing('Owner is missing.');
    done();
  });

  test('throws an error when authorization metadata authenticated is missing.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          isAuthorized: {
            owner: uuid()
          }
        }
      });
    }).is.throwing('For authenticated is missing.');
    done();
  });

  test('throws an error when authorization metadata public is missing.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'foo',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          isAuthorized: {
            owner: uuid(),
            forAuthenticated: true
          }
        }
      });
    }).is.throwing('For public is missing.');
    done();
  });

  test('throws an error when custom is not an object.', done => {
    assert.that(() => {
      new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        data: {
          foo: 'foobarbaz'
        },
        custom: 'foobarbaz',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    }).is.throwing('Custom must be an object.');
    done();
  });

  test('returns an event.', done => {
    const actual = new Event({
      context: {
        name: 'foo'
      },
      aggregate: {
        name: 'bar',
        id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
      },
      name: 'baz',
      data: {
        foo: 'foobarbaz'
      },
      metadata: {
        correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
        causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
      }
    });

    assert.that(actual).is.ofType('object');
    assert.that(actual.context.name).is.equalTo('foo');
    assert.that(actual.aggregate.name).is.equalTo('bar');
    assert.that(actual.aggregate.id).is.equalTo('85932442-bf87-472d-8b5a-b0eac3aa8be9');
    assert.that(actual.name).is.equalTo('baz');
    assert.that(actual.id).is.ofType('string');
    assert.that(actual.type).is.equalTo('domain');
    assert.that(actual.data).is.equalTo({ foo: 'foobarbaz' });
    assert.that(actual.custom).is.equalTo({});
    assert.that(actual.user).is.null();
    assert.that(actual.metadata.timestamp).is.ofType('number');
    assert.that(actual.metadata.published).is.false();
    assert.that(actual.metadata.correlationId).is.equalTo('5be0cef4-9051-44ca-a18c-a57c48d711c1');
    assert.that(actual.metadata.causationId).is.equalTo('5be0cef4-9051-44ca-a18c-a57c48d711c1');
    done();
  });

  test('returns an event with custom data.', done => {
    const actual = new Event({
      context: {
        name: 'foo'
      },
      aggregate: {
        name: 'bar',
        id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
      },
      name: 'baz',
      data: {
        foo: 'foobarbaz'
      },
      custom: {
        foo: 'custom-foobar'
      },
      metadata: {
        correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
        causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
      }
    });

    assert.that(actual).is.ofType('object');
    assert.that(actual.context.name).is.equalTo('foo');
    assert.that(actual.aggregate.name).is.equalTo('bar');
    assert.that(actual.aggregate.id).is.equalTo('85932442-bf87-472d-8b5a-b0eac3aa8be9');
    assert.that(actual.name).is.equalTo('baz');
    assert.that(actual.id).is.ofType('string');
    assert.that(actual.type).is.equalTo('domain');
    assert.that(actual.data).is.equalTo({ foo: 'foobarbaz' });
    assert.that(actual.custom).is.equalTo({ foo: 'custom-foobar' });
    assert.that(actual.user).is.null();
    assert.that(actual.metadata.timestamp).is.ofType('number');
    assert.that(actual.metadata.published).is.false();
    assert.that(actual.metadata.correlationId).is.equalTo('5be0cef4-9051-44ca-a18c-a57c48d711c1');
    assert.that(actual.metadata.causationId).is.equalTo('5be0cef4-9051-44ca-a18c-a57c48d711c1');
    done();
  });

  test('returns an event with a custom type.', done => {
    const actual = new Event({
      context: {
        name: 'foo'
      },
      aggregate: {
        name: 'bar',
        id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
      },
      name: 'baz',
      type: 'error',
      data: {
        foo: 'foobarbaz'
      },
      metadata: {
        correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
        causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
      }
    });

    assert.that(actual).is.ofType('object');
    assert.that(actual.context.name).is.equalTo('foo');
    assert.that(actual.aggregate.name).is.equalTo('bar');
    assert.that(actual.aggregate.id).is.equalTo('85932442-bf87-472d-8b5a-b0eac3aa8be9');
    assert.that(actual.name).is.equalTo('baz');
    assert.that(actual.id).is.ofType('string');
    assert.that(actual.type).is.equalTo('error');
    assert.that(actual.data).is.equalTo({ foo: 'foobarbaz' });
    assert.that(actual.user).is.null();
    assert.that(actual.metadata.timestamp).is.ofType('number');
    assert.that(actual.metadata.published).is.false();
    assert.that(actual.metadata.correlationId).is.equalTo('5be0cef4-9051-44ca-a18c-a57c48d711c1');
    assert.that(actual.metadata.causationId).is.equalTo('5be0cef4-9051-44ca-a18c-a57c48d711c1');
    done();
  });

  test('returns an event with authorization metadata.', done => {
    const ownerId = uuid();

    const actual = new Event({
      context: {
        name: 'foo'
      },
      aggregate: {
        name: 'bar',
        id: uuid()
      },
      name: 'baz',
      metadata: {
        correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
        causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
        isAuthorized: {
          owner: ownerId,
          forPublic: true,
          forAuthenticated: false
        }
      }
    });

    assert.that(actual.metadata.isAuthorized).is.equalTo({
      owner: ownerId,
      forPublic: true,
      forAuthenticated: false
    });
    done();
  });

  suite('addUser', () => {
    let event;

    setup(() => {
      event = new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });
    });

    test('is a function.', done => {
      assert.that(event.addUser).is.ofType('function');
      done();
    });

    test('throws an error if user is missing.', done => {
      assert.that(() => {
        event.addUser();
      }).is.throwing('User is missing.');
      done();
    });

    test('throws an error if user id is missing.', done => {
      assert.that(() => {
        event.addUser({});
      }).is.throwing('User id is missing.');
      done();
    });

    test('adds the user.', done => {
      event.addUser({ id: 'Jane Doe' });

      assert.that(event.user).is.equalTo({ id: 'Jane Doe' });
      done();
    });
  });

  suite('wrap', () => {
    test('is a function.', done => {
      assert.that(Event.wrap).is.ofType('function');
      done();
    });

    test('returns a real event object.', done => {
      const event = new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });

      const deserializedEvent = JSON.parse(JSON.stringify(event));

      const actual = Event.wrap(deserializedEvent);

      assert.that(actual).is.instanceOf(Event);
      done();
    });

    test('throws an error when the original metadata are malformed.', done => {
      const event = new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });

      const deserializedEvent = JSON.parse(JSON.stringify(event));

      deserializedEvent.metadata.timestamp = 'foo';

      assert.that(() => {
        Event.wrap(deserializedEvent);
      }).is.throwing('Event is malformed.');
      done();
    });

    test('does not change original metadata.', done => {
      const event = new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          isAuthorized: {
            owner: '91d27b69-a599-448b-80bd-87c5e93e4821',
            forAuthenticated: true,
            forPublic: false
          }
        }
      });

      event.metadata.hash = 'cc762e69089ee2393b061ab26a005319bda94744';
      event.metadata.hashPredecessor = 'fe10566e2adeece8faf585a8fbd5db896e4a60f7';

      const deserializedEvent = JSON.parse(JSON.stringify(event));

      const actual = Event.wrap(deserializedEvent);

      assert.that(actual.id).is.equalTo(event.id);
      assert.that(actual.metadata.correlationId).is.equalTo(event.metadata.correlationId);
      assert.that(actual.metadata.causationId).is.equalTo(event.metadata.causationId);
      assert.that(actual.metadata.timestamp).is.equalTo(event.metadata.timestamp);
      assert.that(actual.metadata.hash).is.equalTo(event.metadata.hash);
      assert.that(actual.metadata.hashPredecessor).is.equalTo(event.metadata.hashPredecessor);
      assert.that(actual.metadata.isAuthorized.owner).is.equalTo(event.metadata.isAuthorized.owner);
      assert.that(actual.metadata.isAuthorized.forAuthenticated).is.equalTo(event.metadata.isAuthorized.forAuthenticated);
      assert.that(actual.metadata.isAuthorized.forPublic).is.equalTo(event.metadata.isAuthorized.forPublic);
      done();
    });

    test('keeps custom data.', done => {
      const event = new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        },
        custom: {
          foo: 'custom-foobar'
        }
      });

      const deserializedEvent = JSON.parse(JSON.stringify(event));

      const actual = Event.wrap(deserializedEvent);

      assert.that(actual.custom).is.equalTo(event.custom);
      done();
    });

    test('keeps user data.', done => {
      const event = new Event({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1'
        }
      });

      event.addUser({
        id: 'Jane Doe'
      });

      const deserializedEvent = JSON.parse(JSON.stringify(event));

      const actual = Event.wrap(deserializedEvent);

      assert.that(actual.user).is.equalTo(event.user);
      done();
    });
  });

  suite('isWellformed', () => {
    test('is a function.', done => {
      assert.that(Event.isWellformed).is.ofType('function');
      done();
    });

    test('returns false for non-object types.', done => {
      assert.that(Event.isWellformed()).is.false();
      done();
    });

    test('returns false for an empty object.', done => {
      assert.that(Event.isWellformed({})).is.false();
      done();
    });

    test('returns false when no context is given.', done => {
      assert.that(Event.isWellformed({
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no context name is given.', done => {
      assert.that(Event.isWellformed({
        context: {},
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no aggregate is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no aggregate name is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no aggregate id is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no name is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no id is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no type is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no data is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no custom data is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true
        }
      })).is.false();
      done();
    });

    test('returns false when no metadata is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no timestamp is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no correlation id is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          timestamp: Date.now(),
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no causation id is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          timestamp: Date.now(),
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          published: true
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no published is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now()
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no authorization owner is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true,
          isAuthorized: {
            forAuthenticated: true,
            forPublic: false
          }
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no authorization for authenticated is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true,
          isAuthorized: {
            owner: uuid(),
            forPublic: false
          }
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns false when no authorization for public is given.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true,
          isAuthorized: {
            owner: uuid(),
            forAuthenticated: true
          }
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.false();
      done();
    });

    test('returns true when the event is well-formed.', done => {
      assert.that(Event.isWellformed({
        context: {
          name: 'foo'
        },
        aggregate: {
          name: 'bar',
          id: '85932442-bf87-472d-8b5a-b0eac3aa8be9'
        },
        name: 'baz',
        id: '37ab3da0-3d04-469b-827d-44230cec53e2',
        type: 'foobar',
        data: {
          foo: 'foobarbaz'
        },
        metadata: {
          correlationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          causationId: '5be0cef4-9051-44ca-a18c-a57c48d711c1',
          timestamp: Date.now(),
          published: true,
          isAuthorized: {
            owner: uuid(),
            forAuthenticated: true,
            forPublic: false
          }
        },
        user: {
          id: '3815e5b5-3d79-4875-bac2-7a1c9f88048b'
        },
        custom: {
          foo: 'custom-foobar'
        }
      })).is.true();
      done();
    });
  });
  /* eslint-enable no-new */
});
