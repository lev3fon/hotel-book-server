import {IBookingModel} from "../../db-models/bookings";
import {getHotelRoomByStrId} from "../../models/hotelRoom";
import {getClientByStrId} from "../../models/client";

export const afterFindBooking = async (booking: IBookingModel) => {
  const hotelRoom = await getHotelRoomByStrId(booking.hotelRoomStrId)
  const client = await getClientByStrId(booking.clientStrId)
  return {
    ...booking,
    hotelRoom,
    client,
  }
}
