<template>
    <QuestionModal ref="qm">
        <div class="chat-container">
            <div class="chat-slider">
                <div class="conversation-list">
                    <div v-for="(item, index) in chatList" :key="index" class="conversation-item">
                        <div @click="checkMsg(item)">{{ item.title }}</div>
                    </div>
                </div>
            </div>
            <div class="chat">
                <div ref="chatContainer" class="chat-content">
                    <div v-for="(item, i) in messageList" :key="i" class="message-item" :class="{ [`msg-${item.type}`]: true }">
                        <span class="avatar" :class="{ [`avatar-${item.type}`]: true }">
                            <img v-if="!item.type" src="/img/aiAvatar.svg" height="32px" width="32px">
                            <i v-else class="el-icon-user"></i>
                        </span>
                        <div v-if="item.content === ''" class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                                
                        <template v-else>
                            <span 
                                class="msg-content" 
                                :style=" item.type ? 'background-color: rgb(0 99 255 / 8%)':'background-color:rgba(0, 0, 0, 0.08)'" 
                                v-html="item.type ? renderMarkdown(item.content) : renderMarkdown(item.content.content)"
                            ></span>
                            <el-button 
                                v-if="!item.type && i!==0 && messageType !== ''" 
                                type="text" size="small" 
                                @click="handleReplace(item, i)">一键代入</el-button>
                        </template>
                    </div>
                </div>

                <div class="chat-input-container">
                    <div class="file-list">
                        <div v-for="(item, index) in fileList" :key="item.name" class="file-item">
                            <i class="el-icon-circle-close del-btn ml-2" @click="handleDelete(item, index)"></i>
                            <el-tooltip placement="top" popper-class="my-tooltip-class" :content="item.name">
                                <div class="file-name">{{item.name}}</div>
                            </el-tooltip>
                        </div>
                    </div>
                    <input ref="fileRef" style="display: none;" type="file" @change="onFileChange">
                    <div class="chat-input-container-inner">
                        <textarea 
                            v-model="input" 
                            @keydown.enter.exact.prevent="send('')"
                            @keydown.shift.enter.exact.prevent="input += '\n'"
                            placeholder="输入消息..."
                            rows="3"
                            ref="textareaRef"
                        ></textarea>
                        <el-button style="margin-left: 12px;" :disabled="!(input.trim()&&isSend)" size="small" type="primary" icon="el-icon-top" circle @click="send('')" />
                    </div>
                </div>
            </div>
        </div>
    </QuestionModal>
  
</template>

<script>
import { getChatIdApi, getChatListApi, AIChatApi, generateApi } from '@/api/admin/index'
import { streamChatMixin } from './useStreamChat'
import MarkdownIt from 'markdown-it'
import QuestionModal from '../QuestionModal/src/QuestionModal.vue'

export default {
    mixins: [streamChatMixin],
    components: { QuestionModal },
    data() {
        return {
            tooltip: false,
            fileList: [],
            sendBtn: this.$t('message.chat.发送'),
            input: '',
            sessionId: '',
            chatId: '',
            chatList: [],
            messageList: [],
            isSend: true,
            messageType: '',
            messageQuestionId: null,
            md: new MarkdownIt(),
            // Stream chat related
            isStreaming: false,
            messageStream: '',
            // Element icons (using class names instead of components)
            icons: {
                top: 'el-icon-top',
                circleClose: 'el-icon-circle-close',
                user: 'el-icon-user'
            }
        }
    },
    methods: {
        start() {
            // 每次打开时，可以清除缓存
            this.$refs.qm.start();
        },
        scrollToBottom() {
            this.$nextTick(() => {
                if (this.$refs.chatContainer) {
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
                }
            })
        },
        createChat() {
            return getChatIdApi().then(res => {
                this.chatId = res.data
                this.getChatList()
            })
        },
        getChatList() {
            getChatListApi().then(res => {
                this.chatList = res.data
            })
        },
        checkMsg(val) {
            console.log(val, '切换对话')
        },
        handleReplace(item, index) {
            generateApi(this.messageType, this.messageQuestionId, item.content.id).then(res => {
                this.$emit('message', res.data)
            })
        },
        createMessage(content, type) {
            return {
                avatar: '',
                content,
                type
            }
        },
        handleDelete(item, index) {
            this.fileList.splice(index, 1)
        },
        openFileUpload() {
            this.$refs.fileRef.click()
        },
        onFileChange(e) {
            this.fileList.push(...e.target.files)
        },
        renderMarkdown(text) {
            return this.md.render(text || '')
        },
        async send(val) {
            if(val === 'rigthLoading') {
                this.messageList.push(this.createMessage('', 1)) // Type.right
                this.isSend = false
                return
            }
            if(!this.input.trim()) {
                this.$message.warning(this.$t('message.chat.不能发送空白信息'))
                this.input = ''
                return
            }
            if(val === 'rightData') {
                await this.createChat()
            }
            this.messageList.push(this.createMessage(this.input, 1)) // Type.right
            this.messageList.push(this.createMessage('', 0)) // Type.left
            this.isSend = false
            
            this.startStreaming({message: this.input, chatId: this.chatId}).then(res => {
                this.messageList[this.messageList.length-1] = this.createMessage(this.messageStream, 0) // Type.left
                this.isSend = true
                this.scrollToBottom()
            })
            
            this.input = ''
            if (this.$refs.textareaRef) {
                this.$refs.textareaRef.style.height = 'auto'
            }
            this.scrollToBottom()
        }
    },
    watch: {
        input() {
            this.$nextTick(() => {
                if (this.$refs.textareaRef) {
                    this.$refs.textareaRef.style.height = 'auto'
                    this.$refs.textareaRef.style.height = `${Math.min(
                        this.$refs.textareaRef.scrollHeight,
                        200
                    )}px`
                }
            })
        }
    },
    mounted() {
        // this.getChatList()
    }
}
</script>

<style>
.my-tooltip-class {
    z-index: 3001 !important;
}
</style>
<style lang="scss" scoped>
/* Your SCSS styles remain exactly the same */
.typing-dots {
  display: inline-flex;
  align-items: center;
  height: 17px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #6e6e80;
  border-radius: 50%;
  display: inline-block;
  animation: typing-dots 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
.chat-container {
    display: flex;
    align-items: flex-start;
    height: 100%;
    .chat-slider {
        width: 150px;
        height: 98%;
        background-color: #f2f2ff;
        border-radius: 10px;
        margin: 2px 8px;
        display: flex;
        flex-direction: column;
        .conversation-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px 0;
        }
        
        .conversation-item {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .conversation-item:hover {
            background-color: #f7f7f8;
        }
    }
}
@keyframes typing-dots {
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

    .chat {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;

        .chat-content {
            flex: 1;
            overflow-y: auto;
            height: 0;
            padding: 15px;
            display: flex;
            flex-direction: column;
            .avatar {
                height: 30px;
                width: 30px;
                border-radius: 50%;
                line-height: 30px;
                text-align: center;
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                &.avatar-0 {
                    color: aqua;
                }

                &.avatar-1 {
                    background-color: #88b4e4;
                    color: aliceblue;
                }
            }
            .message-item {
                margin-bottom: 10px;
                display: flex;
                flex-direction: column;

                &.msg-0 {
                    align-items: flex-start;
                }

                &.msg-1 {
                    align-items: flex-end;
                }

                .msg-content {
                    max-width: 70%;
                    word-break: break-all;
                    border-radius: 8px;
                    padding: 3px 6px;
                }
            }
        }
        .chat-input-container {
          
            background: #f4f6f7;
            padding: 10px 15px;
            border-radius: 10px;
            margin: 10px;
            .chat-input-container-inner {
                display: flex;
                align-items: center;
            }

            .chat-input {
                width: 100%;
                background: #fff;
                border-radius: 4px;
                padding: 0 10px;
                border: none;
                list-style: none;
                outline-style: none;
            }
            textarea {
                flex: 1;
                border: none;
                resize: none;
                outline: none;
                background-color: transparent;
                max-height: 300px;
                font-size: 14px;
                line-height: 1.5;
                padding: 4px 0;
            }
            .file-list {
                padding: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;
                overflow-x: auto;

                .file-item {
                    background-color: #bcbcbc;
                    border-radius: 12px;
                    align-items: center;
                    padding: 8px;
                    display: flex;
                    max-width: 40%;
                    position: relative;
                    .file-name {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fff;
                        min-height: 20px;
                        margin: 0;
                        font-size: 14px;
                        font-weight: 500;
                        line-height: 20px;
                        overflow: hidden;
                    }
                    .del-btn {
                        width: 15px;
                        height: 15px;
                        position: absolute;
                        font-size: 16px;
                        right: -6px;
                        top: -13px;
                        cursor: pointer;
                        color: #f56363;
                    }
                }
            }
        }
    }
</style>