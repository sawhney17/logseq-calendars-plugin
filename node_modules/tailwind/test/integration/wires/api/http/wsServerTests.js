'use strict';

const { PassThrough } = require('stream');

const assert = require('assertthat'),
      uuid = require('uuidv4'),
      WebSocket = require('ws');

const buildEvent = require('../../../../shared/buildEvent'),
      issueToken = require('../../../../shared/issueToken'),
      startApp = require('./startApp');

suite('wsServer', () => {
  suite('routes', () => {
    let app,
        socket;

    suiteSetup(async () => {
      app = await startApp({ port: 4000, corsOrigin: '*' });
    });

    setup(async () => {
      socket = new WebSocket('ws://localhost:4000/');

      await new Promise(resolve => {
        socket.once('open', () => {
          resolve();
        });
      });
    });

    teardown(() => {
      socket.close();
    });

    suite('v1/sendCommand', () => {
      test('returns 400 if invalid JSON is sent.', async () => {
        await new Promise((resolve, reject) => {
          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Bad request.',
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send('invalid JSON');
        });
      });

      test('returns 400 if version is missing.', async () => {
        await new Promise((resolve, reject) => {
          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Bad request.',
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({}));
        });
      });

      test('returns 400 if type is missing.', async () => {
        await new Promise((resolve, reject) => {
          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Bad request.',
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', procedureId: uuid() }));
        });
      });

      test('returns 400 if procedure id is missing.', async () => {
        await new Promise((resolve, reject) => {
          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Procedure id is missing.',
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand' }));
        });
      });

      test('returns 400 if procedure id is not a uuid.', async () => {
        await new Promise((resolve, reject) => {
          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Procedure id is invalid.',
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId: 'foo' }));
        });
      });

      test('returns 400 if payload is missing.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Malformed command.',
                statusCode: 400,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId }));
        });
      });

      test('returns 400 if a malformed command is sent.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Malformed command.',
                statusCode: 400,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId, payload: { foo: 'bar' }}));
        });
      });

      test('returns 400 if a wellformed command is sent with a non-existent context name.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const command = new app.Command({
            context: { name: 'Foo' },
            aggregate: { name: 'Node', id: uuid() },
            name: 'Ping',
            data: { foo: 'foobar' }
          });

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Unknown context name.',
                statusCode: 400,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId, payload: command }));
        });
      });

      test('returns 400 if a wellformed command is sent with a non-existent aggregate name.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const command = new app.Command({
            context: { name: 'network' },
            aggregate: { name: 'foo', id: uuid() },
            name: 'ping',
            data: { foo: 'foobar' }
          });

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Unknown aggregate name.',
                statusCode: 400,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId, payload: command }));
        });
      });

      test('returns 400 if a wellformed command is sent with a non-existent command name.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const command = new app.Command({
            context: { name: 'network' },
            aggregate: { name: 'node', id: uuid() },
            name: 'foo',
            data: { foo: 'foobar' }
          });

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Unknown command name.',
                statusCode: 400,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId, payload: command }));
        });
      });

      test('returns 200 if a wellformed command is sent and everything is fine.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const command = new app.Command({
            context: { name: 'network' },
            aggregate: { name: 'node', id: uuid() },
            name: 'ping',
            data: { foo: 'foobar' }
          });

          let counter = 0;

          app.api.incoming.once('data', () => {
            counter += 1;
          });

          socket.once('message', message => {
            try {
              counter += 1;

              assert.that(counter).is.equalTo(2);
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'sentCommand',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId, payload: command }));
        });
      });

      test('emits an incoming command to the app.api.incoming stream.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const command = new app.Command({
            context: { name: 'network' },
            aggregate: { name: 'node', id: uuid() },
            name: 'ping',
            data: { foo: 'foobar' }
          });

          app.api.incoming.once('data', actual => {
            try {
              assert.that(actual.context.name).is.equalTo(command.context.name);
              assert.that(actual.aggregate.name).is.equalTo(command.aggregate.name);
              assert.that(actual.aggregate.id).is.equalTo(command.aggregate.id);
              assert.that(actual.name).is.equalTo(command.name);
              assert.that(actual.data).is.equalTo(command.data);
              assert.that(actual.user.id).is.equalTo('anonymous');
              assert.that(actual.user.token.sub).is.equalTo('anonymous');
              assert.that(actual.user.token.iss).is.equalTo('https://token.invalid');
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({ version: 'v1', type: 'sendCommand', procedureId, payload: command }));
        });
      });
    });

    suite('v1/subscribeEvents', () => {
      test('receives an event from the app.api.outgoing stream.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();
          const joinedEvent = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
            participant: 'Jane Doe'
          });

          let receivedMessages = 0;

          const onMessage = message => {
            try {
              receivedMessages += 1;

              switch (receivedMessages) {
                case 1: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'subscribedEvents',
                    statusCode: 200,
                    procedureId
                  });

                  app.api.outgoing.write(joinedEvent);
                  break;
                }
                case 2: {
                  assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'Jane Doe' });
                  socket.removeListener('message', onMessage);
                  resolve();
                  break;
                }
                default: {
                  reject(new Error('Should never be called.'));
                }
              }
            } catch (ex) {
              reject(ex);
            }
          };

          socket.on('message', onMessage);
          socket.send(JSON.stringify({ version: 'v1', type: 'subscribeEvents', procedureId }));
        });
      });

      test('receives multiple events from the app.api.outgoing stream.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();
          const joinedEvent1 = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
            participant: 'Jane Doe'
          });
          const joinedEvent2 = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
            participant: 'John Doe'
          });

          let receivedMessages = 0;

          const onMessage = message => {
            try {
              receivedMessages += 1;

              switch (receivedMessages) {
                case 1: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'subscribedEvents',
                    statusCode: 200,
                    procedureId
                  });
                  app.api.outgoing.write(joinedEvent1);
                  break;
                }
                case 2: {
                  assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'Jane Doe' });
                  app.api.outgoing.write(joinedEvent2);
                  break;
                }
                case 3: {
                  assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                  socket.removeListener('message', onMessage);
                  resolve();
                  break;
                }
                default: {
                  reject(new Error('Should never be called.'));
                }
              }
            } catch (ex) {
              reject(ex);
            }
          };

          socket.on('message', onMessage);
          socket.send(JSON.stringify({ version: 'v1', type: 'subscribeEvents', procedureId }));
        });
      });

      test('receives filtered events from the app.api.outgoing stream.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();
          const startedEvent = buildEvent('planning', 'peerGroup', uuid(), 'started', {
            participant: 'Jane Doe'
          });
          const joinedEvent = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
            participant: 'John Doe'
          });

          let receivedMessages = 0;

          const onMessage = message => {
            try {
              receivedMessages += 1;

              switch (receivedMessages) {
                case 1: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'subscribedEvents',
                    statusCode: 200,
                    procedureId
                  });
                  app.api.outgoing.write(startedEvent);
                  app.api.outgoing.write(joinedEvent);
                  break;
                }
                case 2: {
                  assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                  socket.removeListener('message', onMessage);
                  resolve();
                  break;
                }
                default: {
                  reject(new Error('Should never be called.'));
                }
              }
            } catch (ex) {
              reject(ex);
            }
          };

          socket.on('message', onMessage);
          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeEvents',
            procedureId,
            payload: { filter: { name: 'joined' }}
          }));
        });
      });

      suite('filters events based on authorization options', () => {
        test('sends public events to public users.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();
            const eventForPublic = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'John Doe'
            });

            eventForPublic.metadata.isAuthorized = {
              owner: uuid(),
              forAuthenticated: true,
              forPublic: true
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });
                    app.api.outgoing.write(eventForPublic);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId
            }));
          });
        });

        test('sends public events to authenticated users.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();
            const eventForPublic = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'John Doe'
            });

            eventForPublic.metadata.isAuthorized = {
              owner: uuid(),
              forAuthenticated: true,
              forPublic: true
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });
                    app.api.outgoing.write(eventForPublic);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId,
              token: issueToken('Jane Doe')
            }));
          });
        });

        test('sends public events to owners.', async () => {
          await new Promise((resolve, reject) => {
            const ownerId = uuid(),
                  procedureId = uuid();

            const eventForPublic = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'John Doe'
            });

            eventForPublic.metadata.isAuthorized = {
              owner: ownerId,
              forAuthenticated: true,
              forPublic: true
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });
                    app.api.outgoing.write(eventForPublic);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId,
              token: issueToken(ownerId)
            }));
          });
        });

        test('does not send authenticated events to public users.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();

            const eventForAuthenticated = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'Jane Doe'
            });

            eventForAuthenticated.metadata.isAuthorized = {
              owner: uuid(),
              forAuthenticated: true,
              forPublic: false
            };

            const eventForPublic = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'John Doe'
            });

            eventForPublic.metadata.isAuthorized = {
              owner: uuid(),
              forAuthenticated: true,
              forPublic: true
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });

                    app.api.outgoing.write(eventForAuthenticated);
                    app.api.outgoing.write(eventForPublic);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId
            }));
          });
        });

        test('sends authenticated events to authenticated users.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();

            const eventForAuthenticated = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'Jane Doe'
            });

            eventForAuthenticated.metadata.isAuthorized = {
              owner: uuid(),
              forAuthenticated: true,
              forPublic: false
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });

                    app.api.outgoing.write(eventForAuthenticated);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'Jane Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId,
              token: issueToken('Jane Doe')
            }));
          });
        });

        test('sends authenticated events to owners.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();
            const ownerId = uuid();

            const eventForAuthenticated = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'Jane Doe'
            });

            eventForAuthenticated.metadata.isAuthorized = {
              owner: ownerId,
              forAuthenticated: true,
              forPublic: false
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });

                    app.api.outgoing.write(eventForAuthenticated);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'Jane Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId,
              token: issueToken(ownerId)
            }));
          });
        });

        test('does not send owner events to public users.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();
            const ownerId = uuid();

            const eventForOwner = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'Jane Doe'
            });

            eventForOwner.metadata.isAuthorized = {
              owner: ownerId,
              forAuthenticated: false,
              forPublic: false
            };

            const eventForPublic = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'John Doe'
            });

            eventForPublic.metadata.isAuthorized = {
              owner: uuid(),
              forAuthenticated: true,
              forPublic: true
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });

                    app.api.outgoing.write(eventForOwner);
                    app.api.outgoing.write(eventForPublic);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId
            }));
          });
        });

        test('does not send owner events to authenticated users.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();
            const ownerId = uuid();

            const eventForOwner = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'Jane Doe'
            });

            eventForOwner.metadata.isAuthorized = {
              owner: ownerId,
              forAuthenticated: false,
              forPublic: false
            };

            const eventForPublic = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'John Doe'
            });

            eventForPublic.metadata.isAuthorized = {
              owner: uuid(),
              forAuthenticated: true,
              forPublic: true
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });

                    app.api.outgoing.write(eventForOwner);
                    app.api.outgoing.write(eventForPublic);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'John Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId,
              token: issueToken('Jane Doe')
            }));
          });
        });

        test('sends owner events to owners.', async () => {
          await new Promise((resolve, reject) => {
            const procedureId = uuid();
            const ownerId = uuid();

            const eventForOwner = buildEvent('planning', 'peerGroup', uuid(), 'joined', {
              participant: 'Jane Doe'
            });

            eventForOwner.metadata.isAuthorized = {
              owner: ownerId,
              forAuthenticated: false,
              forPublic: false
            };

            let receivedMessages = 0;

            const onMessage = message => {
              try {
                receivedMessages += 1;

                switch (receivedMessages) {
                  case 1: {
                    assert.that(JSON.parse(message)).is.equalTo({
                      type: 'subscribedEvents',
                      statusCode: 200,
                      procedureId
                    });

                    app.api.outgoing.write(eventForOwner);
                    break;
                  }
                  case 2: {
                    assert.that(JSON.parse(message).payload.data).is.equalTo({ participant: 'Jane Doe' });
                    socket.removeListener('message', onMessage);
                    resolve();
                    break;
                  }
                  default: {
                    reject(new Error('Should never be called.'));
                  }
                }
              } catch (ex) {
                reject(ex);
              }
            };

            socket.on('message', onMessage);
            socket.send(JSON.stringify({
              version: 'v1',
              type: 'subscribeEvents',
              procedureId,
              token: issueToken(ownerId)
            }));
          });
        });
      });
    });

    suite('v1/subscribeRead', () => {
      test('returns 400 when payload is missing.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const onMessage = message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Payload is missing.',
                statusCode: 400,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          };

          socket.once('message', onMessage);
          socket.send(JSON.stringify({ version: 'v1', type: 'subscribeRead', procedureId }));
        });
      });

      test('returns 400 when specifying a non-existent model type.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const onMessage = message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Unknown model type.',
                procedureId,
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          };

          socket.once('message', onMessage);
          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {}
          }));
        });
      });

      test('returns 400 when specifying a non-existent model name.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          const onMessage = message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Unknown model name.',
                procedureId,
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          };

          socket.once('message', onMessage);
          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists'
            }
          }));
        });
      });

      test('passes the given model type and model name to the app.api.read function.', async () => {
        app.api.read = async function (modelType, modelName) {
          assert.that(modelType).is.equalTo('lists');
          assert.that(modelName).is.equalTo('pings');

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });

      test('passes the given where to the app.api.read function.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.where).is.equalTo({
            $and: [
              { lastName: 'Doe' },
              { $or: [
                { 'isAuthorized.owner': 'anonymous' },
                { 'isAuthorized.forPublic': true }
              ]}
            ]
          });

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                where: { lastName: 'Doe' }
              }
            }
          }));
        });
      });

      test('attaches the authenticated user to the where clause.', async () => {
        const ownerId = uuid();

        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.where).is.equalTo({
            $and: [
              { lastName: 'Doe' },
              { $or: [
                { 'isAuthorized.owner': ownerId },
                { 'isAuthorized.forPublic': true },
                { 'isAuthorized.forAuthenticated': true }
              ]}
            ]
          });

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                where: { lastName: 'Doe' }
              }
            },
            token: issueToken(ownerId)
          }));
        });
      });

      test('falls back to an empty where if where is missing.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.where).is.equalTo({
            $and: [
              {},
              { $or: [
                { 'isAuthorized.owner': 'anonymous' },
                { 'isAuthorized.forPublic': true }
              ]}
            ]
          });

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {}
            }
          }));
        });
      });

      test('passes the given order by to the app.api.read function.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.orderBy).is.equalTo({ lastName: 'ascending' });

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                orderBy: { lastName: 'ascending' }
              }
            }
          }));
        });
      });

      test('falls back to an empty order by if order by is missing.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.orderBy).is.equalTo({});

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });

      test('passes the given skip to the app.api.read function.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.skip).is.equalTo(23);

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                skip: 23
              }
            }
          }));
        });
      });

      test('falls back to skip=0 if skip is missing.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.skip).is.equalTo(0);

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });

      test('falls back to skip=0 if skip is invalid.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.skip).is.equalTo(0);

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                skip: 'abc'
              }
            }
          }));
        });
      });

      test('passes the given take to the app.api.read function.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.take).is.equalTo(23);

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                take: 23
              }
            }
          }));
        });
      });

      test('falls back to take=100 if take is missing.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.take).is.equalTo(100);

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });

      test('falls back to take=100 if take is invalid.', async () => {
        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.take).is.equalTo(100);

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                take: 'abc'
              }
            }
          }));
        });
      });

      test('passes the user to the app.api.read function.', async () => {
        const ownerId = uuid();

        app.api.read = async function (modelType, modelName, options) {
          assert.that(options.user).is.atLeast({
            id: ownerId,
            token: {
              iss: 'https://auth.thenativeweb.io',
              sub: ownerId
            }
          });

          const fakeStream = new PassThrough({ objectMode: true });

          fakeStream.end();

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'subscribedRead',
                statusCode: 200,
                procedureId
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                where: { lastName: 'Doe' }
              }
            },
            token: issueToken(ownerId)
          }));
        });
      });

      test('returns 400 when an invalid where is given.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Invalid query.',
                procedureId,
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                where: 'foo'
              }
            }
          }));
        });
      });

      test('returns 400 when an invalid order by is given.', async () => {
        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Invalid query.',
                procedureId,
                statusCode: 400
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings',
              query: {
                orderBy: 'foo'
              }
            }
          }));
        });
      });

      test('returns 500 when read returns an error.', async () => {
        app.api.read = async function () {
          throw new Error();
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          socket.once('message', message => {
            try {
              assert.that(JSON.parse(message)).is.equalTo({
                type: 'error',
                payload: 'Unable to load model.',
                procedureId,
                statusCode: 500
              });
            } catch (ex) {
              return reject(ex);
            }
            resolve();
          });

          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });

      test('streams a single data item from the app.api.read function to the client.', async () => {
        let fakeStream;

        app.api.read = async function () {
          fakeStream = new PassThrough({ objectMode: true });

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          let receivedMessages = 0;

          const onMessage = message => {
            try {
              receivedMessages += 1;

              switch (receivedMessages) {
                case 1: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'subscribedRead',
                    procedureId,
                    statusCode: 200
                  });
                  fakeStream.write({ foo: 'bar' });
                  fakeStream.end();
                  break;
                }
                case 2: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'item',
                    procedureId,
                    payload: { foo: 'bar' },
                    statusCode: 200
                  });
                  break;
                }
                case 3: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'finish',
                    procedureId,
                    statusCode: 200
                  });
                  socket.removeListener('message', onMessage);
                  resolve();
                  break;
                }
                default: {
                  reject(new Error('Should never be called.'));
                }
              }
            } catch (ex) {
              reject(ex);
            }
          };

          socket.on('message', onMessage);
          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });

      test('returns multiple documents as JSON.', async () => {
        let fakeStream;

        app.api.read = async function () {
          fakeStream = new PassThrough({ objectMode: true });

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          let receivedMessages = 0;

          const onMessage = message => {
            try {
              receivedMessages += 1;

              switch (receivedMessages) {
                case 1:
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'subscribedRead',
                    procedureId,
                    statusCode: 200
                  });
                  fakeStream.write({ foo: 'bar' });
                  fakeStream.write({ foo: 'baz' });
                  fakeStream.end();
                  break;
                case 2:
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'item',
                    procedureId,
                    payload: { foo: 'bar' },
                    statusCode: 200
                  });
                  break;
                case 3: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'item',
                    procedureId,
                    payload: { foo: 'baz' },
                    statusCode: 200
                  });
                  break;
                }
                case 4: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'finish',
                    procedureId,
                    statusCode: 200
                  });
                  socket.removeListener('message', onMessage);
                  resolve();
                  break;
                }
                default: {
                  reject(new Error('Should never be called.'));
                }
              }
            } catch (ex) {
              reject(ex);
            }
          };

          socket.on('message', onMessage);
          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });

      test('closes the stream when the client unsubscribes.', async () => {
        let fakeStream;

        app.api.read = async function () {
          fakeStream = new PassThrough({ objectMode: true });
          fakeStream.write({ foo: 'bar' });

          return fakeStream;
        };

        await new Promise((resolve, reject) => {
          const procedureId = uuid();

          let receivedMessages = 0;

          const onMessage = message => {
            try {
              receivedMessages += 1;

              switch (receivedMessages) {
                case 1: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'subscribedRead',
                    procedureId,
                    statusCode: 200
                  });
                  break;
                }
                case 2: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'item',
                    procedureId,
                    statusCode: 200,
                    payload: { foo: 'bar' }
                  });
                  socket.send(JSON.stringify({
                    version: 'v1',
                    type: 'unsubscribeRead',
                    procedureId
                  }));
                  break;
                }
                case 3: {
                  assert.that(JSON.parse(message)).is.equalTo({
                    type: 'unsubscribedRead',
                    procedureId,
                    statusCode: 200
                  });

                  (async () => {
                    // Wait a short time to give the stream the chance to close.
                    await new Promise(resolveTimeout => setTimeout(resolveTimeout, 0.1 * 1000));

                    fakeStream.once('error', err => {
                      try {
                        assert.that(err.message).is.equalTo('write after end');
                      } catch (ex) {
                        return reject(ex);
                      }
                      resolve();
                    }).write({ foo: 'bar' });
                  })();
                  break;
                }
                default: {
                  reject(new Error('Should never be called.'));
                }
              }
            } catch (ex) {
              reject(ex);
            }
          };

          socket.on('message', onMessage);
          socket.send(JSON.stringify({
            version: 'v1',
            type: 'subscribeRead',
            procedureId,
            payload: {
              modelType: 'lists',
              modelName: 'pings'
            }
          }));
        });
      });
    });
  });
});
