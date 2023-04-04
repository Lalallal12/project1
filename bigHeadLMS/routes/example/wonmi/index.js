'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {

    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        'select * from public.user'
      )
      reply.code(200).send(rows)
    } finally {
      client.release()
    }

  })
}
