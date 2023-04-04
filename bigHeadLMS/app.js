'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {}

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })

  fastify.addHook('onRequest', async (request, reply) => {
    const token = request.headers.authorization?.split(' ')[1]

    if(token === 'ABC') {
      request.user_id = 1
    } else if(token === 'DEF') {
      request.user_id = 3
    } else {
      reply
        .code(401)
        .header('Content-type', 'application/json')
        .send("Unauthorized")
    }
  })
}
