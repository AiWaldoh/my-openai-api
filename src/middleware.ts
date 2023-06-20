import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './errorHandler'

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers['authorization']
  if (!bearerHeader) {
    return res.status(400).send('Authorization header is required')
  }
  if (bearerHeader !== `Bearer ${process.env.BEARER_TOKEN}`) {
    return res.sendStatus(403)
  }
  next()
}

export const applyMiddlewares = (app: Express) => {
  app.use(express.json())
  app.use(cors())
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  )
  app.use(morgan('dev'))
  app.use(checkAuth)
  app.use(errorHandler)
}
