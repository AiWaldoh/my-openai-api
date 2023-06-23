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
      const model = req.body.model
      const modelType = req.body.modelType

      if (model) {
        console.log(`model name ${model}`)
        this.chatService.modelName = model
      }
      //modelType is api or web
      if (modelType === 'web') {
        console.log(`model type is web`)
        const response = await this.chatService.reverseAPISendMessage(
          message,
          model,
          '',
          ''
        )
        console.log(`received response from reverse API`)
        res.json(response)
        return
      }
      this.chatService.addMessage(message)
      const response = await this.chatService.sendMessage()
      res.json(response)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
