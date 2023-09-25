import dbModels from "../../db-models";
import {cruds} from "../../utils/api-helpers";

export const getClientByStrId = async (strId: string) => {
  const client = await dbModels.Client.findOne({ where: { strId } })
  return client && cruds.omitHiddenProps(dbModels.Client, client.get({ plain: true }))
}
