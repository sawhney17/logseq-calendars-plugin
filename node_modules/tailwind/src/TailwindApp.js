'use strict';

const fs = require('fs'),
      path = require('path');

const appRoot = require('app-root-path'),
      { Command, Event } = require('commands-events'),
      crypto2 = require('crypto2'),
      Datasette = require('datasette'),
      Draht = require('draht'),
      flaschenpost = require('flaschenpost'),
      processenv = require('processenv'),
      Stethoskop = require('stethoskop'),
      Timer = require('timer2');

const IoPort = require('./IoPort');

class TailwindApp {
  constructor ({ identityProviders = [], profiling = {}} = {}) {
    for (const identityProvider of identityProviders) {
      if (!identityProvider.issuer) {
        throw new Error('Identity provider issuer is missing.');
      }
      if (!identityProvider.certificate) {
        throw new Error('Identity provider certificate is missing.');
      }
    }

    process.on('uncaughtException', ex => {
      this.fail('Application failed unexpectedly.', ex);
    });
    process.on('unhandledRejection', ex => {
      this.fail('Application failed unexpectedly.', ex);
    });

    this.dirname = appRoot.path;
    this.env = processenv;

    /* eslint-disable global-require */
    this.configuration = require(path.join(this.dirname, 'package.json'));
    /* eslint-enable global-require */

    this.name = this.configuration.name;
    this.version = this.configuration.version;
    this.data = new Datasette();

    flaschenpost.use('host', this.name);

    this.logger = flaschenpost.getLogger();

    this.services = {
      bus: new Draht(),
      crypto: crypto2,
      Datasette,
      Emitter: Draht,
      getLogger (source) {
        return flaschenpost.getLogger(source);
      },
      stethoskop: new Stethoskop({
        from: {
          application: this.name
        },
        to: {
          host: profiling.host,
          port: profiling.port
        },
        enabled: Boolean(profiling.host)
      }),
      Timer
    };

    this.identityProviders = [];

    for (const identityProvider of identityProviders) {
      /* eslint-disable no-sync */
      this.identityProviders.push({
        issuer: identityProvider.issuer,
        certificate: fs.readFileSync(identityProvider.certificate, { encoding: 'utf8' })
      });
      /* eslint-enable no-sync */
    }

    this.Command = Command;
    this.Event = Event;

    this.api = new IoPort(this);
    this.api.read = async function () {
      throw new Error('Invalid operation.');
    };

    this.commandbus = new IoPort(this);
    this.eventbus = new IoPort(this);
    this.flowbus = new IoPort(this);
    this.status = new IoPort(this);

    this.api.outgoing.on('data', () => {
      // Register an empty event handler to avoid that outgoing data stacks up
      // if no client is connected. In contrast to the other IO ports it is a
      // valid scenario for the API port that no client is connected. Hence,
      // simply consume potential data and throw it away.
    });

    /* eslint-disable global-require*/
    this.wires = {
      api: {
        http: {
          Server: require('./wires/api/http/Server')
        }
      },
      commandbus: {
        amqp: {
          Receiver: require('./wires/commandbus/amqp/Receiver'),
          Sender: require('./wires/commandbus/amqp/Sender')
        }
      },
      eventbus: {
        amqp: {
          Receiver: require('./wires/eventbus/amqp/Receiver'),
          Sender: require('./wires/eventbus/amqp/Sender')
        }
      },
      flowbus: {
        amqp: {
          Receiver: require('./wires/flowbus/amqp/Receiver'),
          Sender: require('./wires/flowbus/amqp/Sender')
        }
      },
      status: {
        http: {
          Server: require('./wires/status/http/Server')
        }
      }
    };
    /* eslint-enable global-require*/
  }

  fail (message, err) {
    this.logger.fatal(message, { err });

    // Delay exiting the process to give flaschenpost time to write the log
    // message.
    process.nextTick(() => {
      this.exit(1);
    });
  }

  /* eslint-disable class-methods-use-this, no-process-exit */
  exit (code = 0) {
    process.exit(code);
  }
  /* eslint-enable class-methods-use-this, no-process-exit */
}

module.exports = TailwindApp;
