import {Request} from "express";
import {APIError, cruds, TWrapController} from "../../utils/api-helpers";
import dbModels from "../../db-models";
import {Op} from "sequelize";
import {sequelize} from "../../utils/dbConnect";

export const getHotelRooms = (): TWrapController => {
  return async (req: Request) => {
    const {
      offset,
      limit,
      sortBy,
      sort,
      whereQuery,
    } = cruds.parseQuery(req.query)

    const {
      checkInAt,
      checkOutAt,
      ...whereQueryToParse
    } = whereQuery || {}

    const parsedWhereQuery = cruds.parseWhereQuery(dbModels.HotelRoom, whereQueryToParse)

    let employedHotelRoomsStrIds: string[] | null = null

    if (checkInAt && checkOutAt) {
      const checkInAtDate = cruds.tryParseDate(String(checkInAt))
      const checkOutAtDate = cruds.tryParseDate(String(checkOutAt))

      if (!checkOutAtDate || !checkInAtDate) {
        throw new APIError('unparsed_attribute_val', 400)
      }

      const bookings = await dbModels.Booking.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                {checkInAt: {[Op.lt]: checkInAtDate}},
                {checkOutAt: {[Op.lt]: checkOutAtDate}}
              ]
            },
            {
              [Op.and]: [
                {checkInAt: {[Op.gt]: checkInAtDate}},
                {checkOutAt: {[Op.gt]: checkOutAtDate}}
              ]
            }
          ]
        },
        attributes: [
          [sequelize.fn('DISTINCT', sequelize.col('hotelRoomStrId')), 'hotelRoomStrId']
        ]
      })

      employedHotelRoomsStrIds = bookings.map((booking) => booking.getDataValue('hotelRoomStrId'))
    }

    const {rows, count} = await dbModels.HotelRoom.findAndCountAll({
      where: {
        ...parsedWhereQuery,
        ...(employedHotelRoomsStrIds ? {strId: {[Op.notIn]: employedHotelRoomsStrIds}} : {})
      },
      limit: limit || cruds.DefaultLimit,
      offset: offset || 0,
      raw: true,
    })

    return {
      rows: cruds.omitHiddenProps(dbModels.HotelRoom, rows),
      total: count,
      limit: limit || cruds.DefaultLimit,
      offset: offset || 0,
    }
  }
}
