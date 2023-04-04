'use strict'

module.exports = async function (fastify, opts) {
  fastify.put('/:id', async function (request, reply) {
    const mod_user_info = request.body.user;

    const client = await fastify.pg.connect()
    try {
        const found  = await client.query(
            `SELECT * 
            FROM public.user 
            WHERE id = ${request.params.id}`
          )

        let result = null;
        if (found.rows) {
          result = await client.query(
            `UPDATE public.user
            SET 
            "name"='${mod_user_info.name}'
            , email='${mod_user_info.email}'
            , mod_date = CURRENT_TIMESTAMP
            WHERE id = ${request.params.id}  RETURNING *`
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
