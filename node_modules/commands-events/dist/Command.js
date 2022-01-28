'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var formats = require('formats'),
    uuid = require('uuidv4');

var Command =
/*#__PURE__*/
function () {
  function Command(_ref) {
    var context = _ref.context,
        aggregate = _ref.aggregate,
        name = _ref.name,
        _ref$data = _ref.data,
        data = _ref$data === void 0 ? {} : _ref$data,
        _ref$custom = _ref.custom,
        custom = _ref$custom === void 0 ? {} : _ref$custom;
    (0, _classCallCheck2.default)(this, Command);

    if (!context) {
      throw new Error('Context is missing.');
    }

    if (!context.name) {
      throw new Error('Context name is missing.');
    }

    if (!aggregate) {
      throw new Error('Aggregate is missing.');
    }

    if (!aggregate.name) {
      throw new Error('Aggregate name is missing.');
    }

    if (!aggregate.id) {
      throw new Error('Aggregate id is missing.');
    }

    if (!name) {
      throw new Error('Command name is missing.');
    }

    if (!formats.isObject(context)) {
      throw new Error('Context must be an object.');
    }

    if (!formats.isAlphanumeric(context.name, {
      minLength: 1
    })) {
      throw new Error('Context name must be an alphanumeric string.');
    }

    if (!formats.isObject(aggregate)) {
      throw new Error('Aggregate must be an object.');
    }

    if (!formats.isAlphanumeric(aggregate.name, {
      minLength: 1
    })) {
      throw new Error('Aggregate name must be an alphanumeric string.');
    }

    if (!formats.isUuid(aggregate.id)) {
      throw new Error('Aggregate id must be a uuid.');
    }

    if (!formats.isAlphanumeric(name, {
      minLength: 1
    })) {
      throw new Error('Command name must be an alphanumeric string.');
    }

    if (!formats.isObject(data)) {
      throw new Error('Data must be an object.');
    }

    if (!formats.isObject(custom)) {
      throw new Error('Custom must be an object.');
    }

    this.context = {
      name: context.name
    };
    this.aggregate = {
      name: aggregate.name,
      id: aggregate.id
    };
    this.name = name;
    this.id = uuid();
    this.data = data;
    this.custom = custom;
    this.user = null;
    this.metadata = {
      timestamp: Date.now(),
      correlationId: this.id,
      causationId: this.id
    };
  }

  (0, _createClass2.default)(Command, [{
    key: "addToken",
    value: function addToken(token) {
      if (!token) {
        throw new Error('Token is missing.');
      }

      if (!token.sub) {
        throw new Error('Sub claim is missing.');
      }

      this.user = {
        id: token.sub,
        token: token
      };
    }
  }]);
  return Command;
}();

Command.wrap = function (_ref2) {
  var context = _ref2.context,
      aggregate = _ref2.aggregate,
      name = _ref2.name,
      id = _ref2.id,
      metadata = _ref2.metadata,
      user = _ref2.user,
      _ref2$data = _ref2.data,
      data = _ref2$data === void 0 ? {} : _ref2$data,
      _ref2$custom = _ref2.custom,
      custom = _ref2$custom === void 0 ? {} : _ref2$custom;
  var command = new Command({
    context: context,
    aggregate: aggregate,
    name: name,
    data: data,
    custom: custom
  });
  command.id = id;
  command.metadata.timestamp = metadata.timestamp;
  command.metadata.correlationId = metadata.correlationId;
  command.metadata.causationId = metadata.causationId;

  if (user && user.token) {
    command.addToken(user.token);
  }

  if (!Command.isWellformed(command)) {
    throw new Error('Command is malformed.');
  }

  return command;
};

Command.isWellformed = function (command) {
  return formats.isObject(command, {
    schema: {
      context: formats.object({
        schema: {
          name: formats.alphanumeric({
            minLength: 1
          })
        }
      }),
      aggregate: formats.object({
        schema: {
          name: formats.alphanumeric({
            minLength: 1
          }),
          id: formats.uuid()
        }
      }),
      name: formats.alphanumeric({
        minLength: 1
      }),
      id: formats.uuid(),
      data: formats.object({
        schema: {},
        isSchemaRelaxed: true
      }),
      custom: formats.object({
        schema: {},
        isSchemaRelaxed: true
      }),
      user: formats.object({
        schema: {
          id: formats.string({
            minLength: 1
          }),
          token: formats.object({
            schema: {
              sub: formats.string({
                minLength: 1
              })
            },
            isSchemaRelaxed: true
          })
        },
        isOptional: true
      }),
      metadata: formats.object({
        schema: {
          timestamp: formats.number(),
          correlationId: formats.uuid(),
          causationId: formats.uuid()
        }
      })
    }
  });
};

module.exports = Command;