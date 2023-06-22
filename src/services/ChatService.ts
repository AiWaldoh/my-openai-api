import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HttpClient } from '../http/HttpClient'
import {
  HumanChatMessage,
  SystemChatMessage,
  AIChatMessage
} from 'langchain/schema'

export class ChatService {
  private chat: ChatOpenAI
  private messages: (HumanChatMessage | SystemChatMessage | AIChatMessage)[]
  private systemMessage: SystemChatMessage
  private totalTokens: number

  constructor (
    modelName: string,
    systemMessage: string = 'You are a helpful assistant'
  ) {
    this.chat = new ChatOpenAI({
      modelName: modelName,
      openAIApiKey: process.env.OPENAI_API_KEY as string,
      temperature: 0
    })
    this.totalTokens = 0
    this.systemMessage = new SystemChatMessage(systemMessage)
    this.messages = [this.systemMessage]
  }

  addMessage (message: string): void {
    this.messages.push(new HumanChatMessage(message))
  }
  async getTotalTokens (): Promise<number> {
    return (await this.chat.getNumTokensFromMessages(this.messages)).totalCount
  }

  async sendMessage (): Promise<AIChatMessage> {
    const response = await this.chat.call(this.messages)
    this.messages.push(response)
    //this.totalTokens = await this.getTotalTokens()
    //this.removeExcessTokens()
    return response
  }
  async webAPIsendMessage (
    message: string,
    model: string,
    conversation_id: string,
    parent_message_id: string
  ): Promise<String> {
    const client = new HttpClient(
      ('http://' + process.env.PROXY_IP) as string,
      process.env.BEARER_TOKEN as string
    )

    console.log(`sending post to message ${message} and ${model}`)

    try {
      const response = await client.post('/chat', {
        message: message,
        conversation_id: '',
        parent_message_id: '',
        model: model
      })
      console.log(response.data)
      return response.data
    } catch (error) {
      console.error(error)
      return 'error'
    }
  }
  get modelName () {
    return this.chat.modelName
  }
  set modelName (value: string) {
    this.chat.modelName = value
  }

  resetMessages (): void {
    this.messages = [this.systemMessage]
  }

  async removeExcessTokens (): Promise<void> {
    this.totalTokens = await this.getTotalTokens()
    if (this.totalTokens > 14000) {
      let result: number = 0
      console.log(`token count > 14000`)
      while (this.messages.length > 0 && result >= 8000) {
        this.messages.pop()
        result = await this.getTotalTokens()
      }
    }
  }
}
