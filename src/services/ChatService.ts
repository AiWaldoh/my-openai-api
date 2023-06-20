import { ChatOpenAI } from 'langchain/chat_models/openai'
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
  async removeExcessTokens (): Promise<void> {
    this.totalTokens = await this.getTotalTokens()
    console.log(this.totalTokens)
    if (this.totalTokens > 000) {
      let result: number = 0
      console.log(`token count > 14000`)
      while (this.messages.length > 0 && result >= 8000) {
        this.messages.pop()
        result = await this.getTotalTokens()
      }
    }
  }

  async sendMessage (): Promise<AIChatMessage> {
    const response = await this.chat.call(this.messages)
    this.messages.push(response)
    //dont await who cares
    //this.removeExcessTokens()
    return response
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
}
