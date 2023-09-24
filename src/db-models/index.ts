import {sequelize} from "../utils/dbConnect";
import {getUserModel} from "./user";
import {getAssetModel} from "./asset";


const dbModels = {
  User: getUserModel(sequelize),
  Asset: getAssetModel(sequelize),
}

Object.values(dbModels).forEach((dbModel) => {
  if (dbModel.associate) {
    dbModel.associate(dbModels)
  }
})

export default dbModels


