'use strict';

const assert = require('assertthat');

const Paragraph = require('../../../src/letter/Paragraph');

suite('Paragraph', () => {
  test('is a function.', done => {
    assert.that(Paragraph).is.ofType('function');
    done();
  });

  test('throws an error if id is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph();
      /* eslint-enable no-new */
    }).is.throwing('Id is missing.');
    done();
  });

  test('throws an error if data is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0);
      /* eslint-enable no-new */
    }).is.throwing('Data is missing.');
    done();
  });

  test('throws an error if host is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0, {});
      /* eslint-enable no-new */
    }).is.throwing('Host is missing.');
    done();
  });

  test('throws an error if level is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0, { host: 'example.com' });
      /* eslint-enable no-new */
    }).is.throwing('Level is missing.');
    done();
  });

  test('throws an error if message is missing.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0, { host: 'example.com', level: 'error' });
      /* eslint-enable no-new */
    }).is.throwing('Message is missing.');
    done();
  });

  test('throws an error if metadata is given and metadata is not an object.', done => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Paragraph(0, { host: 'example.com', level: 'error', message: 'foo', metadata: 'bar' });
      /* eslint-enable no-new */
    }).is.throwing('Invalid metadata.');
    done();
  });

  test('returns a paragraph.', done => {
    const id = 23;
    const data = {
      host: 'example.com',
      level: 'error',
      message: 'foo'
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.host).is.equalTo('example.com');
    assert.that(paragraph.pid).is.equalTo(process.pid);
    assert.that(paragraph.id).is.equalTo(id);
    assert.that(paragraph.timestamp).is.ofType('number');
    assert.that(paragraph.level).is.equalTo(data.level);
    assert.that(paragraph.message).is.equalTo(data.message);
    done();
  });

  test('returns a paragraph with a process if a process is given.', done => {
    const id = 23;
    const data = {
      host: 'example.com',
      level: 'error',
      message: 'foo',
      process: 'bar'
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.application).is.equalTo(data.application);
    done();
  });

  test('returns a paragraph with a module if a module is given.', done => {
    const id = 23;
    const data = {
      host: 'example.com',
      level: 'error',
      message: 'foo',
      module: 'bar'
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.module).is.equalTo(data.module);
    done();
  });

  test('returns a paragraph with a source if a source is given.', done => {
    const id = 23;
    const data = {
      host: 'example.com',
      level: 'error',
      message: 'foo',
      source: 'bar'
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.source).is.equalTo(data.source);
    done();
  });

  test('returns a paragraph with metadata if metadata are given.', done => {
    const id = 23;
    const data = {
      host: 'example.com',
      level: 'error',
      message: 'foo',
      metadata: {
        foo: 'bar'
      }
    };

    const paragraph = new Paragraph(id, data);

    assert.that(paragraph.metadata).is.equalTo(data.metadata);
    done();
  });
});
