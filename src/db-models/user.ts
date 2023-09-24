import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model, Sequelize,
} from "sequelize";
import {ModelDefinedNext} from "./default.type";
import {nanoid} from "nanoid";


export interface IUserModel extends Model<InferAttributes<IUserModel>, InferCreationAttributes<IUserModel>> {

  id: CreationOptional<number>,
  strId: CreationOptional<string>,

  login?: string,
  password: string,

  createdAt: CreationOptional<Date>,
  updatedAt: CreationOptional<Date>,
  deletedAt: CreationOptional<Date>,
}

export const getUserModel = (sequelize: Sequelize) => {
  const User: ModelDefinedNext<IUserModel>= sequelize.define(
    'User',
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

      login: DataTypes.STRING,
      password: DataTypes.STRING, // нужно пароль не забыть превратить в хеш =)

      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    { paranoid: true }
  )

  User.hiddenProps = [
    'id',
  ]

  User.immutableProps = [
    'id',
    'strId',
  ]

  return User
}
