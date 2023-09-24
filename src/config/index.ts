import postgresConfig from './postgres'
// @ts-ignore
import { name } from '../../package.json'

export default {
  postgresConfig,
  serverPort: process.env.SERVER_PORT || 3300,
  logger: {
    name,
    outputMode: 'short',
  }
}
