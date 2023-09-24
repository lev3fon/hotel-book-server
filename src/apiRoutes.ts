import { Router } from 'express'
import { wrap } from './utils/api-helpers'
import {usersRoutes} from "./controllers/users";
import {assetsRoutes} from "./controllers/assets";


const app = Router()

app.get('/ping', wrap(() => 'pong'))

app.use('/users', usersRoutes)
app.use('/assets', assetsRoutes)

export { app as apiRoutes }
