import { Router } from 'express'
import { wrap } from './utils/api-helpers'
import {usersRoutes} from "./controllers/users";
import {assetsRoutes} from "./controllers/assets";
import {hotelRoomRoutes} from "./controllers/hotel-rooms";
import {clientsRouters} from "./controllers/clients";
import {bookingsRoutes} from "./controllers/bookings";


const app = Router()

app.get('/ping', wrap(() => 'pong'))

app.use('/users', usersRoutes)
app.use('/assets', assetsRoutes)
app.use('/hotel-rooms', hotelRoomRoutes)
app.use('/clients', clientsRouters)
app.use('/bookings', bookingsRoutes)

export { app as apiRoutes }
