<template>
    <div>
        <el-tabs type="border-card" v-model="findAssetTab">
            <el-tab-pane name="findForm" :label="$t('findStart.发起任务')">
                <avue-form
                    ref="findForm"
                    :option="findStartOption"
                    v-model="findForm" 
                >
                    <template slot="evaluatorsHandle">
                        <el-select
                            v-model="findForm.evaluatorsHandle"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            value-key="userId"
                            >
                            <el-option
                                v-for="item in evaluatorList"
                                :key="item.userId"
                                :label="item.nickName"
                                :value="item">
                                    <span style="float: left">{{ item.nickName }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mail || item.phone }}</span>
                            </el-option>
                        </el-select>
                    </template>
                </avue-form>
            </el-tab-pane>
            <el-tab-pane name="findList" :label="$t('findStart.查看已发起的记录')">
            <FindList 
                ref="findList"
                :findType="findType"
            />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import {
  startFindJob
} from "@/api/assets/findAssets";
import {
  getUserList
} from "@/api/assets/components/releaseForm";
import  FindList from "@/views/assets/components/findList";
import {isMobile, isEmail} from '@/util/validate'
import {getObjType} from '@/util/util.js'
import {findStartOption} from "@/const/crud/components/findStart";

export default {
    name: "FindStart",
    components: {
        FindList,
    },
    props: {
      findType: {//1是发现资产，2是发现业务场景
          type: Number,
          default: 0
      },
    },
    data() {
        return {
            findAssetTab: 'findForm',
            // 被指派人列表
            evaluatorList: [],
            // 发现资产表单
            findForm: {},
        }
    },
    computed: {
        findStartOption() {
            return findStartOption(this)
        },

    },
    created() {
        this.initReleaseForm()
        this.getUserList()
    },
    methods: {
        initReleaseForm() {
            this.findForm = {
                // 任务名称
                jobName: '',
                // 处理后的被指派人
                evaluators: [],
                // 处理前的被指派人
                evaluatorsHandle: [],
                // 问卷截止时间
                endTime: '',
            }
        },
        // 发现资产提交表单
        findFormSave() {
            if(this.findAssetTab === 'findForm') {
                this.$refs.findForm.validate((valid, done,msg) => {
                     if (valid) {
                        this.findForm.jobUrl = `http://assets.idatatrust.com/#/findAssets`
                        this.findForm.findType = this.findType
                        const {evaluatorsHandle, ...rest} = this.findForm
                        for (let i = 0; i < evaluatorsHandle.length; i++) {
                            if(isEmail(evaluatorsHandle[i])) {
                                this.findForm.evaluators[i] = { mail: evaluatorsHandle[i] }
                            }else if(isMobile(evaluatorsHandle[i])) {
                                this.findForm.evaluators[i] = { mobilePhone: evaluatorsHandle[i] }
                            }else if(getObjType(evaluatorsHandle[i]) === 'object') {
                                this.findForm.evaluators[i] = { 
                                    evaluatorId: evaluatorsHandle[i].userId,
                                    // mail: evaluatorsHandle[i].mail,
                                    // mobilePhone: evaluatorsHandle[i].phone 
                                    }
                            }else {
                                this.$message.error(`${evaluatorsHandle[i]}${this.$t('findStart.既不是邮箱也不是手机号')}`)
                                return
                            }
                        }
                        this.startFindJob(rest)
                        done()
                    } else {
                        return false
                    }
                })
            } else {
                this.$emit('saveSuccess' )
            }
            
        },
        // 提交发现资产接口
        startFindJob(val) {
            startFindJob(val).then(res => {
                if(res.data.status == 200) {
                    this.initReleaseForm()
                    this.$message.success(res.data.message)
                }else {
                    this.$message.error(res.data.message)
                }
                this.$emit('saveSuccess' )

            })
        },
        // 获取全部用户
        getUserList() {
            getUserList().then(res => {
                this.evaluatorList = res.data.data
            })
        },
       
    }
}
</script>

<style lang="scss" scoped>

</style>