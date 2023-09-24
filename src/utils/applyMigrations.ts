import { Umzug, SequelizeStorage } from 'umzug'
import {sequelize} from "./dbConnect";
import {logger} from "./api-helpers";


const migrationRunner = new Umzug({
  logger: undefined,
  migrations: {
    glob: 'db-migrations/*js',
    // @ts-ignore
    params: [sequelize.getQueryInterface()]
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize })
})

export const applyMigrations = async () => {
  try {
    await migrationRunner.up()
    logger.info('Migrations successfully applied')
  } catch (err) {
    logger.error('applyMigrations Error: ', err)
    throw new Error('applyMigrations Error')
  }
}
