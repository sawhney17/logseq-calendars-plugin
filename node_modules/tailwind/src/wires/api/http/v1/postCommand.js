'use strict';

const Command = require('commands-events').Command,
      typer = require('content-type');

const validateCommand = require('./validateCommand');

const postCommand = function (app, { writeModel }) {
  return function (req, res) {
    (async () => {
      let command = req.body,
          contentType;

      try {
        contentType = typer.parse(req);
      } catch (ex) {
        return res.status(415).send('Header content-type must be application/json.');
      }

      if (contentType.type !== 'application/json') {
        return res.status(415).send('Header content-type must be application/json.');
      }

      try {
        validateCommand(command, writeModel);
      } catch (ex) {
        return res.status(400).send(ex.message);
      }

      command = Command.wrap(command);
      command.addToken(req.user);

      app.api.incoming.write(command);
      res.status(200).end();
    })();
  };
};

module.exports = postCommand;
