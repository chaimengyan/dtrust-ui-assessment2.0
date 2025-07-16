<template>
     <div class="welcome-container">
        <div class="welcome-text">
            {{$t('chat.您好我是小信同学您的数据合规小助手您可以向我提出本系统使用问题')}}
        </div>
        <div class="quick-questions" v-for="(item, index) in questions" :key="index">
            <div class="q-item" @click="checkMsg(item)">
                <el-link
                    :underline="false"
                    icon="el-icon-edit"
                    >
                    {{item.value }}
                </el-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            questions: [{label: this.$t('chat.数据合规管理系统主要功能有什么'), value: this.$t('chat.数据合规管理系统主要功能有什么')},
                {label: this.$t('chat.如何创建资产'), value: this.$t('chat.如何创建资产')},
                {label: this.$t('chat.如何进行评估'), value: this.$t('chat.如何进行评估')}
            ]
        }
    },
    methods: {
        checkMsg(val) { 
            console.log(val,'快捷问答');
            this.$emit('checkMsg', val);
        },
    }
}

</script>
<style lang="scss" scoped>
.welcome-container {
    .welcome-text {}
    .quick-questions {
        background: aliceblue;
        padding: 10px 10px;
        border-radius: 10px;
        cursor: pointer;
        margin: 10px;
        .q-item {}
    }
   
}
</style>