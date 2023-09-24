import postgresConfig from './postgres'
// @ts-ignore
import { name } from '../../package.json'
import { Options } from 'sequelize'


export default {
  postgresConfig: postgresConfig as Options,
  serverPort: process.env.SERVER_PORT || 3300,
  logger: {
    name,
    outputMode: 'short',
  }
}
