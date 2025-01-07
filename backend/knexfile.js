module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'user'
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    }
  };