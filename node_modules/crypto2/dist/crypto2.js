'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto'),
    fs = require('fs'),
    _require = require('stream'),
    Readable = _require.Readable;


var NodeRSA = require('node-rsa'),
    promisify = require('util.promisify');

var pbkdf2 = promisify(crypto.pbkdf2),
    randomBytes = promisify(crypto.randomBytes);

var readFile = void 0;

if (typeof fs.readFile === 'function') {
  readFile = promisify(fs.readFile);
} else {
  readFile = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              throw new Error('Invalid operation.');

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function readFile() {
      return _ref.apply(this, arguments);
    };
  }();
}

var createPassword = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(password) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 32;
    var salt, iterations, key;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return randomBytes(32);

          case 2:
            salt = _context2.sent;
            iterations = 10000;
            _context2.next = 6;
            return pbkdf2(password, salt, iterations, length, 'sha512');

          case 6:
            _context2.t0 = length;
            key = _context2.sent.toString('hex').substring(0, _context2.t0);
            return _context2.abrupt('return', key);

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function createPassword(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var createKeyPair = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var key, privateKey, publicKey;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            /* eslint-disable id-length */
            key = new NodeRSA({ b: 2048, e: 65537 }, {
              environment: 'node',
              signingAlgorithm: 'sha256'
            });
            /* eslint-enable id-length */

            privateKey = key.exportKey(), publicKey = key.exportKey('public');
            return _context3.abrupt('return', { privateKey: privateKey, publicKey: publicKey });

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function createKeyPair() {
    return _ref3.apply(this, arguments);
  };
}();

var readKey = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(pemFile, keyType) {
    var data, key, exportedKey;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return readFile(pemFile, { encoding: 'utf8' });

          case 2:
            data = _context4.sent;
            key = new NodeRSA(data);
            exportedKey = key.exportKey(keyType);
            return _context4.abrupt('return', exportedKey);

          case 6:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function readKey(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

var readPrivateKey = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(pemFile) {
    var privateKey;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return readKey(pemFile);

          case 2:
            privateKey = _context5.sent;
            return _context5.abrupt('return', privateKey);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function readPrivateKey(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var readPublicKey = function () {
  var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(pemFile) {
    var publicKey;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return readKey(pemFile, 'public');

          case 2:
            publicKey = _context6.sent;
            return _context6.abrupt('return', publicKey);

          case 4:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function readPublicKey(_x6) {
    return _ref6.apply(this, arguments);
  };
}();

var processStream = function processStream(cipher, text, options) {
  return new _promise2.default(function (resolve, reject) {
    var result = '';

    if (cipher instanceof Readable) {
      cipher.setEncoding(options.to);

      cipher.on('readable', function () {
        result += cipher.read() || '';
      });

      cipher.once('end', function () {
        cipher.removeAllListeners();
        resolve(result);
      });
    } else {
      cipher.once('finish', function () {
        cipher.removeAllListeners();
        resolve(result);
      });
    }

    cipher.once('error', function (err) {
      cipher.removeAllListeners();
      reject(err);
    });

    try {
      cipher.write(text, options.from);
      cipher.end();
    } catch (ex) {
      reject(ex);
    }
  });
};

var createIv = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var password, iv;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return randomBytes(32);

          case 2:
            password = _context7.sent;
            _context7.next = 5;
            return createPassword(password, 16);

          case 5:
            iv = _context7.sent;
            return _context7.abrupt('return', iv);

          case 7:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, this);
  }));

  return function createIv() {
    return _ref7.apply(this, arguments);
  };
}();

var aes256cbcEncrypt = function () {
  var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(text, password, iv) {
    var cipher, encrypted;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            cipher = crypto.createCipheriv('aes-256-cbc', password, iv);
            _context8.next = 3;
            return processStream(cipher, text, { from: 'utf8', to: 'hex' });

          case 3:
            encrypted = _context8.sent;
            return _context8.abrupt('return', encrypted);

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function aes256cbcEncrypt(_x7, _x8, _x9) {
    return _ref8.apply(this, arguments);
  };
}();

var aes256cbcDecrypt = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(text, password, iv) {
    var decipher, decrypted;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            decipher = crypto.createDecipheriv('aes-256-cbc', password, iv);
            _context9.next = 3;
            return processStream(decipher, text, { from: 'hex', to: 'utf8' });

          case 3:
            decrypted = _context9.sent;
            return _context9.abrupt('return', decrypted);

          case 5:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, this);
  }));

  return function aes256cbcDecrypt(_x10, _x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();

var rsaEncrypt = function () {
  var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(text, publicKey) {
    var key, encrypted;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            key = new NodeRSA(publicKey);
            encrypted = key.encrypt(text, 'base64', 'utf8');
            return _context10.abrupt('return', encrypted);

          case 3:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, this);
  }));

  return function rsaEncrypt(_x13, _x14) {
    return _ref10.apply(this, arguments);
  };
}();

var rsaDecrypt = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(text, privateKey) {
    var key, decrypted;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            key = new NodeRSA(privateKey);
            decrypted = key.decrypt(text, 'utf8');
            return _context11.abrupt('return', decrypted);

          case 3:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function rsaDecrypt(_x15, _x16) {
    return _ref11.apply(this, arguments);
  };
}();

var sha256Sign = function () {
  var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(text, privateKey) {
    var sign, signature;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            sign = crypto.createSign('RSA-SHA256');
            _context12.next = 3;
            return processStream(sign, text, { from: 'utf8', to: 'utf8' });

          case 3:
            signature = sign.sign(privateKey, 'hex');
            return _context12.abrupt('return', signature);

          case 5:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));

  return function sha256Sign(_x17, _x18) {
    return _ref12.apply(this, arguments);
  };
}();

var sha256Verify = function () {
  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(text, publicKey, signature) {
    var verify, isSignatureValid;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            verify = crypto.createVerify('RSA-SHA256');
            _context13.next = 3;
            return processStream(verify, text, { from: 'utf8', to: 'utf8' });

          case 3:
            isSignatureValid = verify.verify(publicKey, signature, 'hex');
            return _context13.abrupt('return', isSignatureValid);

          case 5:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, this);
  }));

  return function sha256Verify(_x19, _x20, _x21) {
    return _ref13.apply(this, arguments);
  };
}();

var md5 = function () {
  var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14(text) {
    var hash, hashValue;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            hash = crypto.createHash('md5');
            _context14.next = 3;
            return processStream(hash, text, { from: 'utf8', to: 'hex' });

          case 3:
            hashValue = _context14.sent;
            return _context14.abrupt('return', hashValue);

          case 5:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));

  return function md5(_x22) {
    return _ref14.apply(this, arguments);
  };
}();

var sha1 = function () {
  var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(text) {
    var hash, hashValue;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            hash = crypto.createHash('sha1');
            _context15.next = 3;
            return processStream(hash, text, { from: 'utf8', to: 'hex' });

          case 3:
            hashValue = _context15.sent;
            return _context15.abrupt('return', hashValue);

          case 5:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, this);
  }));

  return function sha1(_x23) {
    return _ref15.apply(this, arguments);
  };
}();

var sha256 = function () {
  var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(text) {
    var hash, hashValue;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            hash = crypto.createHash('sha256');
            _context16.next = 3;
            return processStream(hash, text, { from: 'utf8', to: 'hex' });

          case 3:
            hashValue = _context16.sent;
            return _context16.abrupt('return', hashValue);

          case 5:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, this);
  }));

  return function sha256(_x24) {
    return _ref16.apply(this, arguments);
  };
}();

var sha1hmac = function () {
  var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(text, password) {
    var hmac, hashValue;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            hmac = crypto.createHmac('sha1', password);
            _context17.next = 3;
            return processStream(hmac, text, { from: 'utf8', to: 'hex' });

          case 3:
            hashValue = _context17.sent;
            return _context17.abrupt('return', hashValue);

          case 5:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, this);
  }));

  return function sha1hmac(_x25, _x26) {
    return _ref17.apply(this, arguments);
  };
}();

var sha256hmac = function () {
  var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(text, password) {
    var hmac, hashValue;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            hmac = crypto.createHmac('sha256', password);
            _context18.next = 3;
            return processStream(hmac, text, { from: 'utf8', to: 'hex' });

          case 3:
            hashValue = _context18.sent;
            return _context18.abrupt('return', hashValue);

          case 5:
          case 'end':
            return _context18.stop();
        }
      }
    }, _callee18, this);
  }));

  return function sha256hmac(_x27, _x28) {
    return _ref18.apply(this, arguments);
  };
}();

var crypto2 = {
  createPassword: createPassword,
  createKeyPair: createKeyPair,
  readPrivateKey: readPrivateKey,
  readPublicKey: readPublicKey,

  createIv: createIv,
  encrypt: aes256cbcEncrypt,
  decrypt: aes256cbcDecrypt,

  sign: sha256Sign,
  verify: sha256Verify,

  hash: sha256,
  hmac: sha256hmac
};

crypto2.encrypt.aes256cbc = aes256cbcEncrypt;
crypto2.encrypt.rsa = rsaEncrypt;
crypto2.decrypt.aes256cbc = aes256cbcDecrypt;
crypto2.decrypt.rsa = rsaDecrypt;

crypto2.sign.sha256 = sha256Sign;
crypto2.verify.sha256 = sha256Verify;

crypto2.hash.md5 = md5;
crypto2.hash.sha1 = sha1;
crypto2.hash.sha256 = sha256;
crypto2.hmac.sha1 = sha1hmac;
crypto2.hmac.sha256 = sha256hmac;

module.exports = crypto2;