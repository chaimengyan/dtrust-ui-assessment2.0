import request from '@/router/axios'

       
        // AI 创建新对话
        export function getChatIdApi () {
            return request({
            url: `/intelligence/chatting/getChatId`,
            method: 'get',
            })
        }
         // AI 获取本人的对话列表
         export function getChatListApi(type) {
            return request({
            url: `/intelligence/chatting/listForOwn?type=${type}`,
            method: 'get',
            })
        }
        // 根据对话id获取历史聊天记录
        export function listMessagesApi (chatId, cryptonymId, type) {
            return request({
            url: `/intelligence/chatting/listMessages?chatId=${chatId}&cryptonymId=${cryptonymId}&type=${type}`,
            method: 'get',
            })
        }
        // AI chat
        export function AIChatApi (message, chatId) {
            return request({
            url: `/intelligence/chatting/dialogue?chatId=${chatId}&message=${message}`,
            method: 'get',
            })
        }
        // 根据对话id获取历史聊天记录
        export function listByChatIdApi(message, chatId){
            return request({
            url: `/intelligence/chatting/listByChatId?chatId=${chatId}`,
            method: 'get',
            })
        }
          // 处理对应功能 一键代入
        export function generateApi(query) {
            return request({
            url: `/intelligence/chatting/generate?type=${query.type}&questionId=${query.questionId}&messageId=${query.messageId}&voice=${query.voice}&projectIds=${query.projectIds}&mainBodyIds=${query.mainBodyIds}`,
            method: 'post',
            })
        }
         // 处理对应功能 一键代入
         export function delChatApi(chatId) {
            return request({
            url: `/intelligence/chatting/${chatId}`,
            method: 'delete',
            })
        }
        
        
