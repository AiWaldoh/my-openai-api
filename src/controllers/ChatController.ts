import { Request, Response } from 'express'
import { ChatService } from '../services/ChatService'

export class ChatController {
  private chatService: ChatService

  constructor (
    modelName: string = 'gpt-3.5-turbo-16k',
    systemMessage: string = 'You are a helpful assistant'
  ) {
    this.chatService = new ChatService(modelName, systemMessage)
    this.handleMessage = this.handleMessage.bind(this)
  }

  async handleMessage (req: Request, res: Response) {
    try {
      const message = req.body.message
      const model = req.body.model
      if (model) {
        console.log(`model name ${model}`)
        this.chatService.modelName = model
      }
      this.chatService.addMessage(message)
      const response = await this.chatService.sendMessage()
      console.log(response)
      res.json(response)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
