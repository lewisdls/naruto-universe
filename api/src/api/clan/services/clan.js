'use strict';

/**
 * clan service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::clan.clan');
