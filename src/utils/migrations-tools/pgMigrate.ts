import {applyMigrations} from "../applyMigrations";
import {logger} from "../api-helpers";

applyMigrations()
  .then(() => {
    logger.info('applyMigrations finish successfully')
  }).catch((err) => {
  logger.error('applyMigrations finish with error =(')
})
