import { Options } from 'sequelize'


const postgresConfig: Options = {
  username: process.env.HB_PG_USER || 'postgres',
  password: process.env.HB_PG_PASSWORD || '12345',
  database: process.env.HB_PG_DB || 'postgres',
  dialect: 'postgres',
  logging: false,
  host: process.env.HB_PG_HOST || '127.0.0.1',
  port: 5432,
}

export default postgresConfig
