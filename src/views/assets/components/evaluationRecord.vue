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
                    <!-- <el-tooltip class="item" effect="dark" :content="$t('evaluationRecord.查看报告')" placement="top">
                        <el-button
                                type="text"
                                icon="el-icon-document"
                                @click="exportViewBtn(scope.row, scope.index)"
                                :disabled="!([3, 4].includes(scope.row.assessStatus))"
                        />
                    </el-tooltip> -->
                </template>
            </avue-crud>
            <div id="levelCharts" style="width: 380px;height: 300px;visibility:hidden;"></div>
            <div id="matterCharts" style="width: 380px;height: 300px;visibility:hidden;"></div>
        </basic-container>
    </div>
</template>

<script>
    import {tableOption} from "@/const/crud/components/evaluationRecord";
    import {mapGetters} from "vuex";
    import {getRisksByPage, 
            getAllAssessScore,
            exportData,
            exportScenePDF,
            exportAssetsPDF} from '@/api/assets/components/evaluationRecord'
    import {getUserList} from "@/api/assets/components/releaseForm";
    import {assessStatusList} from "@/util/enum";
    import * as echarts from 'echarts';
    import { isDev, isTest } from '@/util/env'

    const estimateUrl = !isDev() ? !isTest() ? `https://assess.idatatrust.com` : 'http://116.205.172.167:38080' : `http://${window.location.hostname}:38080` 

    export default {
        name: "evaluationRecord",
        components: { },
        props: {
            queryId: {
                type: Object,
                default: () => {}
            },
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
                // 启动表单
                releaseForm: {},
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
            "releaseForm.typeIds": {
                handler(newVal, oldVal) {
                    this.getQuestionnaireList(this.releaseForm.typeIds)
                },
                deep: true
            },
        },
        created() {
            this.getList(this.page)
        },
        mounted() {
        },
        methods: {
            exportViewBtn(row) {
                this.listLoading = true
                exportData(row.infoId).then(res => {
                    const { level, matter} = res.data.data
                    this.$nextTick(() => {
                        const levelCharts = document.getElementById('levelCharts')
                        this.makeEcharts({  imgId: 'levelImg',
                                            chartDome: levelCharts, 
                                            title: this.$t('evaluationRecord.按风险等级统计'), 
                                            yAxisName: this.$t('analysis.数量'), 
                                            yAxisData: level.map(x => x.number),
                                            xAxisName: this.$t('evaluationRecord.风险等级'), 
                                            xAxisData: level.map(x => x.levelName),
                                            chartDomeColor: ['#2AFFFF', '#FFFF7F', '#FFAA55', '#FF2A00'],
                                            rotate: 0})

                        const matterCharts = document.getElementById('matterCharts')
                        this.makeEcharts({  imgId: 'matterImg',
                                            chartDome: matterCharts, 
                                            title: this.$t('evaluationRecord.按事项统计'), 
                                            yAxisName: this.$t('analysis.数量'), 
                                            yAxisData: matter.map(x => x.number),
                                            xAxisName: this.$t('evaluationRecord.事项'), 
                                            xAxisData: matter.map(x => x.matterName),
                                            chartDomeColor: ['#6383b2', '#6a63b2', '#8b63b2', '#b263ad'],
                                            rotate: 30})
                        })
                        setTimeout(() => {
                           const a = this.blobToFile(this.dataURLtoBlob(this.matterImg), 'matterImg.png') 
                           const b = this.blobToFile(this.dataURLtoBlob(this.levelImg), 'levelImg.png') 
                           const param = new FormData()
                            param.append('files', a)
                            param.append('files', b)
                            const exportAPI =  Object.keys(this.queryId)[0] === 'assetsId' ? exportAssetsPDF : exportScenePDF
                            exportAPI(param, row.infoId).then(res => {
                                const fileName = decodeURIComponent(res.headers['content-disposition']).split('=')[1]
                                let fileData = []
                                fileData.push(res.data)
                                let blobUrl = URL.createObjectURL(new Blob(fileData, {type: res.headers['content-type']}))
                                this.listLoading = false
                                window.open(blobUrl, fileName)
                            })
                            .catch(() => {
                                this.listLoading = false
                            })
                        }, 2000)
                })
                .catch(() => {
                    this.listLoading = false
                })
            },
            // 下载文件
            download(blobUrl, name) {
                const a = document.createElement('a');
                a.style.display = 'none';
                a.download = name;
                a.href = blobUrl;
                a.click();
                // document.body.removeChild(a);
            },
            makeEcharts(data) {
                const chartDome = echarts.init(data.chartDome);
                let option;
                option = {
                    title: {
                        text: data.title,
                        textStyle: {
                            fontSize: 14
                        },
                        left: 150
                    },
                    legend: {
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        // bottom: 20,
                        tooltip: {
                            show: true
                        },
                        textStyle: {
                            width: 50,
                            overflow: 'truncate'
                        }
                    },
                    grid: {
                        right:  80,
                    },
                    yAxis: {
                        type: 'value',
                        name: data.yAxisName,
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                        axisLine: { show: true }
                    },
                    xAxis: {
                        type: 'category',
                        data: data.xAxisData,
                        name: data.xAxisName,
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: data.rotate,
                            formatter: function(params) {
                                let newParamsName = ''
                                let paramsNameNumber = params.length
                                let provideNumber = 6 // 一行显示几个字
                                let rowNumber = Math.ceil(paramsNameNumber / provideNumber)
                                    if (paramsNameNumber > provideNumber) {
                                        for (let p = 0; p < rowNumber; p++) {
                                            let tempStr = ''
                                            let start = p * provideNumber
                                            let end = start + provideNumber
                                            if (p === rowNumber - 1) {
                                                tempStr = params.substring(start, paramsNameNumber)
                                            } else {
                                                tempStr = params.substring(start, end) + '\n'
                                            }
                                            newParamsName += tempStr
                                        }
                                    }else {
                                        newParamsName = params
                                    }
                                return newParamsName
                            }
                        }
                    },
                    series: [
                    {
                        data: data.yAxisData,
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    const colorList = data.chartDomeColor

                                    if (params.dataIndex >= colorList.length) {
                                        params.dataIndex = params.dataIndex - colorList.length
                                    }
                                    return colorList[params.dataIndex]
                                },
                            }
                        }
                    },]
                }
                option && chartDome.setOption(option);
                setTimeout(() => {
                    this[data.imgId] =  chartDome.getDataURL({
                        type: 'png',
                    })
                }, 1000)
                
                // data.chartDome.parentNode.removeChild(data.chartDome)
                
            },
            //1,先将base64转换为blob
            dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            },
            //2,再将blob转换为file
            blobToFile(theBlob, fileName){
                theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
                theBlob.name = fileName;                // 文件名
                return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
            },

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
                return getRisksByPage(
                    Object.assign(
                        {
                            current: page.currentPage,
                            size: page.pageSize
                        },
                        this.queryId,
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
