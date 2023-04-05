'use strict'

const validate = require('../../model/classScheme')() // return한 validate 

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
          ${typeof userId !== 'undefined'     && userId !== ''     ? 'AND c.user_id =' + userId : ''}
          ${typeof className !== 'undefined'  && className !== ''  ? 'AND c.name =' + '\'' + className + '\'' : ''}
          ${typeof categoryId !== 'undefined' && categoryId !== '' ? 'AND c.category_id =' + categoryId : ''}                  
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


    if(!validate(body)) {
      reply
        .code(400)
        .send("유효하지 않은 값입니다.")
      return;
    }

    // if(!isValid(body)) {
    //   reply
    //     .code(400)
    //     .header('Content-type', 'application/json')
    //     .send("Bad Request")

    //   return;
    // }

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


  fastify.put('/:id', async function (request, reply) {

   /*  let queryStr ="";

   queryStr = "update class set mod_date =now()"
    
    if(request.body.name != undefined)
      queryStr = queryStr + ", name = '"+ request.body.name +"' ";
    if(request.body.user_id != undefined)
      queryStr = queryStr + ", user_id = '"+ request.body.user_id +"' ";
    if(request.body.category_id != undefined)
      queryStr = queryStr + ", category_id = '"+ request.body.category_id +"' ";
    

    queryStr = queryStr+"where id='"+request.params.id+"'"; */
/*
    queryStr =    "update class set mod_date =now() " 
    queryStr =    queryStr + (request.body.name != undefined)? ", name = '"+ request.body.name +"' ":""
    queryStr =    queryStr + (request.body.userId != undefined)? ", user_id = '"+ request.body.userId +"' ":""
    queryStr =    queryStr + (request.body.categoryId != undefined)? ", category_id = '"+ request.body.categoryId +"' ":"";
    console.log(queryStr)
 */

    if(!validate(request.body)) {
      reply
        .code(400)
        .send("유효하지 않은 값입니다.")
      return;
    }

    const name = request.body.name
    const userId = request.body.user_id
    const categoryId = request.body.category_id

    const client = await fastify.pg.connect();

    try {
        const { rows } = await client.query(
          `SELECT u.type           
             FROM public.user u
            WHERE u.id = $1                    
           `, [request.user_id]
        )
  
        const userType = rows[0]?.type
  
        if(userType === 'PROFESSOR') {
      
          const { row, rowCount }  = await client.query(
            //queryStr  
          `UPDATE
              CLASS
           SET
            MOD_DATE = NOW()
            ${typeof name !== 'undefined'     && name !== ''     ? ', name =' + '\'' + name + '\'' : ''}
            ${typeof userId !== 'undefined'  && userId !== ''  ? ', user_Id =' + userId : ''}
            ${typeof categoryId !== 'undefined' && categoryId !== '' ? ', category_Id =' + categoryId : ''}    
            WHERE id = $1                    
           `, [request.params.id]              
        
          )

          const { rows } = await client.query(
            `SELECT *          
               FROM PUBLIC.CLASS C
              WHERE C.ID = $1                    
              `, [request.params.id]  
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
