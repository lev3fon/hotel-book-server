import { Router } from 'express'
import {cruds, wrap} from "../../utils/api-helpers";
import {getHotelRooms} from "./getHotelRooms";
import dbModels from "../../db-models";


const app = Router()

app.get('/', wrap(getHotelRooms()))

app.get('/strId', wrap(cruds.getEntity(dbModels.HotelRoom)))
app.post('/', wrap(cruds.createEntity(dbModels.HotelRoom)))
app.put('/strId', wrap(cruds.updateEntity(dbModels.HotelRoom)))
app.delete('/strId', wrap(cruds.deleteEntity(dbModels.HotelRoom)))


export { app as hotelRoomRoutes }
