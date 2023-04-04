'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    // return '오로라 완료'
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        'SELECT * FROM public.user'
      )
      // Note: avoid doing expensive computation here, this will block releasing the client
      reply.code(200).send(rows)
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release()
    }
  })
}
