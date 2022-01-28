'use strict';

const assert = require('assertthat'),
      shell = require('shelljs'),
      uuid = require('uuidv4');

const tailwind = require('../../../../src/tailwind'),
      waitForRabbitMq = require('../../../shared/waitForRabbitMq');

suite('flowbus', () => {
  suite('amqp', function () {
    this.timeout(20 * 1000);

    let appReceiver,
        appSender;

    setup(async () => {
      appSender = tailwind.createApp();
      appReceiver = tailwind.createApp();

      await appReceiver.flowbus.use(new appReceiver.wires.flowbus.amqp.Receiver({
        url: 'amqp://wolkenkit:wolkenkit@localhost:5672',
        application: 'Plcr'
      }));

      await appSender.flowbus.use(new appSender.wires.flowbus.amqp.Sender({
        url: 'amqp://wolkenkit:wolkenkit@localhost:5672',
        application: 'Plcr'
      }));
    });

    test('sends and receives events.', done => {
      const event = new appSender.Event({
        context: { name: 'Planning' },
        aggregate: { name: 'PeerGroup', id: uuid() },
        name: 'Joined',
        data: { foo: 'foobar' },
        metadata: {
          correlationId: uuid(),
          causationId: uuid()
        }
      });

      appReceiver.flowbus.incoming.once('data', actual => {
        actual.next();
        assert.that(actual.context.name).is.equalTo(event.context.name);
        assert.that(actual.aggregate.name).is.equalTo(event.aggregate.name);
        assert.that(actual.aggregate.id).is.equalTo(event.aggregate.id);
        assert.that(actual.name).is.equalTo(event.name);
        assert.that(actual.id).is.equalTo(event.id);
        assert.that(actual.data).is.equalTo(event.data);
        assert.that(actual.metadata.correlationId).is.equalTo(event.metadata.correlationId);
        assert.that(actual.metadata.causationId).is.equalTo(event.metadata.causationId);
        done();
      });

      appSender.flowbus.outgoing.write(event);
    });

    suite('incoming', () => {
      test('emits a disconnect event when the wire has been disconnected.', done => {
        appReceiver.flowbus.incoming.once('disconnect', () => {
          shell.exec('docker start rabbitmq');

          (async () => {
            await waitForRabbitMq();
            done();
          })();
        });

        shell.exec('docker kill rabbitmq');
      });
    });

    suite('outgoing', () => {
      test('emits a disconnect event when the wire has been disconnected.', done => {
        appSender.flowbus.outgoing.once('disconnect', () => {
          shell.exec('docker start rabbitmq');

          (async () => {
            await waitForRabbitMq();
            done();
          })();
        });

        shell.exec('docker kill rabbitmq');
      });
    });
  });
});
