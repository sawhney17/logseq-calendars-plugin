'use strict';

const assert = require('assertthat');

const crypto2 = require('../../src/crypto2');

suite('crypto2', () => {
  suite('createPassword', () => {
    test('returns a new random password with 32 bytes length.', async () => {
      const password = await crypto2.createPassword('secret');

      assert.that(password.length).is.equalTo(32);
    });
  });

  suite('createKeyPair', () => {
    test('returns a new key pair.', async function () {
      this.timeout(15 * 1000);

      const { privateKey, publicKey } = await crypto2.createKeyPair();

      assert.that(privateKey.indexOf('-----BEGIN RSA PRIVATE KEY-----')).is.equalTo(0);
      assert.that(publicKey.indexOf('-----BEGIN PUBLIC KEY-----')).is.equalTo(0);
    });
  });

  suite('readPrivateKey', () => {
    test('reads a private key from a .pem file.', async () => {
      const key = await crypto2.readPrivateKey('./test/units/privateKey.pem');

      assert.that(key.indexOf('-----BEGIN RSA PRIVATE KEY-----')).is.equalTo(0);
    });
  });

  suite('readPublicKey', () => {
    test('reads a public key from a .pem file.', async () => {
      const key = await crypto2.readPublicKey('./test/units/publicKey.pem');

      assert.that(key.indexOf('-----BEGIN PUBLIC KEY-----')).is.equalTo(0);
    });
  });

  suite('createIv', () => {
    test('returns an initialization vector with 16 bytes length.', async () => {
      const iv = await crypto2.createIv();

      assert.that(iv.length).is.equalTo(16);
    });
  });

  suite('encrypt', () => {
    suite('aes256cbc', () => {
      test('encrypts using the AES 256 CBC encryption standard.', async () => {
        const password = await crypto2.createPassword('secret');
        const iv = await crypto2.createIv();

        const encryptedText = await crypto2.encrypt.aes256cbc('the native web', password, iv);
        const decryptedText = await crypto2.decrypt.aes256cbc(encryptedText, password, iv);

        assert.that(decryptedText).is.equalTo('the native web');
      });
    });

    suite('rsa', () => {
      test('encrypts using the RSA encryption standard.', async () => {
        const publicKey = await crypto2.readPublicKey('./test/units/publicKey.pem');
        const encrypted = await crypto2.encrypt.rsa('the native web', publicKey);

        const privateKey = await crypto2.readPrivateKey('./test/units/privateKey.pem');
        const decrypted = await crypto2.decrypt.rsa(encrypted, privateKey);

        assert.that(decrypted).is.equalTo('the native web');
      });
    });

    test('defaults to AES 256 CBC.', async () => {
      const password = await crypto2.createPassword('secret');
      const iv = await crypto2.createIv();

      const actualEncryptedText = await crypto2.encrypt('the native web', password, iv);
      const expectecEncryptedText = await crypto2.encrypt.aes256cbc('the native web', password, iv);

      assert.that(actualEncryptedText).is.equalTo(expectecEncryptedText);
    });
  });

  suite('decrypt', () => {
    suite('aes256cbc', () => {
      test('decrypts using the AES 256 CBC encryption standard.', async () => {
        const password = await crypto2.createPassword('secret');
        const iv = await crypto2.createIv();

        const encryptedText = await crypto2.encrypt.aes256cbc('the native web', password, iv);
        const decryptedText = await crypto2.decrypt.aes256cbc(encryptedText, password, iv);

        assert.that(decryptedText).is.equalTo('the native web');
      });

      test('throws an error when an invalid string is given.', async () => {
        const password = await crypto2.createPassword('secret');
        const iv = await crypto2.createIv();

        await assert.that(async () => {
          await crypto2.decrypt.aes256cbc('this-is-not-encrypted', password, iv);
        }).is.throwingAsync('Bad input string');
      });
    });

    suite('rsa', () => {
      test('decrypts using the RSA encryption standard.', async () => {
        const publicKey = await crypto2.readPublicKey('./test/units/publicKey.pem');
        const encrypted = await crypto2.encrypt.rsa('the native web', publicKey);

        const privateKey = await crypto2.readPrivateKey('./test/units/privateKey.pem');
        const decrypted = await crypto2.decrypt.rsa(encrypted, privateKey);

        assert.that(decrypted).is.equalTo('the native web');
      });

      test('throws an error when an invalid string is given.', async () => {
        const privateKey = await crypto2.readPrivateKey('./test/units/privateKey.pem');

        await assert.that(async () => {
          await crypto2.decrypt.rsa('this-is-not-encrypted', privateKey);
        }).is.throwingAsync('Error during decryption (probably incorrect key). Original error: Error: Incorrect data or key');
      });
    });

    test('defaults to AES 256 CBC.', async () => {
      const password = await crypto2.createPassword('secret');
      const iv = await crypto2.createIv();

      const encryptedText = await crypto2.encrypt.aes256cbc('the native web', password, iv);
      const actualDecryptedText = await crypto2.decrypt(encryptedText, password, iv);
      const expectedDecryptedText = await crypto2.decrypt.aes256cbc(encryptedText, password, iv);

      assert.that(actualDecryptedText).is.equalTo(expectedDecryptedText);
    });
  });

  suite('sign', () => {
    suite('sha256', () => {
      test('signs using the SHA256 signing standard.', async () => {
        const privateKey = await crypto2.readPrivateKey('./test/units/privateKey.pem');
        const signature = await crypto2.sign.sha256('the native web', privateKey);

        assert.that(signature).is.equalTo('af132a489e35ae89c7262fd19dfc78409f14066e0ee603922645b2292bb4661492f65a9bd5cb4de44ce8974c4edc1ef9826309ea6216209de95ef4f61453627d1bbc3ac0ef3cbe6d9aea9aa511b5d98a123a5a6f781e499026383e38b2b89a80785cf35db44409818cf6750dc4c33e8bad28cf6fb6d5cb8a6c863bbc8bba76c09b196965a55b52702378b3217efe42f83e77e4e54e41b8c1ca095fd914ee2da64bfd8d63321b7e41ed5d0f54ade1690b16759cbf32ffc871b67c3c904dfb9bc8072cc43fbb64cfdc9d94bd78401fa5a7dab0604f1eb27aa5467f8f61ea0f8ea9b6cac065d4bdfd0bfc1f3385e6a5482ff8a0b989b19be7ab9d310e459db3ef6d');
      });
    });

    test('defaults to SHA256.', async () => {
      const privateKey = await crypto2.readPrivateKey('./test/units/privateKey.pem');

      const actualSignature = await crypto2.sign('the native web', privateKey);
      const expectedSignature = await crypto2.sign.sha256('the native web', privateKey);

      assert.that(actualSignature).is.equalTo(expectedSignature);
    });
  });

  suite('verify', () => {
    suite('sha256', () => {
      test('verifies using the SHA256 signing standard.', async () => {
        const publicKey = await crypto2.readPublicKey('./test/units/publicKey.pem');
        const isSignatureValid = await crypto2.verify.sha256('the native web', publicKey, 'af132a489e35ae89c7262fd19dfc78409f14066e0ee603922645b2292bb4661492f65a9bd5cb4de44ce8974c4edc1ef9826309ea6216209de95ef4f61453627d1bbc3ac0ef3cbe6d9aea9aa511b5d98a123a5a6f781e499026383e38b2b89a80785cf35db44409818cf6750dc4c33e8bad28cf6fb6d5cb8a6c863bbc8bba76c09b196965a55b52702378b3217efe42f83e77e4e54e41b8c1ca095fd914ee2da64bfd8d63321b7e41ed5d0f54ade1690b16759cbf32ffc871b67c3c904dfb9bc8072cc43fbb64cfdc9d94bd78401fa5a7dab0604f1eb27aa5467f8f61ea0f8ea9b6cac065d4bdfd0bfc1f3385e6a5482ff8a0b989b19be7ab9d310e459db3ef6d');

        assert.that(isSignatureValid).is.true();
      });
    });

    test('defaults to SHA256.', async () => {
      const publicKey = await crypto2.readPublicKey('./test/units/publicKey.pem');

      const actualIsSignatureValid = await crypto2.verify('the native web', publicKey, '6c20e04d7dca6eeff43a7a618776d91d121204c698426b6d5f809d631be8d09ca02643af36f324008afc0d4e1cf0ba137c976afaa74bd559c1e1201694312ad98ae17a66de04812b1efe68c5b1c057f719ff111a938980e11292933074101fd5141d494c13484f45b1f710a2c041ae4ada27667ac3855492b49d77a0a64e6c406925e68b7ed55298ef4387e2884f3a021c6f76b4146607f32d657d070e78e86d43d068b17cca9873a666f572b0d078525446b7dd1ef30ae20b91161a5a9bab7123b56c35fac7d3ce9b749c524c62b5b3eb8e76445c9dfd80370daed8d53a4efdab0acb14a4875758b708b2da75a070db84ebd4bd4f3a073424df214aaf0b9914');
      const expectedIsSignatureValid = await crypto2.verify.sha256('the native web', publicKey, '6c20e04d7dca6eeff43a7a618776d91d121204c698426b6d5f809d631be8d09ca02643af36f324008afc0d4e1cf0ba137c976afaa74bd559c1e1201694312ad98ae17a66de04812b1efe68c5b1c057f719ff111a938980e11292933074101fd5141d494c13484f45b1f710a2c041ae4ada27667ac3855492b49d77a0a64e6c406925e68b7ed55298ef4387e2884f3a021c6f76b4146607f32d657d070e78e86d43d068b17cca9873a666f572b0d078525446b7dd1ef30ae20b91161a5a9bab7123b56c35fac7d3ce9b749c524c62b5b3eb8e76445c9dfd80370daed8d53a4efdab0acb14a4875758b708b2da75a070db84ebd4bd4f3a073424df214aaf0b9914');

      assert.that(actualIsSignatureValid).is.equalTo(expectedIsSignatureValid);
    });
  });

  suite('hash', () => {
    suite('md5', () => {
      test('calculates the MD5 hash value.', async () => {
        const hashedText = await crypto2.hash.md5('the native web');

        assert.that(hashedText).is.equalTo('4e8ba2e64931c64b63f4dc8d90e1dc7c');
      });
    });

    suite('sha1', () => {
      test('calculates the SHA1 hash value.', async () => {
        const hashedText = await crypto2.hash.sha1('the native web');

        assert.that(hashedText).is.equalTo('cc762e69089ee2393b061ab26a005319bda94744');
      });
    });

    suite('sha256', () => {
      test('calculates the SHA256 hash value.', async () => {
        const hashedText = await crypto2.hash.sha256('the native web');

        assert.that(hashedText).is.equalTo('55a1f59420da66b2c4c87b565660054cff7c2aad5ebe5f56e04ae0f2a20f00a9');
      });
    });

    test('defaults to SHA256.', async () => {
      const actualHashedText = await crypto2.hash('the native web');
      const expectedHashedText = await crypto2.hash.sha256('the native web');

      assert.that(actualHashedText).is.equalTo(expectedHashedText);
    });
  });

  suite('hmac', () => {
    suite('sha1', () => {
      test('calculates the SHA1-based HMAC value.', async () => {
        const hmacedText = await crypto2.hmac.sha1('the native web', 'secret');

        assert.that(hmacedText).is.equalTo('c9a6cdb2d350820e76a14f4f9a6392990ce1982a');
      });
    });

    suite('sha256', () => {
      test('calculates the SHA256-based HMAC value.', async () => {
        const hmacedText = await crypto2.hmac.sha256('the native web', 'secret');

        assert.that(hmacedText).is.equalTo('028e3043f9d848e346c8a93c4c29b091cb871065b6f5d1199f38e5a7360532f4');
      });
    });

    test('defaults to SHA256.', async () => {
      const actualHmacedText = await crypto2.hmac('the native web', 'secret');
      const expectedHmacedText = await crypto2.hmac.sha256('the native web', 'secret');

      assert.that(actualHmacedText).is.equalTo(expectedHmacedText);
    });
  });
});
