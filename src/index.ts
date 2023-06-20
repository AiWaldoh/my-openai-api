import express from 'express'
import { applyMiddlewares } from './middleware'
import { startServer } from './server'
import { ChatController } from './controllers/ChatController'
import { ModelController } from './controllers/ModelController'

import dotenv from 'dotenv'

dotenv.config()
const app = express()
applyMiddlewares(app)

const chatController = new ChatController()
const modelController = new ModelController()

app.post('/message', chatController.handleMessage)
app.get('/models', modelController.listModels)
startServer(app)
