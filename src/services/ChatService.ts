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
  private parent_message_id: string
  private conversation_id: string

  constructor(
    modelName: string = 'gpt-3.5-turbo',
    systemMessage: string = 'You are a helpful assistant'
  ) {
    this.chat = new ChatOpenAI({
      modelName: modelName,
      openAIApiKey: process.env.OPENAI_API_KEY as string,
      temperature: 0
    })
    this.totalTokens = 0
    this.parent_message_id = ""
    this.conversation_id = ""

    this.systemMessage = new SystemChatMessage(systemMessage)
    this.messages = [this.systemMessage]
  }

  addMessage(message: string): void {
    this.messages.push(new HumanChatMessage(message))
  }
  async getTotalTokens(): Promise<number> {
    return (await this.chat.getNumTokensFromMessages(this.messages)).totalCount
  }

  async sendMessage(): Promise<AIChatMessage> {
    const response = await this.chat.call(this.messages)
    this.messages.push(response)
    //this.totalTokens = await this.getTotalTokens()
    return response
  }
  async reverseAPISendMessage(message: string, conversation_id: string, parent_message_id: string): Promise<String> {
    const model = this.modelName
    const client = new HttpClient(('http://' + process.env.PROXY_IP) as string, process.env.BEARER_TOKEN as string)

    conversation_id = conversation_id || this.conversation_id;
    parent_message_id = parent_message_id || this.parent_message_id;

    try {
      const response = await client.post('/chat', { message, conversation_id, parent_message_id, model })
      this.conversation_id = response.data.conversation_id;
      this.parent_message_id = response.data.message.id;
      return response.data
    } catch (error) {
      console.error(error)
      return 'error'
    }
  }

  get modelName() {
    return this.chat.modelName
  }

  set modelName(value: string) {
    this.chat.modelName = value
  }

  resetMessages(): void {
    this.messages = [this.systemMessage]
  }
}

