# crypto2

crypto2 is a convenience wrapper around Node.js' crypto module.

## Installation

```shell
$ npm install crypto2
```

## Quick start

First you need to integrate crypto2 with your application. For that add a reference to the `crypto2` module.

```javascript
const crypto2 = require('crypto2');
```

### Creating passwords

For encrypting and decrypting you will need a password. To create a secure password, run the `createPassword` function and hand over a secret key:

```javascript
const password = await crypto2.createPassword('secret');
```

By default, `createPassword` returns passwords with 32 bytes length. If you have to use passwords of a different length, provide the number of bytes you want the password to have:

```javascript
const password = await crypto2.createPassword('secret', 64);
```

*Please note that running `createPassword` twice with the same key results in two different passwords, so you must store the generated password. It can not be recovered if you lost it, even if you know the original key.*

### Creating and managing keys

For signing and verifying as well as for encrypting and decrypting using asymmetric encryption algorithms you will need a PEM encoded private and public key pair. You can use the `openssl` command-line tool to create both of them:

```shell
$ openssl genrsa -out privateKey.pem 2048
$ openssl rsa -in privateKey.pem -pubout > publicKey.pem
```

Alternatively the key pair may be created programmatically by calling the `createKeyPair` function. This function creates a 2048-bit strong RSA key pair in PEM format:

```javascript
const { privateKey, publicKey } = await crypto2.createKeyPair();
```

To load a private key from a `.pem` file call the `readPrivateKey` function and specify the name of the key file:

```javascript
const privateKey = await crypto2.readPrivateKey('key.pem');
```

To load a public key from a `.pub` file call the `readPublicKey` function and specify the name of the key file:

```javascript
const publicKey = await crypto2.readPublicKey('key.pub');
```

### Symmetrically encrypting and decrypting

If you want crypto2 to select an encryption algorithm for you, call the `encrypt` and `decrypt` functions without any specific algorithm. This defaults to the AES 256 CBC encryption algorithm. Please note that you must provide an initialization vector (*iv*). To create one, use the `createIv` function:

```javascript
const password = await crypto2.createPassword('secret');
// => [...]

const iv = await crypto2.createIv();
// => [...]

const encrypted = await crypto2.encrypt('the native web', password, iv);
// => [...]

const decrypted = await crypto2.decrypt(encrypted, password, iv);
// => the native web
```

To encrypt and decrypt using the AES 256 CBC encryption algorithm call the `encrypt.aes256cbc` and `decrypt.aes256cbc` functions:

```javascript
const password = await crypto2.createPassword('secret');
// => [...]

const iv = await crypto2.createIv();
// => [...]

const encrypted = await crypto2.encrypt.aes256cbc('the native web', password, iv);
// => [...]

const decrypted = await crypto2.decrypt.aes256cbc(encrypted, password, iv);
// => the native web
```

### Asymmetrically encrypting and decrypting

To encrypt and decrypt using the asymmetric RSA encryption algorithm call the `encrypt.rsa` and `decrypt.rsa` functions. Due to technical limitations of the RSA algorithm the text to be encrypted must not be longer than 215 bytes when using keys with 2048 bits:

```javascript
const encrypted = await crypto2.encrypt.rsa('the native web', publicKey);
// => [...]

const decrypted = await crypto2.decrypt.rsa(encrypted, privateKey);
// => the native web
```

### Signing and verifying

If you want crypto2 to select a signing algorithm for you, call the `sign` and `verify` functions without any specific algorithm. This defaults to the SHA256 signing algorithm:

```javascript
const signature = await crypto2.sign('the native web', privateKey);
// => [...]

const isSignatureValid = await crypto2.verify('the native web', publicKey, signature);
// => true
```

To sign and verify using the SHA256 signing algorithm call the `sign.sha256` and `verify.sha256` functions:

```javascript
const signature = await crypto2.sign.sha256('the native web', privateKey);
// => [...]

const isSignatureValid = await crypto2.verify.sha256('the native web', publicKey, signature);
// => true
```

### Hashing

If you want crypto2 to select a hash algorithm for you, call the `hash` function without any specific algorithm. This defaults to the SHA256 hash algorithm:

```javascript
const hash = await crypto2.hash('the native web');
// => 55a1f59420da66b2c4c87b565660054cff7c2aad5ebe5f56e04ae0f2a20f00a9
```

To calculate the MD5 hash value of a string call the `hash.md5` function:

```javascript
const hash = await crypto2.hash.md5('the native web');
// => 4e8ba2e64931c64b63f4dc8d90e1dc7c
```

To calculate the SHA1 hash value of a string call the `hash.sha1` function:

```javascript
const hash = await crypto2.hash.sha1('the native web');
// => cc762e69089ee2393b061ab26a005319bda94744
```

To calculate the SHA256 hash value of a string call the `hash.sha256` function:

```javascript
const hash = await crypto2.hash.sha256('the native web');
// => 55a1f59420da66b2c4c87b565660054cff7c2aad5ebe5f56e04ae0f2a20f00a9
```

### Message authentication

If you want crypto2 to select a HMAC algorithm for you, call the `hmac` function without any specific algorithm. This defaults to the SHA256 hash algorithm:

```javascript
const hmac = await crypto2.hmac('the native web', 'secret');
// => 028e3043f9d848e346c8a93c4c29b091cb871065b6f5d1199f38e5a7360532f4
```

To calculate the SHA1-based HMAC value of a string call the `hmac.sha1` function:

```javascript
const hmac = await crypto2.hmac.sha1('the native web', 'secret');
// => c9a6cdb2d350820e76a14f4f9a6392990ce1982a
```

To calculate the SHA256-based HMAC value of a string call the `hmac.sha256` function:

```javascript
const hmac = await crypto2.hmac.sha256('the native web', 'secret');
// => 028e3043f9d848e346c8a93c4c29b091cb871065b6f5d1199f38e5a7360532f4
```

## Running the build

To build this module use [roboter](https://www.npmjs.com/package/roboter).

```shell
$ npx roboter
```

## License

The MIT License (MIT)
Copyright (c) 2013-2018 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
