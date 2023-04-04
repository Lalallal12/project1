'use strict'

const fp = require('fastify-plugin')
// 코드 관리를 위한 상수 정의
module.exports = fp(async function (fastify, opts) {
    fastify.register(fp((fastify, opts, done) => {

        fastify.decorate('code_group', {
            "USER_TYPE" : "USER_TYPE",
            "ENROLMENT_STATUS" : "ENROLMENT_STATUS"
        })     

        fastify.decorate('USER_TYPE', {
            "학생" : "STUDENT",
            "강사" : "PROFESSOR"
        })     

        fastify.decorate('ENROLMENT_STATUS', {
            "대기" : "WAITING",
            "완료" : "COMPLETION", 
            "취소" : "CANCELLATION"
        }) 

        done()
      }))
})
