import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from "sequelize";
import {ModelDefinedNext} from "./default.type";
import {nanoid} from "nanoid";


export interface IAssetModel extends Model<InferAttributes<IAssetModel>, InferCreationAttributes<IAssetModel>> {
  id: CreationOptional<number>,
  strId: CreationOptional<string>,

  pathName: string,
  type: string,

  createdAt: CreationOptional<Date>,
  updatedAt: CreationOptional<Date>,
  deletedAt: CreationOptional<Date>,
}

export const getAssetModel = (sequelize: Sequelize) => {
  const Asset: ModelDefinedNext<IAssetModel> = sequelize.define(
    'Asset',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      strId: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => nanoid(),
      },

      type: DataTypes.STRING,
      pathName: DataTypes.STRING,

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    }, {
      paranoid: true,
    }
  )

  Asset.hiddenProps = [
    'id',
  ]

  Asset.immutableProps = [
    'id',
    'strId',
  ]

  return Asset
}
