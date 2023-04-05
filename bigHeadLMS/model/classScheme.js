const Ajv = require('ajv')
const ajv = new Ajv()

module.exports = () => {  
  const classSchema = {
    $id: "classSchema",
    type: 'object',
    properties: {      
      name: { type: 'string' },
      category_id: { type: 'number' }      
    },
    required: ['category_id']
  }

  const validate = ajv.compile(classSchema)
  return validate;
}
