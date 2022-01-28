'use strict';

const getPing = function () {
  return function (req, res) {
    (async () => {
      res.json({
        api: 'v1'
      });
    })();
  };
};

module.exports = getPing;
