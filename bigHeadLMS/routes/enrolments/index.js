'use strict'

module.exports = async function (fastify, opts) {
  // 1. 학생이 수강신청한 내역 조회
  fastify.get('/', async function (request, reply) {        
    const client = await fastify.pg.connect()
      try {
        const { rows } = await client.query(
        `SELECT * 
        FROM public.enrolment
        WHERE user_id = $1
        ORDER BY mod_date DESC
        `, [request.user_id]
        )
    // Note: avoid doing expensive computation here, this will block releasing the client
        reply.code(200).send(rows)
      } finally {
    // Release the client immediately after query resolves, or upon error
      client.release()
      }
  }
  )
  
  // 2. 학생이 수강 신청 내역 수정
  fastify.post('/', async function (request, reply) {
    const client = await fastify.pg.connect()
    const status = request.body.status
    const user   = request.body.userid
    const classid = request.body.classid
    
///// 1. 신청 대기 /////////////////////////////////////
    if (status=="WAITING") { 
        try {
          reply.code(204).send(console.log("신청 대기중입니다."))
        } 
        finally { client.release() }
      
///// 2. 신청 완료 /////////////////////////////////////
    } else if (status=="COMPLETION") { 
        try {
          reply.code(204).send(console.log("신청 완료된 강의 입니다."))
        } finally { client.release() }

///// 3. 신청 취소를 대기로 변경////////////////////////
    } else if (status=="CANCELATION") {  
        try {
          const { rows } = await client.query(
            `UPDATE public.enrollment 
            SET status='WAITING',mod_date=now()
            WHERE user_id='${user}'`
            )
          reply.code(204).send(rows)
        } finally { client.release() }

///// 4. 신규 신청 /////////////////////////////////////
    } else {
        try {
          const { rows } = await client.query(
            `insert into public.enrolment
            (id,user_id,class_id,status,reg_date,mod_date)
            values
            (nextval('SEQ_ENROLMENT_ID'),
            ${user},
            ${classid},
            'WAITING',
            now(),
            now()`
            )
          reply.code(201).send(rows)
        } finally { client.release() }  
      }
    } 
  ) 

  // 3. 학생이 수강신청 취소
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
