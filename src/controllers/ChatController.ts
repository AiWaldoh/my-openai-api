import { Request, Response } from 'express'
import { ChatService } from '../services/ChatService'

export class ChatController {
  private chatService: ChatService

  constructor(
    modelName: string = 'gpt-3.5-turbo-16k',
    systemMessage: string = 'You are a helpful assistant'
  ) {
    this.chatService = new ChatService(modelName, systemMessage)
    this.handleMessage = this.handleMessage.bind(this)
  }

  async handleMessage(req: Request, res: Response) {
    try {
      const message = req.body.message
      const modelType = req.body.modelType

      //set model for request
      this.chatService.modelName = req.body.model || 'gpt-3.5-turbo'

      if (modelType === 'web') {
        return await this.handleWebAPI(message, res)
      } else {
        return await this.handleOpenAIAPI(message, res)
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'An error occurred' })
    }
  }

  private async handleOpenAIAPI(message: any, res: Response<any, Record<string, any>>) {
    this.chatService.addMessage(message)
    const response = await this.chatService.sendMessage()
    res.json(response)

  }

  private async handleWebAPI(message: any, res: Response<any, Record<string, any>>) {
    const response = await this.chatService.reverseAPISendMessage(message, '', '')
    res.json(response)

  }
}
