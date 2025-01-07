const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'Id'; // Specify the correct column name
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['fname', 'lname', 'email', 'password', 'type'],

      properties: {
        Id: { type: 'integer'},
        fname: { type: 'string', minLength: 1, maxLength: 255 },
        lname: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        type: { type: 'string', minLength: 1, maxLength: 255 },
        image: { type: 'string' }, 
      },
    };
  }
}























module.exports = User;