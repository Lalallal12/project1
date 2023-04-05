const Ajv = require('ajv')
const ajv = new Ajv()

module.exports = () => {
  const userSchema = 
  {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer"
      },
      "user_id": {
        "type": "integer"
      },
      "class_id": {
        "type": "integer"
      },
      "status": {
        "type": "string"
      },
      "reg_date": {
        "type": "string"
      },
      "mod_date": {
        "type": "string"
      }
    },
    "required": [
      "class_id",
    ]
  }
  const validate = ajv.compile(userSchema);
  return validate;
}
