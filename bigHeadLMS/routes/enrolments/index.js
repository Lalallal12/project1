'use strict'
const validate = require('../../model/enrolmentScheme.js')()

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

        const result = await client.query(
          `SELECT pe.id, pe.user_id, pe.class_id, pe.status, pc.name, pe.reg_date, pe.mod_date 
          FROM public.enrolment pe
          JOIN public.code pc 
          ON pe.status = pc.code 
          WHERE pe.user_id = $1 and pc.code_group LIKE '${fastify.code_group.ENROLMENT_STATUS}';
          `, [request.user_id]
        )
    // Note: avoid doing expensive computation here, this will block releasing the client
        reply.code(200).send(result.rows)
      } finally {
    // Release the client immediately after query resolves, or upon error
      client.release()
      }
  }
  )
  
  // 2. 학생이 수강 신청 내역 수정
  fastify.post('/', async function (request, reply) {
    const client = await fastify.pg.connect()
    // const status = request.body.status
    // const user   = request.body.userid
    if(!validate(request.body)) {
      reply
        .code(400)
        .send("유효하지 않은 값입니다.")
      return;
    }

    const classid = request.body.class_id
    
// ///// 1. 신청 대기 /////////////////////////////////////
//     if (status=="WAITING") { 
//         try {
//           reply.code(204).send(console.log("신청 대기중입니다."))
//         } 
//         finally { client.release() }
      
// ///// 2. 신청 완료 /////////////////////////////////////
//     } else if (status=="COMPLETION") { 
//         try {
//           reply.code(204).send(console.log("신청 완료된 강의 입니다."))
//         } finally { client.release() }

// ///// 3. 신청 취소를 대기로 변경////////////////////////
//     } else if (status=="CANCELATION") {  
//         try {
//           const { rows } = await client.query(
//             `UPDATE public.enrollment 
//             SET status='WAITING',mod_date=now()
//             WHERE user_id='${user}'`
//             )
//           reply.code(204).send(rows)
//         } finally { client.release() }

// ///// 4. 신규 신청 /////////////////////////////////////
//     } else {
        try {
          const { rows } = await client.query(
            `insert into public.enrolment
            (id,user_id,class_id,status,reg_date,mod_date)
            values
            (nextval('SEQ_ENROLMENT_ID'),
            ${request.user_id},
            ${classid},
            '${fastify.ENROLMENT_STATUS.대기}',
            now(),
            now()) returning id`
            )
            // console.log(rows)

          const result = await client.query(
            `SELECT pe.id, pe.user_id, pe.class_id, pe.status, pc.name, pe.reg_date, pe.mod_date 
            FROM public.enrolment pe
            JOIN public.code pc 
            ON pe.status = pc.code 
            WHERE pe.id = ${rows[0].id} and pc.code_group LIKE '${fastify.code_group.ENROLMENT_STATUS}';
            `
          )
          reply.code(201).send(result.rows)
        } finally { 
          client.release() 
        }  
      //}
    } 
  ) 

  // 3. 학생이 수강신청 취소
  fastify.patch('/:id', async function (request, reply) {
    const class_id = request.params.id

    const client = await fastify.pg.connect()
    try {
        // 수강신청 취소는 취소 상태가 아닐 때만 가능
        const { rowCount } = await client.query(
            `SELECT *
            FROM public.enrolment
            WHERE id = ${class_id} AND status NOT LIKE '${fastify.ENROLMENT_STATUS.취소}'`
        )

        let result = null;
        if (rowCount == 1) {
          await client.query(
            `UPDATE public.enrolment
            SET status='${fastify.ENROLMENT_STATUS.취소}'
            , mod_date = CURRENT_TIMESTAMP
            WHERE id = ${class_id}`
          )

          result = await client.query(
            `SELECT pe.id, pe.user_id, pe.class_id, pe.status, pc.name, pe.reg_date, pe.mod_date 
            FROM public.enrolment pe
            JOIN public.code pc 
            ON pe.status = pc.code 
            WHERE pe.id = ${class_id} AND pc.code_group LIKE '${fastify.code_group.ENROLMENT_STATUS}';`
          )

          reply
          .code(200)
          .send(result.rows)
        } else {
          reply
          .code(401)
          .send("잘못된 수강 취소 요청입니다.")
        }
    } catch (error) {
      console.log(error)
    } finally {
      client.release()
    }
  })
}
