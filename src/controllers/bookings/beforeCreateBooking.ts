import {BookingStatuses, IBookingModel} from "../../db-models/bookings";
import dbModels from "../../db-models";
import {Op} from "sequelize";
import {APIError} from "../../utils/api-helpers";

export const beforeCreateBooking = async (data: IBookingModel) => {
  const employedBooking = await dbModels.Booking.findAll({
    where: {
      hotelRoomStrId: data.hotelRoomStrId,
      status: { [Op.ne]: BookingStatuses.cancelled },
      [Op.not]: {
        [Op.or]: [
          {
            [Op.and]: [
              {checkInAt: {[Op.lt]: data.checkInAt}},
              {checkOutAt: {[Op.lt]: data.checkInAt}}
            ]
          },
          {
            [Op.and]: [
              {checkInAt: {[Op.gt]: data.checkOutAt}},
              {checkOutAt: {[Op.gt]: data.checkOutAt}}
            ]
          }
        ]
      }
    },
  })

  if (employedBooking.length > 0) {
    throw new APIError('conflict', 400)
  }

  return data
}
