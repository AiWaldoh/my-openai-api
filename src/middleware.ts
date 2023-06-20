import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from './errorHandler'

export const applyMiddlewares = (app: Express) => {
  app.use(express.json())
  app.use(cors())
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  )
  app.use(morgan('dev'))
  app.use(errorHandler)
}
