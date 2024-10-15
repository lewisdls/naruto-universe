'use strict';

/**
 * jutsu service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::jutsu.jutsu');
