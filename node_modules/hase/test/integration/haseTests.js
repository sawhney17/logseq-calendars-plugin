'use strict';

const { EventEmitter } = require('events'),
      { Readable, Writable } = require('stream');

const assert = require('assertthat'),
      shell = require('shelljs'),
      uuid = require('uuidv4');

const env = require('../shared/env'),
      hase = require('../../src/hase'),
      waitForRabbitMq = require('../shared/waitForRabbitMq');

suite('hase', () => {
  test('is an object.', async () => {
    assert.that(hase).is.ofType('object');
  });

  suite('connect', () => {
    test('is a function.', async () => {
      assert.that(hase.connect).is.ofType('function');
    });

    test('throws an error if the url is missing.', async () => {
      await assert.that(async () => {
        await hase.connect();
      }).is.throwingAsync('Url is missing.');
    });

    test('throws an error if it can not connect using the given url.', async () => {
      await assert.that(async () => {
        await hase.connect({ url: 'amqp://admin:admin@localhost:12345' });
      }).is.throwingAsync('Could not connect to amqp://admin:admin@localhost:12345.');
    });

    test('returns a reference to the message queue.', async () => {
      const mq = await hase.connect({ url: env.RABBITMQ_URL });

      assert.that(mq).is.ofType('object');
    });

    suite('mq', () => {
      let mq;

      setup(async () => {
        mq = await hase.connect({ url: env.RABBITMQ_URL });
      });

      test('is an event emitter.', async () => {
        assert.that(mq instanceof EventEmitter).is.true();
      });

      test('emits a disconnect event when the connection to RabbitMQ gets lost.', async function () {
        this.timeout(20 * 1000);

        await new Promise(async (resolve, reject) => {
          mq.once('disconnect', async () => {
            try {
              const { code } = shell.exec('docker start rabbitmq');

              assert.that(code).is.equalTo(0);
              await waitForRabbitMq();
              resolve();
            } catch (ex) {
              reject(ex);
            }
          });

          shell.exec('docker kill rabbitmq');
        });
      });

      suite('worker', () => {
        let worker;

        setup(async () => {
          worker = mq.worker(uuid());
        });

        test('is a function.', async () => {
          assert.that(mq.worker).is.ofType('function');
        });

        test('throws an error if name is missing.', async () => {
          await assert.that(async () => {
            await mq.worker();
          }).is.throwingAsync('Name is missing.');
        });

        test('returns an object.', async () => {
          assert.that(worker).is.ofType('object');
        });

        suite('createWriteStream', () => {
          test('is a function.', async () => {
            assert.that(worker.createWriteStream).is.ofType('function');
          });

          test('returns a writable stream.', async () => {
            const stream = await worker.createWriteStream();

            assert.that(stream).is.instanceOf(Writable);
          });

          suite('writable stream', () => {
            test('does not throw an error when writing.', async () => {
              const stream = await worker.createWriteStream();

              assert.that(() => {
                stream.write({ foo: 'bar' });
              }).is.not.throwing();
            });
          });
        });

        suite('createReadStream', () => {
          test('is a function.', async () => {
            assert.that(worker.createReadStream).is.ofType('function');
          });

          test('returns a readable stream.', async () => {
            const stream = await worker.createReadStream();

            assert.that(stream).is.instanceOf(Readable);
          });

          suite('readable stream', () => {
            test('returns a single message.', async () => {
              await new Promise(async (resolve, reject) => {
                const writeStream = await worker.createWriteStream();

                writeStream.write({ foo: 'bar' });

                const readStream = await worker.createReadStream();

                readStream.once('data', message => {
                  try {
                    assert.that(message.payload).is.equalTo({ foo: 'bar' });
                    assert.that(message.next).is.ofType('function');
                    assert.that(message.discard).is.ofType('function');
                    assert.that(message.defer).is.ofType('function');
                    message.next();
                    resolve();
                  } catch (ex) {
                    reject(ex);
                  }
                });
              });
            });

            test('returns multiple messages.', async () => {
              await new Promise(async (resolve, reject) => {
                const writeStream = await worker.createWriteStream();

                writeStream.write({ foo: 'bar' });
                writeStream.write({ foo: 'baz' });

                const readStream = await worker.createReadStream();

                let counter = 0;

                readStream.on('data', message => {
                  try {
                    counter += 1;

                    switch (counter) {
                      case 1: {
                        assert.that(message.payload).is.equalTo({ foo: 'bar' });
                        message.next();
                        break;
                      }
                      case 2: {
                        assert.that(message.payload).is.equalTo({ foo: 'baz' });
                        message.next();

                        return resolve();
                      }
                      default: {
                        // Intentionally left blank.
                      }
                    }
                  } catch (ex) {
                    reject(ex);
                  }
                });
              });
            });

            test('returns multiple messages in the correct order.', async () => {
              await new Promise(async (resolve, reject) => {
                const readStream = await worker.createReadStream();

                let barFinished = false;

                readStream.on('data', message => {
                  try {
                    switch (message.payload.foo) {
                      case 'bar': {
                        barFinished = true;
                        message.next();
                        break;
                      }
                      case 'baz': {
                        assert.that(barFinished).is.true();
                        message.next();

                        return resolve();
                      }
                      default: {
                        // Intentionally left blank.
                      }
                    }
                  } catch (ex) {
                    reject(ex);
                  }
                });

                const writeStream = await worker.createWriteStream();

                writeStream.write({ foo: 'bar' });
                writeStream.write({ foo: 'baz' });
              });
            });

            suite('discard', () => {
              test('throws away a received message.', async () => {
                await new Promise(async (resolve, reject) => {
                  const writeStream = await worker.createWriteStream();

                  writeStream.write({ foo: 'bar' });
                  writeStream.write({ foo: 'baz' });

                  const readStream = await worker.createReadStream();

                  let counter = 0;

                  readStream.on('data', message => {
                    try {
                      counter += 1;

                      switch (counter) {
                        case 1: {
                          assert.that(message.payload).is.equalTo({ foo: 'bar' });
                          message.discard();
                          break;
                        }
                        case 2: {
                          assert.that(message.payload).is.equalTo({ foo: 'baz' });
                          message.next();

                          return resolve();
                        }
                        default: {
                          // Intentionally left blank.
                        }
                      }
                    } catch (ex) {
                      reject(ex);
                    }
                  });
                });
              });
            });

            suite('defer', () => {
              test('requeues a received message.', async () => {
                await new Promise(async (resolve, reject) => {
                  const writeStream = await worker.createWriteStream();

                  writeStream.write({ foo: 'bar' });

                  const readStream = await worker.createReadStream();

                  let counter = 0;

                  readStream.on('data', message => {
                    try {
                      counter += 1;

                      switch (counter) {
                        case 1: {
                          assert.that(message.payload).is.equalTo({ foo: 'bar' });
                          message.defer();
                          break;
                        }
                        case 2: {
                          assert.that(message.payload).is.equalTo({ foo: 'bar' });
                          message.next();

                          return resolve();
                        }
                        default: {
                          // Intentionally left blank.
                        }
                      }
                    } catch (ex) {
                      reject(ex);
                    }
                  });
                });
              });
            });
          });
        });
      });

      suite('publisher', () => {
        let publisher;

        setup(async () => {
          publisher = mq.publisher(uuid());
        });

        test('is a function.', async () => {
          assert.that(mq.publisher).is.ofType('function');
        });

        test('throws an error if name is missing.', async () => {
          assert.that(() => {
            mq.publisher();
          }).is.throwing('Name is missing.');
        });

        test('returns an object.', async () => {
          assert.that(publisher).is.ofType('object');
        });

        suite('createWriteStream', () => {
          test('is a function.', async () => {
            assert.that(publisher.createWriteStream).is.ofType('function');
          });

          test('returns a writable stream.', async () => {
            const stream = await publisher.createWriteStream();

            assert.that(stream).is.instanceOf(Writable);
          });

          suite('writable stream', () => {
            test('does not throw an error when writing.', async () => {
              const stream = await publisher.createWriteStream();

              assert.that(() => {
                stream.write({ foo: 'bar' });
              }).is.not.throwing();
            });
          });
        });

        suite('createReadStream', () => {
          test('is a function.', async () => {
            assert.that(publisher.createReadStream).is.ofType('function');
          });

          test('returns a readable stream.', async () => {
            const stream = await publisher.createReadStream();

            assert.that(stream).is.instanceOf(Readable);
          });

          suite('readable stream', () => {
            test('returns a single message.', async () => {
              await new Promise(async (resolve, reject) => {
                const readStream = await publisher.createReadStream();

                readStream.once('data', message => {
                  try {
                    assert.that(message.payload).is.equalTo({ foo: 'bar' });
                    message.next();
                    resolve();
                  } catch (ex) {
                    reject(ex);
                  }
                });

                const writeStream = await publisher.createWriteStream();

                writeStream.write({ foo: 'bar' });
              });
            });

            test('returns multiple messages.', async () => {
              await new Promise(async (resolve, reject) => {
                const readStream = await publisher.createReadStream();

                let counter = 0;

                readStream.on('data', message => {
                  try {
                    counter += 1;

                    switch (counter) {
                      case 1: {
                        assert.that(message.payload).is.equalTo({ foo: 'bar' });
                        message.next();
                        break;
                      }
                      case 2: {
                        assert.that(message.payload).is.equalTo({ foo: 'baz' });
                        message.next();

                        return resolve();
                      }
                      default: {
                        // Intentionally left blank.
                      }
                    }
                  } catch (ex) {
                    reject(ex);
                  }
                });

                const writeStream = await publisher.createWriteStream();

                writeStream.write({ foo: 'bar' });
                writeStream.write({ foo: 'baz' });
              });
            });

            test('returns multiple messages in the correct order.', async () => {
              await new Promise(async (resolve, reject) => {
                const readStream = await publisher.createReadStream();

                let barFinished = false;

                readStream.on('data', message => {
                  try {
                    switch (message.payload.foo) {
                      case 'bar': {
                        barFinished = true;
                        message.next();
                        break;
                      }
                      case 'baz': {
                        assert.that(barFinished).is.true();
                        message.next();

                        return resolve();
                      }
                      default: {
                        // Intentionally left blank.
                      }
                    }
                  } catch (ex) {
                    reject(ex);
                  }
                });

                const writeStream = await publisher.createWriteStream();

                writeStream.write({ foo: 'bar' });
                writeStream.write({ foo: 'baz' });
              });
            });

            suite('discard', () => {
              test('throws away a received message.', async () => {
                await new Promise(async (resolve, reject) => {
                  const readStream = await publisher.createReadStream();

                  let counter = 0;

                  readStream.on('data', message => {
                    try {
                      counter += 1;

                      switch (counter) {
                        case 1: {
                          assert.that(message.payload).is.equalTo({ foo: 'bar' });
                          message.discard();
                          break;
                        }
                        case 2: {
                          assert.that(message.payload).is.equalTo({ foo: 'baz' });
                          message.next();

                          return resolve();
                        }
                        default: {
                          // Intentionally left blank.
                        }
                      }
                    } catch (ex) {
                      reject(ex);
                    }
                  });

                  const writeStream = await publisher.createWriteStream();

                  writeStream.write({ foo: 'bar' });
                  writeStream.write({ foo: 'baz' });
                });
              });
            });

            suite('defer', () => {
              test('requeues a received message.', async () => {
                await new Promise(async (resolve, reject) => {
                  const readStream = await publisher.createReadStream();

                  let counter = 0;

                  readStream.on('data', message => {
                    try {
                      counter += 1;

                      switch (counter) {
                        case 1: {
                          assert.that(message.payload).is.equalTo({ foo: 'bar' });
                          message.defer();
                          break;
                        }
                        case 2: {
                          assert.that(message.payload).is.equalTo({ foo: 'bar' });
                          message.next();

                          return resolve();
                        }
                        default: {
                          // Intentionally left blank.
                        }
                      }
                    } catch (ex) {
                      reject(ex);
                    }
                  });

                  const writeStream = await publisher.createWriteStream();

                  writeStream.write({ foo: 'bar' });
                });
              });
            });
          });
        });
      });
    });
  });
});
