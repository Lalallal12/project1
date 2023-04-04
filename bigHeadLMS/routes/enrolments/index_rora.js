'use strict'

module.exports = async function (fastify, opts) {
  fastify.patch('/:id', async function (request, reply) {
    const client = await fastify.pg.connect()
    try {
        const found  = await client.query(
            `SELECT * 
            FROM public.enrolment
            WHERE id = ${request.params.id}`
          )
        console.log(found);

        let result = null;
        if (found.rows) {
          await client.query(
            `UPDATE public.enrolment
            SET status='${fastify.ENROLMENT_STATUS.취소}'
            , mod_date = CURRENT_TIMESTAMP
            WHERE id = ${request.params.id}`
          )

          result = await client.query(
            `SELECT pe.id, pe.user_id, pe.class_id, pe.status, pc.name, pe.reg_date, pe.mod_date 
            FROM public.enrolment pe
            JOIN public.code pc 
            ON pe.status = pc.code 
            WHERE pe.id = ${request.params.id} and pc.code_group LIKE '${fastify.code_group.ENROLMENT_STATUS}';`
          )
        } else {
          reply
          .code(404)
          .send("존재하지 않는 수강신청입니다.")
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
