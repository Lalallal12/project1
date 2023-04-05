'use strict'
const isValid = require('../../model/classScheme')

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const userId = request.query.user_id
    const className = request.query.name
    const categoryId = request.query.category_id

    //const result = await readAll()
    const client = await fastify.pg.connect()
    try {
      const { rows } = await client.query(        
        `SELECT c.id
              , c.name
              , c.user_id
              , u.name as user_name
              , c.category_id
              , cc.name as category_name
              , c.reg_date
              , c.mod_date
           FROM public.class c
          INNER 
           JOIN public.user u
             ON c.user_id = u.id
          INNER 
           JOIN public.class_category cc
             ON c.category_id = cc.id
          WHERE 1=1
          ${typeof userId !== 'undefined'     ? 'AND c.user_id =' + userId : ''}
          ${typeof className !== 'undefined'  ? 'AND c.name =' + '\'' + className + '\'' : ''}
          ${typeof categoryId !== 'undefined' ? 'AND c.category_id =' + categoryId : ''}                  
        `
      )

      const result = {class: rows}
      
      reply
        .code(200)
        .header('Content-type', 'application/json')
        .send(result)
    } finally {
      
      client.release()
    }    
  })

  fastify.post('/', async function (request, reply) {
    const body = request.body

    if(!isValid(body)) {
      reply
        .code(400)
        .header('Content-type', 'application/json')
        .send("Bad Request")

      return;
    }

    //const result = await readAll()
    const client = await fastify.pg.connect()    

    try {
      const { rows } = await client.query(
        `SELECT u.type           
           FROM public.user u
          WHERE u.id = $1                    
         `, [request.user_id]
      )

      const userType = rows[0]?.type

      if(userType === 'PROFESSOR') {
        const { rows, rowCount } = await client.query(          
          `INSERT 
             INTO public.class
                ( id
                 ,name
                 ,user_id
                 ,category_id
                 ,reg_date
                 ,mod_date
                ) VALUES (
                  nextval('SEQ_CLASS_ID')
                 ,$1 
                 ,$2
                 ,$3
                 ,now()
                 ,now()
                ) RETURNING *
             `,[body.name, request.user_id, body.category_id]
        )

        if(rowCount > 0) {
          const result = {class: rows[0]}

          reply
           .code(201)
           .header('Content-type', 'application/json')
           .send(result)
        } else {
          reply
           .code(500)
           .header('Content-type', 'application/json')
           .send("오류가 발생했습니다.")
        }
      } else {
        reply
          .code(401)
          .header('Content-type', 'application/json')
          .send("PROPESSOR 계정만 수업을 생성할 수 있습니다.")
      }
    } finally {
      
      client.release()
    }    
  })
  
}
