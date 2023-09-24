import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize} from "sequelize";
import {ModelDefinedNext} from "./default.type";
import {nanoid} from "nanoid";


export enum ClientStatuses {
  VIP = 'VIP',
  ordinary = 'ordinary',
}

export interface IClientModel extends Model<InferAttributes<IClientModel>, InferCreationAttributes<IClientModel>> {
  id: CreationOptional<number>,
  strId: CreationOptional<string>,

  name: string,
  phone: string | null,
  email: string | null,
  status: ClientStatuses,

  createdAt: CreationOptional<Date>,
  updatedAt: CreationOptional<Date>,
  deletedAt: CreationOptional<Date>,
}

export const getClientModel = (sequelize: Sequelize) => {
  const Client: ModelDefinedNext<IClientModel> = sequelize.define(
    'Client',
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
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: ClientStatuses.ordinary,
      },

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    }
  )

  Client.hiddenProps = [
    'id',
  ]

  Client.immutableProps = [
    'id',
    'strId'
  ]

  return Client
}
