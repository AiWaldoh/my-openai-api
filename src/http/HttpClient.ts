import axios, { AxiosResponse } from 'axios'

export class HttpClient {
  private readonly baseUrl: string
  private token: string | null

  constructor (baseUrl: string, token: string | null = null) {
    this.baseUrl = baseUrl
    this.token = token
  }

  private get headers (): { [key: string]: string } {
    let headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  async get (endpoint: string, params: object = {}): Promise<AxiosResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params,
        headers: this.headers
      })

      return response
    } catch (error) {
      console.error('Http Get Error:', error)
      throw error
    }
  }

  async post (endpoint: string, body: object = {}): Promise<AxiosResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}${endpoint}`, body, {
        headers: this.headers
      })

      return response
    } catch (error) {
      console.error('Http Post Error:', error)
      throw error
    }
  }

  setToken (token: string): void {
    this.token = token
  }
}
