'use strict'

const fp = require('fastify-plugin')
const { DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_SSL } = process.env

module.exports = fp(async function (fastify, opts) {
    fastify.register(require('@fastify/postgres'), {
        connectionString: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}/${DB_DATABASE}`
      })
})
