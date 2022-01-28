'use strict';

const flaschenpost = require('../../src/flaschenpost');

const logger = flaschenpost.getLogger();

const err = new Error('Failed to do something.');

logger.info('Application started.');
logger.error('Something, somewhere went horribly wrong...', { err });
