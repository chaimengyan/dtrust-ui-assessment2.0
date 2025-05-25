// streamChatMixin.js
import { fetchEventSource } from '@microsoft/fetch-event-source'
import CookieUtil from "@/util/cookie";

const { access_token } = CookieUtil.getToken()

export const streamChatMixin = {
  data() {
    return {
      messageStream: '',
      isStreaming: false,
      streamController: null
    }
  },
  methods: {
    async startStreaming(prompt) {
      // Reset state
      this.messageStream = ''
      this.isStreaming = true
      
      // Create new AbortController
      this.streamController = new AbortController()

      try {
        await fetchEventSource(`/dtrust-api/intelligence/chatting/dialogue?chatId=${prompt.chatId}&message=${encodeURIComponent(prompt.message)}`, {
          method: 'GET',
          headers: {
            'Accept': 'text/event-stream',
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'text/event-stream'
          },
          signal: this.streamController.signal,
          
          onopen: async (response) => {
            if (!response.ok || response.status !== 200) {
              throw new Error(`请求失败: ${response.status}`)
            }
          },
          
          onmessage: (event) => {
            console.log(event, 'event');
            
            if (event.data === '[DONE]') {
              this.streamController?.abort()
              return
            }
            
            try {
              const data = JSON.parse(event.data)
              if (data.finish_reason === 'stop') {
                this.streamController?.abort()
                return
              }
              console.log(data, 'datasssssss');
              this.messageStream = data.data
            } catch (err) {
              console.error('解析错误:', err)
            }
          },
          
          onclose: () => {
            this.isStreaming = false
          },
          
          onerror: (err) => {
            throw err
          }
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('流式请求错误:', error)
          this.messageStream += '\n\n[请求发生错误]'
        }
      } finally {
        this.isStreaming = false
      }
    },

    stopStreaming() {
      if (this.streamController) {
        this.streamController.abort()
        this.streamController = null
      }
    }
  }
}