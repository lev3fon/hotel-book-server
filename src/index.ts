import express from 'express'
import bodyParser from "body-parser";
import config from "./config";
import {logger} from "./utils/api-helpers";
import {applyMigrations} from "./utils/applyMigrations";
import {apiRoutes} from "./apiRoutes";


const app = express()

app.use(bodyParser.json())

app.use('/api', apiRoutes)



applyMigrations()
  .then(() => {
    app.listen(config.serverPort, () => {
      logger.info('server listen port: ', config.serverPort)
    })
  }).catch(() => {
    logger.warn('server no start')
})
