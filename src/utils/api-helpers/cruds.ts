import {Model, WhereOptions, Op, ModelAttributeColumnOptions, DataTypes} from "sequelize";
import {Request, Router} from "express";
import {APIError, TWrapController, wrap} from "./wrap";
import {ModelDefinedNext} from "../../db-models/default.type";
import _ from "lodash";
import {logger} from "./logger";
import dayjs from "dayjs";


const DefaultLimit = 100
const DefaultSearchField = 'strId'

const omitHiddenProps = <T extends Model>(model: ModelDefinedNext<T>, oneOrMany: object | object[]) => {
  if (!model.hiddenProps || !model.hiddenProps.length) {
    return oneOrMany;
  }

  return Array.isArray(oneOrMany)
    // @ts-ignore
    ? oneOrMany.map(i => _.omit(i, model.hiddenProps))
    : _.omit(oneOrMany, model.hiddenProps);
}


const omitImmutableProps = <T extends Model>(model: ModelDefinedNext<T>, plain: object) => {
  if (!model.immutableProps || !model.immutableProps.length) {
    return plain
  }

  return _.omit(plain, model.immutableProps)
}
const parseQuery = (query: unknown) => {
  let queryToParse: { [key: string]: string | number | (string | number)[] | undefined } = {}
  try {
    queryToParse = query as { [key: string]: string | number | (string | number)[] | undefined }
  } catch (err) {
    logger.warn('parseQuery.castQueryType', err)
    return {}
  }

  const {
    sort,
    sortBy,
    limit,
    offset,
    ...whereQuery
  } = queryToParse

  return {
    sort: sort && _.isString(sort) ? sort : null,
    sortBy: sortBy && _.isString(sortBy) ? sortBy : null,
    limit: !_.isNaN(Number(limit)) ? Number(limit) : null,
    offset: !_.isNaN(Number(offset)) ? Number(offset) : null,
    whereQuery: _.isEmpty(whereQuery) ? null : whereQuery,
  }
}

const tryParseDate = (dateStr: string) => {
  const res = dayjs(dateStr, 'DD-MM-YYYY-HH-MM')
  if (res.isValid()) {
    return res.toDate()
  }
  return false
}

// TODO: Допить функцию для основных типов в бд + учесть что, может придти массив или значения через зпт, их по идее тоже нужно спрасить в массив
const tryParseWhereAttribute = <T extends Model>(
  whereAttributeVal: string | number | (string | number)[],
  modelAttribute: { readonly [Key in keyof T]: ModelAttributeColumnOptions<Model<any, any>> }[Extract<keyof T, string>]
) => {
  if (whereAttributeVal === 'null' && (modelAttribute.allowNull || modelAttribute.allowNull === undefined)) {
    return null
  }

  switch (modelAttribute.type) {
    case (DataTypes.STRING): {
      return String(whereAttributeVal)
    }
    case (DataTypes.TEXT): {
      return String(whereAttributeVal)
    }
    case (DataTypes.INTEGER): {
      if (!_.isNaN(Number(whereAttributeVal))) {
        return Number(whereAttributeVal)
      }
    }
    case (DataTypes.DATE): {
      if (_.isString(whereAttributeVal)) {
        const res = tryParseDate(String(whereAttributeVal))
        if (res) {
          return res
        }
      }
    }
    default:
      return false // TODO: пока забил, но нужно как-то решить вопрос с булевым значением, так не пойдёт =)
  }
}

const opKeys = ['lt', 'gt', 'lte', 'gte', 'like', 'iLike']

const parseWhereQuery = <T extends Model>(
  model: ModelDefinedNext<T>,
  whereQuery: { [key: string]: string | number | (string | number)[] | undefined } | null) => {

  if (!whereQuery) {
    return whereQuery
  }

  const parsedWhereQuery: WhereOptions<T> = {}
  const modelAttributes = model.getAttributes()


  for (const attributeNameWithOp in whereQuery) {
    const [attributeName, opName] = attributeNameWithOp.split('.') as [Extract<keyof T, string>, string?]
    const attributeVal = whereQuery[attributeNameWithOp]

    if (!modelAttributes[attributeName]) {
      throw new APIError('unknown_attribute', 400)
    } else if (opName && !opKeys.includes(opName)) {
      throw new APIError('unknown_op_name', 400)
    } else if (!attributeVal) {
      throw new APIError('empty_attribute_val', 400)
    }

    const parsedAttributeVal = tryParseWhereAttribute(attributeVal, modelAttributes[attributeName])

    if (parsedAttributeVal === false) {
      throw new APIError('unparsed_attribute_val', 400)
    }

    if (opName) {
      // @ts-ignore
      parsedWhereQuery[attributeName] = { [Op[opName]]: parsedAttributeVal }
    } else {
      // @ts-ignore
      parsedWhereQuery[attributeName] = parsedAttributeVal
    }
  }

  return parsedWhereQuery
}

type TCrudOptions = {
  searchField?: string,
}

type TGetEntityHooks<T> = {
  afterFind: (data: T, req: Request) => Promise<any>,
}

type TCreateHooks<T> = {
  beforeCreate?: (data: T & any, req: Request) => Promise<any>,
  afterCreate?: (data: T, req: Request) => Promise<any>,
}

type TUpdateHooks<T> = {
  beforeUpdate?: (data: T & any, req: Request) => Promise<any>,
  afterUpdate?: (data: T, req: Request) => Promise<any>,
}

type TDeleteHooks<T> = {
  afterDelete: (data: T, req: Request) => Promise<void>
}

type TListEntityOptions<T> = TCrudOptions & {
  hooks?: TGetEntityHooks<T[]>,
}

type TGetEntityOptions<T> = TCrudOptions & {
  hooks?: TGetEntityHooks<T>,
}

type TCreateEntityOptions<T> = TCrudOptions & {
  hooks?: TCreateHooks<T>,
}

type TUpdateEntityOptions<T> = TCrudOptions & {
  hooks?: TUpdateHooks<T>
}

type TDeleteEntityOptions<T> = TCrudOptions & {
  hooks?: TDeleteHooks<T>
}

type TCrudRoutesOptions<T> = TCrudOptions & {
  middlewares?: TWrapController[],
  listEntityOptions?: TListEntityOptions<T> & { middlewares?: TWrapController[] },
  getEntityOptions?: TGetEntityOptions<T> & { middlewares?: TWrapController[] },
  createEntityOptions?: TCreateEntityOptions<T> & { middlewares?: TWrapController[] },
  updateEntityOptions?: TUpdateEntityOptions<T> & { middlewares?: TWrapController[] },
  deleteEntityOptions?: TDeleteEntityOptions<T> & { middlewares?: TWrapController[] },
}


const listEntity = <T extends Model>(model: ModelDefinedNext<T>, options?: TListEntityOptions<T>): TWrapController => {
  return async (req) => {
    const {
      sort,
      sortBy,
      limit,
      offset,
      whereQuery,
    } = parseQuery(req.query)

    const parsedWhereQuery = parseWhereQuery(model, whereQuery || null)

    let {rows, count} = await model.findAndCountAll({
      limit: limit || DefaultLimit,
      offset: offset || 0,
      raw: true,
      ...(parsedWhereQuery ? { where: parsedWhereQuery } : {}),
      ...(sortBy ? {sortBy} : {}),
      ...(sort ? {sort} : {}),
    }) as { rows: T[], count: number }

    if (options?.hooks?.afterFind) {
      rows = await options.hooks.afterFind(rows, req)
    }

    return {
      rows: omitHiddenProps(model, rows),
      total: count,
      limit: limit || DefaultLimit,
      offset: offset || 0,
    }
  }
}

const getEntity = <T extends Model>(model: ModelDefinedNext<T>, options?: TGetEntityOptions<T>): TWrapController => {
  const searchField = options?.searchField || DefaultSearchField

  return async (req) => {
    const searchVal = req.params[searchField]

    const entity = await model.findOne({
      // @ts-ignore
      where: {[searchField]: searchVal},
      raw: true,
    }) as (T | null)

    if (!entity) {
      throw new APIError('not_found', 404)
    }


    if (options?.hooks?.afterFind) {
      const mutateEntity = await options.hooks.afterFind(entity, req)
      return omitHiddenProps(model, mutateEntity)
    }

    return omitHiddenProps(model, entity)
  }
}

const createEntity = <T extends Model>(model: ModelDefinedNext<T>, options?: TCreateEntityOptions<T>): TWrapController => {
  return async (req) => {
    let plain = req.body as T

    if (_.isEmpty(plain)) {
      throw new APIError('empty_body', 400)
    }

    if (options?.hooks?.beforeCreate) {
      plain = await options.hooks.beforeCreate(plain, req)
    }

    // @ts-ignore
    const entity = await model.create(omitImmutableProps(model, plain))

    if (options?.hooks?.afterCreate) {
      const mutateEntity = await options.hooks.afterCreate(entity.get({plain: true}), req)
      return omitHiddenProps(model, mutateEntity)
    }

    return omitHiddenProps(model, entity)
  }
}

const updateEntity = <T extends Model>(model: ModelDefinedNext<T>, options?: TUpdateEntityOptions<T>): TWrapController => {
  const searchField = options?.searchField || DefaultSearchField

  return async (req) => {
    const searchVal = req.params[searchField]
    let plain = req.body as T

    // @ts-ignore
    const existCount = await model.count({where: {[searchField]: searchField}}) as number

    if (existCount === 0) {
      throw new APIError('not_found', 404)
    }

    if (options?.hooks?.beforeUpdate) {
      plain = await options.hooks.beforeUpdate(plain, req)
    }

    // @ts-ignore
    const [, entities] = await model.update(omitImmutableProps(model, plain), {where: {[searchField]: searchVal}})
    let entity = entities[0].get({plain: true})

    if (options?.hooks?.afterUpdate) {
      entity = await options.hooks.afterUpdate(entity, req)
    }

    return omitHiddenProps(model, entity)
  }
}

const deleteEntity = <T extends Model>(model: ModelDefinedNext<T>, options?: TDeleteEntityOptions<T>): TWrapController => {
  const searchField = options?.searchField || DefaultSearchField

  return async (req) => {
    const searchVal = req.params[searchField]

    // @ts-ignore
    const entity = await model.findOne({where: {[searchField]: searchField}})

    if (!entity) {
      throw new APIError('not_found', 404)
    }

    // @ts-ignore
    await model.destroy({where: {[searchField]: searchVal}})

    if (options?.hooks?.afterDelete) {
      await options.hooks.afterDelete(entity.get({plain: true}), req)
    }

    return 'ok'
  }
}

const addCrudRoutes = <T extends Model>(app: Router, model: ModelDefinedNext<T>, options?: TCrudRoutesOptions<T>) => {
  const searchField = options?.searchField || DefaultSearchField
  const generalMiddlewares = options?.middlewares || []

  app.get('/', wrap(
    ...generalMiddlewares, ...(options?.listEntityOptions?.middlewares || []),
    listEntity(model, {searchField, ...options?.listEntityOptions})
  ))

  app.get(`/${options?.getEntityOptions?.searchField || searchField}`, wrap(
    ...generalMiddlewares, ...(options?.getEntityOptions?.middlewares || []),
    getEntity(model, {searchField, ...options?.getEntityOptions})
  ))

  app.post('/', wrap(
    ...generalMiddlewares, ...(options?.createEntityOptions?.middlewares || []),
    createEntity(model, {searchField, ...options?.createEntityOptions})
  ))

  app.put(`/${options?.updateEntityOptions?.searchField || searchField}`, wrap(
    ...generalMiddlewares, ...(options?.updateEntityOptions?.middlewares || []),
    updateEntity(model, {searchField, ...options?.updateEntityOptions})
  ))

  app.delete(`/${options?.deleteEntityOptions?.searchField || searchField}`, wrap(
    ...generalMiddlewares, ...(options?.deleteEntityOptions?.middlewares || []),
    deleteEntity(model, {searchField, ...options?.deleteEntityOptions})
  ))
}

export const cruds = {
  DefaultSearchField,
  DefaultLimit,

  omitHiddenProps,
  omitImmutableProps,

  tryParseDate,
  parseQuery,
  parseWhereQuery,

  listEntity,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,

  addCrudRoutes,
}
