// streamChatMixin.js
import { fetchEventSource } from '@microsoft/fetch-event-source'
import CookieUtil from "@/util/cookie";
const baseUrl = process.env.VUE_APP_BASE_URL

const { access_token } = CookieUtil.getToken()

export const streamChatMixin = {
  data() {
    return {
      messageStream: '',
      isStreaming: false,
      streamController: null,
      msgInfo: {}
    }
  },
  methods: {
    async startStreaming(prompt) {
      // Reset state
      this.messageStream = ''
      this.msgInfo = {}
      this.isStreaming = true
      
      // Create new AbortController
      this.streamController = new AbortController()

      try {
        await fetchEventSource(`${baseUrl}/intelligence/chatting/dialogue`, {
          method: 'POST',
          headers: {
            'Accept': 'text/event-stream',
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(prompt),
          signal: this.streamController.signal,
          
          onopen: async (response) => {
            if (!response.ok || response.status !== 200) {
              throw new Error(`请求失败: ${response.status}`)
            }
          },
          
          onmessage: (event) => {
            
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
              if(typeof data === 'string')  {
                this.messageStream += data
              }else {
                console.log(data.data,'ddadddd')
                this.msgInfo = data.data
              }
              this.scrollToBottom();
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