'use strict'


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


  fastify.put('/:id', async function (request, reply) {

    let queryStr ="";

    queryStr = "update class set mod_date =now()"
    
    if(request.body.name != undefined)
      queryStr = queryStr + ", name = '"+ request.body.name +"' ";
    if(request.body.userId != undefined)
      queryStr = queryStr + ", user_id = '"+ request.body.userId +"' ";
    if(request.body.categoryId != undefined)
      queryStr = queryStr + ", category_id = '"+ request.body.categoryId +"' ";
    

    queryStr = queryStr+"where id='"+request.params.id+"'";
/*
    queryStr =    "update class set mod_date =now() " 
    queryStr =    queryStr + (request.body.name != undefined)? ", name = '"+ request.body.name +"' ":""
    queryStr =    queryStr + (request.body.userId != undefined)? ", user_id = '"+ request.body.userId +"' ":""
    queryStr =    queryStr + (request.body.categoryId != undefined)? ", category_id = '"+ request.body.categoryId +"' ":"";
 */
    console.log(queryStr)
    
    const client = await fastify.pg.connect();
    try {
      const result = await client.query(
        queryStr
      )

      const { rows } = await client.query(
        "SELECT * FROM CLASS where id = '"+request.params.id+"'"
      )

      reply.code(200).send(rows)
      
    } finally {
      client.release()
    }

  })
  
}
