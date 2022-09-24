#!/usr/bin/env node

'use strict';

const {promises: fsp} = require('fs');
const path = require('path');
const zlib = require('zlib');
const {promisify} = require('util');
const https = require('https');
const {spawnSync} = require('child_process');

const spawnOptions = {encoding: 'utf8', env: process.env};
const getPlatform = () => {
  const platform = process.platform;
  if (platform !== 'linux') return platform;
  // detecting musl using algorithm from https://github.com/lovell/detect-libc under Apache License 2.0
  let result = spawnSync('getconf', ['GNU_LIBC_VERSION'], spawnOptions);
  if (!result.status && !result.signal) return platform;
  result = spawnSync('ldd', ['--version'], spawnOptions);
  if (result.signal) return platform;
  if ((!result.status && result.stdout.toString().indexOf('musl') >= 0) || (result.status === 1 && result.stderr.toString().indexOf('musl') >= 0))
    return platform + '-musl';
  return platform;
};
const platform = getPlatform();

const getParam = (name, defaultValue = '') => {
  const index = process.argv.indexOf('--' + name);
  if (index > 0) return process.argv[index + 1] || '';
  return defaultValue;
};

const io = async (url, options = {}, data) =>
  new Promise((resolve, reject) => {
    let buffer = null;
    const req = https
      .request(url, options, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers && res.headers.location) {
          io(res.headers.location, options, data).then(resolve, reject);
          return;
        }
        if (res.statusCode != 200) {
          reject(Error(`Status ${res.statusCode} for ${url}`));
          return;
        }
        res.on('data', data => {
          if (buffer) {
            buffer = Buffer.concat([buffer, data]);
          } else {
            buffer = data;
          }
        });
        res.on('end', () => resolve(buffer));
      })
      .on('error', e => reject(e));
    data && req.write(data);
    req.end();
  });
const get = async (url, options) => io(url, {...options, method: 'GET'});
const post = async (url, options, data) => io(url, {...options, method: 'POST'}, data);

function url(parts) {
  let result = parts[0] || '';
  for (let i = 1; i < parts.length; ++i) {
    result += encodeURIComponent(arguments[i]) + parts[i];
  }
  return result;
}

const artifactPath = getParam('artifact'),
  prefix = getParam('prefix'),
  suffix = getParam('suffix');

const main = async () => {
  const [OWNER, REPO] = process.env.GITHUB_REPOSITORY.split('/'),
    TAG = /^refs\/tags\/(.*)$/.exec(process.env.GITHUB_REF)[1],
    TOKEN = process.env.GITHUB_TOKEN;

  const fileName = `${prefix}${platform}-${process.arch}-${process.versions.modules}${suffix}`;

  console.log('Preparing artifact', fileName, '...');

  const [data, uploadUrl] = await Promise.all([
    fsp.readFile(path.normalize(artifactPath)),
    get(url`https://api.github.com/repos/${OWNER}/${REPO}/releases/tags/${TAG}`, {
      auth: OWNER + ':' + TOKEN,
      headers: {Accept: 'application/vnd.github.v3+json', 'User-Agent': 'uhop/install-artifact-from-github'}
    }).then(response => {
      const data = JSON.parse(response.toString()),
        p = data.upload_url.indexOf('{');
      return p > 0 ? data.upload_url.substr(0, p) : data.upload_url;
    })
  ]);

  console.log('Compressing and uploading ...');

  await Promise.all([
    (async () => {
      if (!zlib.brotliCompress) return null;
      const compressed = await promisify(zlib.brotliCompress)(data, {params: {[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY}}),
        name = fileName + '.br',
        label = `Binary artifact: ${artifactPath} (${platform}, ${process.arch}, ${process.versions.modules}, brotli).`;
      return post(
        uploadUrl + '?' + url`name=${name}&label=${label}`,
        {
          auth: OWNER + ':' + TOKEN,
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/brotli',
            'Content-Length': compressed.length,
            'User-Agent': 'uhop/install-artifact-from-github'
          }
        },
        compressed
      )
        .then(() => console.log('Uploaded BR.'))
        .catch(() => console.log('BR has failed to upload.'));
    })(),
    (async () => {
      if (!zlib.gzip) return null;
      const compressed = await promisify(zlib.gzip)(data, {level: zlib.constants.Z_BEST_COMPRESSION}),
        name = fileName + '.gz',
        label = `Binary artifact: ${artifactPath} (${platform}, ${process.arch}, ${process.versions.modules}, gzip).`;
      return post(
        uploadUrl + '?' + url`name=${name}&label=${label}`,
        {
          auth: OWNER + ':' + TOKEN,
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/gzip',
            'Content-Length': compressed.length,
            'User-Agent': 'uhop/install-artifact-from-github'
          }
        },
        compressed
      )
        .then(() => console.log('Uploaded GZ.'))
        .catch(() => console.log('GZ has failed to upload.'));
    })()
  ]);
  console.log('Done.');
};

main().catch(e => {
  console.log('::error::' + ((e && e.message) || 'save-to-github has failed'));
  process.exit(1);
});
