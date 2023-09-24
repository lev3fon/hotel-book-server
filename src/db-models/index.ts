import {sequelize} from "../utils/dbConnect";
import {getUserModel} from "./user";
import {getAssetModel} from "./asset";
import {getHotelRoomModel} from "./hotelRoom";
import {getClientModel} from "./client";
import {getBookingModel} from "./bookings";


const dbModels = {
  User: getUserModel(sequelize),
  Asset: getAssetModel(sequelize),
  HotelRoom: getHotelRoomModel(sequelize),
  Client: getClientModel(sequelize),
  Booking: getBookingModel(sequelize),
}

Object.values(dbModels).forEach((dbModel) => {
  if (dbModel.associate) {
    dbModel.associate(dbModels)
  }
})

export default dbModels


