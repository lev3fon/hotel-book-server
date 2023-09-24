import { Router } from "express";
import {cruds, wrap} from "../../utils/api-helpers";
import dbModels from "../../db-models";
import {afterFindBooking} from "./afterFindBooking";
import {beforeCreateBooking} from "./beforeCreateBooking";


const app = Router()

app.get('/', wrap(cruds.listEntity(dbModels.Booking, {
  hooks: {
    afterFind: async (data) => {
      return await Promise.all(data.map(async (booking) => {
        return await afterFindBooking(booking)
      }))
    }
  }
})))

app.get('/strId', wrap(cruds.getEntity(dbModels.Booking, {
  hooks: { afterFind: afterFindBooking }
})))

app.post('/', wrap(cruds.createEntity(dbModels.Booking, {
  hooks: {
    beforeCreate: beforeCreateBooking
  }
})))

app.put('/strId', wrap(cruds.updateEntity(dbModels.Booking, {
  hooks: { afterUpdate: afterFindBooking }
})))

export { app as bookingsRoutes }
