const Ajv = require('ajv')
const ajv = new Ajv()

module.exports = () => {  
  const classSchema = {
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "user_id": {
      "type": "integer"
    },
    "category_id": {
      "type": "integer"
    },
    "reg_date": {
      "type": "string"
    },
    "mod_date": {
      "type": "string"
    }
  },
  "required": []
  }
  const validate = ajv.compile(classSchema);
  return validate;
}
