import dbModels from "../../db-models";
import {cruds} from "../../utils/api-helpers";

export const getHotelRoomByStrId = async (strId: string) => {
  const hotelRoom = await dbModels.HotelRoom.findOne({ where: { strId } })
  return hotelRoom && cruds.omitHiddenProps(dbModels.HotelRoom, hotelRoom.get({ plain: true }))
}
