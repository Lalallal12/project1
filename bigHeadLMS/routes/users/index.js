'use strict'

module.exports = async function (fastify, opts) {
  fastify.put('/', async function (request, reply) {
      //fastify.put('/:id', async function (request, reply) {
    const mod_user_info = request.body.user;

    const client = await fastify.pg.connect()
    try {
        const found  = await client.query(
            `SELECT * 
            FROM public.user 
            WHERE id = $1`
            , [request.user_id]
          )

        let result = null;
        if (found.rows) {
          result = await client.query(
            `UPDATE public.user
            SET 
            "name"='${mod_user_info.name}'
            , email='${mod_user_info.email}'
            , mod_date = CURRENT_TIMESTAMP
            WHERE id = $1 RETURNING *`
            , [request.user_id]
          )
        } else {
          reply
          .code(404)
          .send("존재하지 않는 사용자입니다.")
        }
      reply
      .code(200)
      .send(result.rows)
    } catch (error) {
      console.log(error)
    } finally {
      client.release()
    }
  })
}
