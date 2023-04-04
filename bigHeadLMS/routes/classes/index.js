'use strict'
const { readAll } = require('../../controller/classController')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const result = await readAll()

    reply
      .code(200)
      .header('Content-type', 'application/json')
      .send(result)
    // const client = await fastify.pg.connect()
    // try {
    //   const { rows } = await client.query(
    //     //'SELECT id, username, hash, salt FROM users WHERE id=$1', [req.params.id],
    //     'SELECT * FROM public.class'
    //   )      
    //   reply.code(200).send(rows)
    // } finally {
      
    //   client.release()
    // }    
  })

  fastify.get('/test', async (req, reply) => {
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(
        //'SELECT id, username, hash, salt FROM users WHERE id=$1', [req.params.id],
        'SELECT * FROM public.class'
      )      
      reply.code(200).send(rows)
    } finally {
      
      client.release()
    }
  })
  
}
