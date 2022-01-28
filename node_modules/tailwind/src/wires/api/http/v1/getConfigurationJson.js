'use strict';

const getConfigurationJson = function ({ readModel, writeModel }) {
  return function (req, res) {
    (async () => {
      res.send({ writeModel, readModel });
    })();
  };
};

module.exports = getConfigurationJson;
