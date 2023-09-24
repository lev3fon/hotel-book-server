import {InferAttributes, InferCreationAttributes, Model, ModelDefined} from "sequelize";

export interface ModelDefinedNext<T extends Model<InferAttributes<T>, InferCreationAttributes<T>>> extends ModelDefined<T, T>{
  associate?: (db: { [key: string]: ModelDefinedNext<any> }) => void,
  hiddenProps?: string[],
  immutableProps?: string[],
}
