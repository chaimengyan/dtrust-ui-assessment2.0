<template>
    <div class="user">
        <basic-container>
            <avue-crud
                :option="option"
                ref="crud"
                v-model="form"
                :page.sync="page"
                @size-change="sizeChange"
                @current-change="currentChange"
                :table-loading="listLoading"
                @search-change="handleFilter"
                @search-reset="resetChange"
                @refresh-change="handleRefreshChange"
                :data="recordList"
            >
                <template slot="menuRight" slot-scope="{size}">
                    <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
                </template>
                <!-- 被评估人 -->
                <template slot="evaluators" slot-scope="scope">
                    <span>
                        {{ scope.row.evaluators.map(item => item.nickName).toString() }}
                    </span>
                </template>

                <!-- 审核人 -->
                <template slot="auditors" slot-scope="scope">
                    <span>
                        {{scope.row.auditors.map(item => item.nickName).toString()}}
                    </span>
                </template>
                
                <!-- 评估状态 -->
                <template slot="status" slot-scope="scope">
                    <span>
                        <el-tag 
                            :type="assessStatusList[scope.row.status].type">
                            {{ assessStatusList[scope.row.status].label }}
                        </el-tag>
                    </span>
                </template>

                <!-- 填写时间 -->
                <template slot="writeTime" slot-scope="scope">
                    <span>
                        {{ scope.row.writeTime || $t('crudCommon.暂无') }}
                    </span>
                </template>

                <!-- 审核时间 -->
                <template slot="auditorTime" slot-scope="scope">
                    <span>
                        {{ scope.row.auditorTime || $t('crudCommon.暂无') }}
                    </span>
                </template>

                <!-- 风险点 -->
                <template slot="risks" slot-scope="scope">
                    <span>
                        <div v-if="!scope.row.risks||scope.row.risks.length === 0">
                            {{$t('crudCommon.暂无')}}
                        </div>
                        <div class="questionLevels" v-else>
                            <div
                                class="questionLevels-item"
                                v-for="(item, index) in scope.row.risks" 
                                :style="`background-color:${item.color}`"
                                :key="item.levelId"
                                >
                                <el-tooltip effect="dark" :content="item.levelName">
                                    <div class="questionLevels-item-font">
                                        {{item.count}}
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                        
                    </span>
                </template>

                <!-- 评分标准 -->
                <template slot="scoringCriteria" slot-scope="scope">
                    <span>
                        {{ scope.row.scores[0] ? totalStandard[scope.row.scores[0].type] : $t('crudCommon.暂无')}}
                    </span>
                </template>

                <!-- 分数 -->
                <template slot="scores" slot-scope="scope">
                    <span>
                        {{ scope.row.scores[0] ? scope.row.scores[0].score : $t('crudCommon.暂无') }}
                    </span>
                </template>

                <!-- 风险等级 -->
                <template slot="level" slot-scope="scope">
                    <span>
                        <el-tag
                            style="color: #000000;"
                            :color="scope.row.scores.length !== 0 ? assessLevelColor[scope.row.scores[0].level] : ''">
                            {{  scope.row.scores.length !== 0 ? $t(`crudCommon.${scope.row.scores[0].level}`) 
                                : $t('crudCommon.暂无') }}
                        </el-tag>
                    </span>
                </template>

    
                <template slot="menu" slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="$t('evaluationRecord.查看详情')" placement="top">
                        <el-button
                                type="text"
                                icon="el-icon-view"
                                @click="viewBtn(scope.row, scope.index)"
                                :disabled="scope.row.assessStatus == 1"
                        />
                    </el-tooltip>
                    
                </template>
            </avue-crud>
            <div id="levelCharts" style="width: 380px;height: 300px;visibility:hidden;"></div>
            <div id="matterCharts" style="width: 380px;height: 300px;visibility:hidden;"></div>
        </basic-container>
    </div>
</template>

<script>
    import {tableOption} from "@/const/crud/assets/auditRecords";
    import {mapGetters} from "vuex";
    import {getAssetsAuditByPage, 
            getAllAssessScore,
            } from '@/api/assets/components/evaluationRecord'
    import {getUserList} from "@/api/assets/components/releaseForm";
    import {assessStatusList} from "@/util/enum";
    import { estimateUrl } from '@/util/env'

    export default {
        name: "evaluationRecord",
        components: { },
        props: {
           
        },
        
        data() {
            return {
                // 查看评分标准弹窗
                riskScoreDrawer: false,
                // 被评估人列表
                evaluatorList: [],
                // 确定发布loading
                loading: false,
                // 下拉选择问卷
                queOptions: [],
                // 问卷状态
                assessStatusList,
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20, // 每页显示多少条,
                    isAsc: false //是否倒序
                },
                query: {},
                // 问卷记录列表
                recordList: [],
                listLoading: true,
                form: {},
                treeTypeData: [],
                typeIds: [],
                defaultProps: {
                    label: "typeName",
                    value: "typeId"
                },
                // 启动弹窗
                releaseDialog: false,
                // 查看问卷记录弹窗
                viewQndrawer: false,
                // // 问卷答案
                // qnAnswers: {},
                // 问卷id
                qnId: '',
                // 风险点颜色区分
                tagColor: ['#2AFFFF', '#FFFF7F', '#FFAA55', '#FF2A00'],
                // 总分评分标准
                totalStandard: {
                    'total': this.$t('evaluationRecord.总分'),
                    'average': this.$t('evaluationRecord.平均分'),
                    'max': this.$t('evaluationRecord.最高分'),
                },
                // 风险等级颜色区分
                assessLevelColor: {'低': '#2AFFFF','中': '#FFFF7F', '高': '#FFAA55', '极高': '#FF2A00'},
                title: this.$t('evaluationRecord.启动评估'),
                isOverHidden: true,
                levelImg: '',
                matterImg: '',
            };
        },
        computed: {
            ...mapGetters(["permissions", "userInfo"]),
            evaluator() {
                return function(val) {
                    return val.evaluatorName || val.mail || val.mobilePhone || this.$t('crudCommon.暂无')
                }
            },
            riskPoint() {
                return function(item) {
                    return item.levelName + '：' + item.number
                }
            },
            grade() {
                return function(grade, type) {
                    return grade ? grade.find(item => (item.type === type)) : this.$t('crudCommon.暂无')
                }
            },
             option() {
                return tableOption(this, this.isOverHidden)
            },
        },

        watch: {
           
        },
        created() {
            this.getList(this.page)
        },
        mounted() {
        },
        methods: {
        
            changeArray() {
                this.isOverHidden = !this.isOverHidden
                tableOption(this, this.isOverHidden)
            },
           
            // 获取全部用户
            getUserList() {
                getUserList().then(res => {
                    this.evaluatorList = res.data.data
                })
            },
            // 获取问卷记录列表
            getList(page, params) {
                this.listLoading = true;
                return getAssetsAuditByPage(
                    Object.assign(
                        {
                            current: page.currentPage,
                            size: page.pageSize
                        },
                        params
                    )
                ).then(res => {
                    this.recordList = res.data.data.records
                    this.page.total = res.data.data.total;
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                })
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
                this.getList(this.page, this.query);

            },
            currentChange(current) {
                this.page.currentPage = current;
                this.getList(this.page, this.query);
            },
            // 搜索
            handleFilter(param, done) {
                this.query = param;
                this.page.currentPage = 1;
                this.getList(this.page, param);
                done();
            },
            resetChange(){
                this.query = {}
                this.getList(this.page, this.query);
            },
            // 刷新
            handleRefreshChange() {
                this.getList(this.page);
            },
            // 获取风险等级
            getAllAssessScore(row) {
                getAllAssessScore(this.userInfo.tenantId).then(res => {
                    this.$bus.$emit('level', res.data.data.level, row);
                })
            },
            //查看问卷记录按钮
            viewBtn(row) {
                const assUrl = `${estimateUrl}/#/assessment/questionnaireStart/index?infoId=${row.infoId}`
                window.open(assUrl,'_blank')
            },

        
        }
    };
</script>
<style lang="scss" scoped>
#levelCharts {
    width: 380px;
    height: 300px;
    position: absolute;
}
#matterCharts {
    width: 380px;
    height: 300px;
    position: absolute;
}
.questionLevels {
    display: flex;
    justify-content: space-around;
    .questionLevels-item {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        .questionLevels-item-font {
            font-weight: 500;
        }
    }
}

</style>
