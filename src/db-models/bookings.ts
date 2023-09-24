import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from "sequelize";
import {ModelDefinedNext} from "./default.type";
import {nanoid} from "nanoid";


export enum BookingStatuses {
  notConfirmed = 'not-confirmed',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  living = 'living',
}

export interface IBookingModel extends Model<InferAttributes<IBookingModel>, InferCreationAttributes<IBookingModel>> {
  id: CreationOptional<number>,
  strId: CreationOptional<string>,

  hotelRoomStrId: string,
  clientStrId: string,
  checkInAt: Date,
  checkOutAt: Date,
  status: BookingStatuses,

  createdAt: CreationOptional<Date>,
  updatedAt: CreationOptional<Date>,
  deletedAt: CreationOptional<Date>,
}

export const getBookingModel = (sequelize: Sequelize) => {
  const Booking: ModelDefinedNext<IBookingModel> = sequelize.define(
    'Booking',
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

      hotelRoomStrId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientStrId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      checkInAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOutAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: BookingStatuses.notConfirmed,
      },

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    }
  )

  Booking.hiddenProps = [
    'id',
  ]

  Booking.immutableProps = [
    'id',
    'strId'
  ]

  return Booking
}
