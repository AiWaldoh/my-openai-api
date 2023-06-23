// controllers/ModelController.ts
import { Request, Response } from 'express'
import { Configuration, OpenAIApi } from 'openai'
import { HttpClient } from '../http/HttpClient'
export class ModelController {
  private openai: OpenAIApi

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.openai = new OpenAIApi(configuration)
    this.listModels = this.listModels.bind(this)
  }
  async listModels(req: Request, res: Response) {
    try {
      const response = await this.openai.listModels()
      if (!Array.isArray(response.data.data)) {
        console.error('response.data.data is not an array', response.data)
        res.status(500).json({ error: 'Invalid data received from API' })
        return
      }

      const filteredApiModelDetails = response.data.data
        .filter((model: any) => model.id.includes('gpt'))
        .map((model: any) => ({
          model_name: model.id,
          model_type: "api" // Static value
        }));

      const reverseModels = await this.reverseAPIGetModels();
      let filteredWebModelDetails: any[] = [];
      if (reverseModels !== "error") {
        if (!Array.isArray(reverseModels.models)) {
          console.error('reverseModels.models is not an array', reverseModels)
          res.status(500).json({ error: 'Invalid data received from reverse API' })
          return
        }
        filteredWebModelDetails = reverseModels.models
          .map((model: any) => ({
            model_name: model.slug,
            model_type: "web" // Static value
          }));
      }

      // Merge both model details
      const mergedModelDetails = [...filteredApiModelDetails, ...filteredWebModelDetails];

      // Return mergedModelDetails instead of response.data
      res.json({ models: mergedModelDetails })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'An error occurred' })
    }
  }
  async reverseAPIGetModels(): Promise<any> {

    const client = new HttpClient(('http://' + process.env.PROXY_IP) as string, process.env.BEARER_TOKEN as string)

    console.log(`sending GET /models`)

    try {
      const response = await client.get('/models')

      console.log(response.data)
      const parsedData = JSON.parse(response.data)
      return parsedData

    } catch (error) {
      console.error(error)
      return 'error'
    }
  }

}
