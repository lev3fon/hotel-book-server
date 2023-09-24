import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from "sequelize";
import {ModelDefinedNext} from "./default.type";
import {nanoid} from "nanoid";

export interface IHotelRoomModel extends Model<InferAttributes<IHotelRoomModel>, InferCreationAttributes<IHotelRoomModel>> {
  id: CreationOptional<number>,
  strId: CreationOptional<string>,

  name: string | null,
  description: string | null,

  createdAt: CreationOptional<Date>,
  updatedAt: CreationOptional<Date>,
  deletedAt: CreationOptional<Date>,
}

export const getHotelRoomModel = (sequelize: Sequelize) => {
  const HotelRoom: ModelDefinedNext<IHotelRoomModel> = sequelize.define(
    'HotelRoom',
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

      name: DataTypes.STRING,
      description: DataTypes.STRING,

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    }
  )

  HotelRoom.hiddenProps = [
    'id',
  ]

  HotelRoom.immutableProps = [
    'id',
    'strId'
  ]

  return HotelRoom
}
