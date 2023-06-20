// controllers/ModelController.ts
import { Request, Response } from 'express'
import { Configuration, OpenAIApi } from 'openai'

export class ModelController {
  private openai: OpenAIApi

  constructor () {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.openai = new OpenAIApi(configuration)
    this.listModels = this.listModels.bind(this)
  }

  async listModels (req: Request, res: Response) {
    try {
      const response = await this.openai.listModels()

      res.json(response.data)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
}
