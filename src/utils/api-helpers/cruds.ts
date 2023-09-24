import {Model,} from "sequelize";
import {Request, Router} from "express";
import {APIError, TWrapController, wrap} from "./wrap";
import {ModelDefinedNext} from "../../db-models/default.type";
import _ from "lodash";
import {logger} from "./logger";


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
    limit: _.isNumber(limit) ? Number(limit) : null,
    offset: _.isNumber(offset) ? Number(offset) : null,
    whereQuery: _.isEmpty(whereQuery) ? null : whereQuery,
  }
}

type TCrudOptions = {
  searchField?: string,
}

type TGetEntityHooks<T> = {
  afterFind: (data: T, req: Request) => Promise<any>,
}

type TCreateHooks<T> = {
  beforeCreate: (data: T & any, req: Request) => Promise<any>,
  afterCreate: (data: T, req: Request) => Promise<any>,
}

type TUpdateHooks<T> = {
  beforeUpdate: (data: T & any, req: Request) => Promise<any>,
  afterUpdate: (data: T, req: Request) => Promise<any>,
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
      whereQuery, // TODO: Добить парсилку whereQuery
    } = parseQuery(req.query)

    let {rows, count} = await model.findAndCountAll({
      limit: limit || DefaultLimit,
      offset: offset || 0,
      raw: true,
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
      await options.hooks.afterDelete(entity.get({ plain: true }), req)
    }

    return 'ok'
  }
}

const addCrudRoutes = <T extends Model>(app: Router, model: ModelDefinedNext<T>, options?: TCrudRoutesOptions<T>) => {
  const searchField = options?.searchField || DefaultSearchField
  const generalMiddlewares = options?.middlewares || []

  app.get('/', wrap(
    ...generalMiddlewares, ...(options?.listEntityOptions?.middlewares || []),
    listEntity(model, { searchField, ...options?.listEntityOptions  } )
  ))

  app.get(`/${options?.getEntityOptions?.searchField || searchField}`, wrap(
    ...generalMiddlewares, ...(options?.getEntityOptions?.middlewares || []),
    getEntity(model, { searchField, ...options?.getEntityOptions })
  ))

  app.post('/', wrap(
    ...generalMiddlewares, ...(options?.createEntityOptions?.middlewares || []),
    createEntity(model, { searchField, ...options?.createEntityOptions })
  ))

  app.put(`/${options?.updateEntityOptions?.searchField || searchField}`, wrap(
    ...generalMiddlewares, ...(options?.updateEntityOptions?.middlewares || []),
    updateEntity(model, { searchField, ...options?.updateEntityOptions })
  ))

  app.delete(`/${options?.deleteEntityOptions?.searchField || searchField}`, wrap(
    ...generalMiddlewares, ...(options?.deleteEntityOptions?.middlewares || []),
    deleteEntity(model, { searchField, ...options?.deleteEntityOptions })
  ))
}

export const cruds = {
  omitHiddenProps,
  omitImmutableProps,

  listEntity,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,

  addCrudRoutes,
}
