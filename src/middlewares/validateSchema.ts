import { Request, Response, NextFunction } from 'express'
import { AnyZodObject } from 'zod'

const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      })

      return next()
    } catch (error: any) {
      console.error(error.errors)
      res.status(400).json({
        status: false,
        path: error.errors[Object.keys(error.errors)[0]].path,
        error: error.errors[Object.keys(error.errors)[0]].message,
      })
    }
  }
}

export default validateSchema
