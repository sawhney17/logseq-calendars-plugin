'use strict';

const getStatus = function () {
  return function (req, res) {
    (async () => {
      res.json({
        api: 'v1'
      });
    })();
  };
};

module.exports = getStatus;
