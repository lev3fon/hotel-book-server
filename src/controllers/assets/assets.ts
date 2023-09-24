import { Router } from "express";
import {cruds} from "../../utils/api-helpers";
import dbModels from "../../db-models";


const app = Router()

cruds.addCrudRoutes(app, dbModels.Asset)


export { app as assetsRoutes }
