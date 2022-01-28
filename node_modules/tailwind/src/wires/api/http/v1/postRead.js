'use strict';

const jsonLines = require('json-lines');

const validateQuery = require('./validateQuery');

const postRead = function (app, { readModel }) {
  return function (req, res) {
    (async () => {
      const { modelName, modelType } = req.params;
      let { orderBy, skip, take, where } = req.query;

      if (!readModel[modelType]) {
        return res.status(400).send('Unknown model type.');
      }

      if (!readModel[modelType][modelName]) {
        return res.status(400).send('Unknown model name.');
      }

      try {
        where = where ? JSON.parse(where) : {};
      } catch (ex) {
        return res.status(400).send('Invalid where.');
      }

      try {
        orderBy = orderBy ? JSON.parse(orderBy) : {};
      } catch (ex) {
        return res.status(400).send('Invalid order by.');
      }

      skip = !isNaN(skip) ? skip - 0 : 0;
      take = !isNaN(take) ? take - 0 : 100;

      try {
        validateQuery({ orderBy, skip, take, where });
      } catch (ex) {
        return res.status(400).send('Invalid query.');
      }

      const authenticationWhere = [
        { 'isAuthorized.owner': req.user.sub },
        { 'isAuthorized.forPublic': true }
      ];

      if (req.user.sub !== 'anonymous') {
        authenticationWhere.push({ 'isAuthorized.forAuthenticated': true });
      }

      where = {
        $and: [ where, { $or: authenticationWhere }]
      };

      let stream;

      try {
        stream = await app.api.read(modelType, modelName, {
          where,
          orderBy,
          take,
          skip,
          user: {
            id: req.user.sub,
            token: req.user
          }
        });
      } catch (ex) {
        return res.status(500).send('Unable to load model.');
      }

      jsonLines(client => {
        const sendToClient = function (data) {
          client.send(data);
        };

        stream.on('data', sendToClient);

        stream.once('end', () => {
          stream.removeListener('data', sendToClient);
          client.disconnect();
        });

        client.once('disconnect', () => {
          stream.end();
        });
      })(req, res);
    })();
  };
};

module.exports = postRead;
