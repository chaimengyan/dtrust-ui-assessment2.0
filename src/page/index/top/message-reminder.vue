<template>
    <div>
        <el-popover
            placement="bottom"
            width="300"
            trigger="click"
            @show="openMessage">
            <div>
                <div class="mes-header">
                    <div>通知</div>
                    <el-button type="text" @click="allRead">全部已读</el-button>
                </div>
                <div class="mes-body" >
                    <div class="mes-body-row" v-for="(item,index) in noticeList" :key="index">
                        <div class="mes-body-row-title">
                            <!-- 0 未读 1已读 -->
                            <el-badge :is-dot="!item.status">
                                {{ item.title }}
                            </el-badge>
                        </div>
                        <div class="mes-body-row-content" @click="handle(item)" v-html="item.message"></div>
                        <div class="mes-body-row-footer">
                            {{handleFooter(item) }}
                            <i style="color: red; margin-left: 80%;display: contents;" class="el-icon-delete" @click="delMessage(item.id)"></i>
                        </div>
                    </div>
                </div>
                <div class="mes-footer"></div>
            </div>
            <template  slot="reference">
                <el-badge :is-dot="!isRead" style="font-size: 18px;margin-bottom: 6px;">
                    <i class="el-icon-bell"></i>
                </el-badge>
            </template>
        </el-popover>
    </div>
</template>

<script>
import { getNoticePage, readNotice, delNotice} from "@/api/admin/menu"
import {dateFormat} from "@/filters"

export default {
    name: 'message-reminder',

    props: {
        depts: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return{
            currentPage: 1,
            pageSize: 20,
            noticeList: [],
            isRead: true,
        }
    },
    computed: {
        handleFooter() {
            return(item) => {
                return `${item.updateBy}，${dateFormat(item.updateTime)}`
            }
        }
    },
    created() {
        this.openMessage()
    },
    mounted() {
        document.addEventListener("visibilitychange", this.openMessage);
        setInterval(() => {
            this.openMessage()
        }, 10000);
    },
    beforeDestroy() {
      document.removeEventListener("visibilitychange", this.openMessage);
    },
    methods: {
        openMessage() {
            getNoticePage({
                current: this.currentPage,
                size: this.pageSize,
            }).then(res => {
                this.noticeList = res.data.data.records
                this.isRead = res.data.data.records.every(x => x.status === 1)
            })
        },
        allRead() {
            const ids = this.noticeList.filter(x => x.status === 0).map(y => y.id)
                ids.length !==0 && this.readNotice(ids)
        },
        readNotice(ids) {
            readNotice(ids).then(res => {
                this.openMessage()
            })
        },
        delMessage(id) {
            delNotice(id).then(res => {
                this.$message.success(res.data.message)
                this.openMessage()
            })
        },
        handle(mes) {
            // this.readNotice(mes.id)
            this.delMessage(mes.id)
        },
    }
}
</script>
<style lang="scss" scoped>

.mes-header {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid rgb(214, 214, 214) ;
}

.mes-body {
    max-height: 400px;
    overflow-y: scroll;
  // height: 300px;
  border-bottom: 1px solid rgb(214, 214, 214) ;
  .mes-body-row {
    padding: 5px;
    border-bottom: 1px solid rgb(238, 238, 238) ;
    .mes-body-row-title {
      font-size: 14px;
      font-weight: 600;
    }
    .mes-body-row-content {        
      font-size: 14px;
      color:rgb(93, 93, 93);
      margin: 5px;
    }
    .mes-body-row-footer {
      font-size: 14px;
      text-align: left;
      color:rgb(122, 122, 122);
    }
  }
}

  .mes-dot {
  }
  </style>