<template>
    <basic-container>
        <div class="analysis-box">
            <div
                class="drag-item"
                v-for="item in myArray"
                :id="item.id"
                :key="item.id"
                draggable="true"
                @dragstart="handleDragStart($event, item)"
                @dragover.prevent="handleDragOver($event, item)"
                @dragenter="handleDragEnter($event, item)"
                @dragend="handleDragEnd($event, item)">
                <div v-if="item.id === 'assetsLevelByMonth'">
                    <el-form style="display: flex;" :inline="true" :model="searchProjectForm" class="demo-form-inline">
                        <el-form-item >
                            <el-tooltip :content="$t('analysis.最近几个月')" placement="bottom" effect="light">
                                <el-input-number
                                    @keydown.native.delete.capture.stop.prevent
                                    v-model="searchProjectForm.monthNum"
                                    :min="1"
                                    :max="36"
                                    controls-position="right"
                                    size="mini"
                                    />
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label-width="30px">
                            <el-tooltip :content="$t('analysis.统计方式')" placement="bottom" effect="light">
                                <el-select v-model="searchProjectForm.statisticalMethod" size="mini">
                                    <el-option
                                        v-for="item in statisticalMethodOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        />
                                </el-select>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchProjectBtn" size="mini">{{$t('analysis.查询')}}</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="width:100%;height:250px" id="getAssetsLevelByMonth" />
                </div>

                <div v-if="item.id === 'businessScenarioLevelByMonth'">
                    <el-form style="display: flex;" :inline="true" :model="searchSceneForm" class="demo-form-inline">
                        <el-form-item>
                            <el-tooltip :content="$t('analysis.最近几个月')" placement="bottom" effect="light">
                                <el-input-number
                                    @keydown.native.delete.capture.stop.prevent
                                    v-model="searchSceneForm.monthNum"
                                    :min="1"
                                    :max="36"
                                    controls-position="right"
                                    size="mini" />
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item>
                            <el-tooltip :content="$t('analysis.统计方式')" placement="bottom" effect="light">
                                <el-select v-model="searchSceneForm.statisticalMethod" size="mini">
                                    <el-option
                                        v-for="item in statisticalMethodOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        />
                                </el-select>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSceneBtn" size="mini">{{$t('analysis.查询')}}</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="width:100%;height:250px" id="getBusinessScenarioLevelByMonth" />
                </div>

                <div v-if="item.id === 'recentlyAssetsAndScene'">
                    <el-form style="display: flex;" :inline="true" :model="assetsAndSceneForm" class="demo-form-inline">
                        <el-form-item>
                            <el-tooltip :content="$t('analysis.最近几个月')" placement="bottom" effect="light">
                                <el-input-number
                                    @keydown.native.delete.capture.stop.prevent
                                    v-model="assetsAndSceneForm.months"
                                    :min="1"
                                    :max="36"
                                    controls-position="right"
                                    size="mini" />
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchAssetsAndSceneFormBtn" size="mini">{{$t('analysis.查询')}}</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="width:100%;height:250px" id="getRecentlyAssetsAndScene" />
                </div>

                <div v-if="item.id === 'projectOrderByDepartment'">
                    <el-form style="display: flex;" :inline="true" :model="assetsAndSceneForm" class="demo-form-inline">
                        <el-form-item>
                            <el-tooltip :content="$t('analysis.统计方式')" placement="bottom" effect="light">
                                <el-select v-model="searchProjectByDepForm.statisticalMethod" size="mini">
                                    <el-option
                                        v-for="item in statisticalMethodOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        />
                                </el-select>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchProjectByDepFormBtn" size="mini">{{$t('analysis.查询')}}</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="width:100%;height:250px" id="getProjectOrderByDepartment" />
                </div>

                <div v-if="item.id === 'sceneOrderByDepartment'">
                    <el-form style="display: flex;" :inline="true" :model="assetsAndSceneForm" class="demo-form-inline">
                        <el-form-item>
                             <el-tooltip :content="$t('analysis.统计方式')" placement="bottom" effect="light">
                                <el-select v-model="searchSceneByDepForm.statisticalMethod" size="mini">
                                    <el-option
                                        v-for="item in statisticalMethodOption"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        />
                                </el-select>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSceneByDepFormBtn" size="mini">{{$t('analysis.查询')}}</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="width:100%;height:250px" id="getSceneOrderByDepartment" />
                </div>

            </div>
        </div>
    </basic-container>
</template>

<script>
import * as echarts from 'echarts';
import {getProjectOrderByDepartment,
        getAssetsLevelByMonth, 
        getProjectOrderByType,
        getSceneOrderByDepartment,
        getBusinessScenarioLevelByMonth,
        getRecentlyAssetsAndScene
        } from '@/api/analysis'
import { mapGetters } from 'vuex'

export default {
    name: "Analysis",
    components: {
    },
    data() {
        return {
            myArray: [
                {id: 'assetsLevelByMonth'},
                {id: 'businessScenarioLevelByMonth'},
                {id: 'recentlyAssetsAndScene'},
                {id: 'projectOrderByDepartment'},
                {id: 'sceneOrderByDepartment'},
                {id: 'getProjectOrderByType'},
            ],
            ending: null,
            dragging: null,
            searchProjectForm: {
               monthNum: 6,
               statisticalMethod: 'average',
            },
            searchSceneForm: {
               monthNum: 6,
               statisticalMethod: 'average',
            },
            assetsAndSceneForm: {
               months: 3
            },
            searchProjectByDepForm: {
               statisticalMethod: 'average',
            },
            searchSceneByDepForm: {
               statisticalMethod: 'average',
            },
            statisticalMethodOption: [
               {
                   label: this.$t('analysis.平均分'),
                   value: 'average',
               },{
                   label: this.$t('analysis.最高分'),
                   value: 'max',
               },{
                   label: this.$t('analysis.最近评估'),
                   value: 'recent',
               },
            ],
            chartList: [],
        }
    },
    computed: {
        ...mapGetters(["keyCollapse"])
    },
    watch: {
        "keyCollapse": {
            handler(n, o) {
                this.chartList.forEach(i => {
                    i.dispose()
                })
                this.init()
            }
        }
    },
    created() {
        this.init()
    },
    mounted() {
        
    },
    methods: {
        init() {
            this.getProjectOrderByDepartment(this.searchProjectByDepForm)
            this.getAssetsLevelByMonth(this.searchProjectForm)
            this.getProjectOrderByType()
            this.getSceneOrderByDepartment(this.searchSceneByDepForm)
            this.getBusinessScenarioLevelByMonth(this.searchSceneForm)
            this.getRecentlyAssetsAndScene(this.assetsAndSceneForm)
        },
        handleDragStart(e, item) {
            this.dragging = item;
        },
        handleDragEnd(e, item) {
            if (this.ending.id === this.dragging.id) return
            let newItems = [...this.myArray];
            const src = newItems.indexOf(this.dragging);
            const dst = newItems.indexOf(this.ending);
            newItems.splice(src, 1, ...newItems.splice(dst, 1, newItems[src]));
        
            this.myArray = newItems;
            this.$nextTick(() => {
                this.dragging = null;
                this.ending = null;
            });
        },
        handleDragOver(e) {
            // 首先把div变成可以放置的元素，即重写dragenter/dragover
            // 在dragenter中针对放置目标来设置
            e.dataTransfer.dropEffect = "move";
        },
        handleDragEnter(e, item) {
            // 为需要移动的元素设置dragstart事件
            e.dataTransfer.effectAllowed = "move";
            this.ending = item;
        },

        // 条件查询资产分布(部门)（柱状图）
        searchProjectByDepFormBtn() {
            this.getProjectOrderByDepartment(this.searchProjectByDepForm)
        },

        // 资产分布(部门)（柱状图）
        getProjectOrderByDepartment(query) {
            getProjectOrderByDepartment(query).then(res => {
                const projectData =  res.data.data
                const chartDom = document.getElementById('getProjectOrderByDepartment');
                const chart = echarts.init(chartDom);
                this.chartList.push(chart)
                let option;
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    title: {
                        text: this.$t('analysis.资产分布按机构'),
                        textStyle: {
                            fontSize: 14
                        },
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
                        top: 70,
                        right: 90,
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        name: this.$t('analysis.数量'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                        axisLine: { show: true }
                    },
                    xAxis: {
                        type: 'category',
                        data: projectData.map(p => p.deptName),
                        name: this.$t('analysis.部门'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                    },
                    series: [
                        {
                            name: this.$t('analysis.低风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: projectData.map(p => p.low),
                            itemStyle: {
                                color: '#2AFFFF',
                            },
                        },
                        {
                            name: this.$t('analysis.中风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: projectData.map(p => (p.middle)),
                            itemStyle: {
                                color: '#FFFF7F',
                            },
                        },
                        {
                            name: this.$t('analysis.高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: projectData.map(p => (p.high)),
                            itemStyle: {
                                color: '#FFAA55',
                            },
                        },
                        {
                            name: this.$t('analysis.极高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: projectData.map(p => (p.veryHigh)),
                            itemStyle: {
                                color: '#FF2A00',
                            },
                        },
                        {
                            name: this.$t('analysis.未评估'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: projectData.map(p => (p.notEvaluated)),
                            itemStyle: {
                                color: '#cfc6d3',
                            },
                        }
                    ]
                    };
                option && chart.setOption(option);
            })
        },
        
        // 条件查询资产风险
        searchProjectBtn() {
            this.getAssetsLevelByMonth(this.searchProjectForm)
        },
       
        // 获取最近几个月的资产风险（柱状图）
        getAssetsLevelByMonth(query) {
            getAssetsLevelByMonth(query).then(res => {
                const chartData = res.data.data
                const chartDom = document.getElementById('getAssetsLevelByMonth');
                const myChart = echarts.init(chartDom);
                this.chartList.push(myChart)
                let option;
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    title: {
                        text: this.$t('analysis.获取最近几个月的资产风险'),
                        textStyle: {
                            fontSize: 14
                        },
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
                        top: 70,
                        right: 90,
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        name: this.$t('analysis.数量'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                        axisLine: { show: true }
                    },
                    xAxis: {
                        type: 'category',
                        data: chartData.month,
                        name: this.$t('analysis.月份'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                    },
                    series: [
                        {
                            name: this.$t('analysis.低风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.low)),
                            itemStyle: {
                                color: '#2AFFFF',
                            },
                        },
                        {
                            name: this.$t('analysis.中风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.middle)),
                            itemStyle: {
                                color: '#FFFF7F',
                            },
                        },
                        {
                            name: this.$t('analysis.高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.high)),
                            itemStyle: {
                                color: '#FFAA55',
                            },
                        },
                        {
                            name: this.$t('analysis.极高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.veryHigh)),
                            itemStyle: {
                                color: '#FF2A00',
                            },
                        },
                        // {
                        //     name: '未评估',
                        //     type: 'bar',
                        //     stack: 'total',
                        //     label: {
                        //         show: true
                        //     },
                        //     emphasis: {
                        //         focus: 'series'
                        //     },
                        //     data: chartData.infos.map(x => (x.notEvaluated)),
                        //     itemStyle: {
                        //         color: '#cfc6d3',
                        //     },
                        // }
                    ]
                    };

                    option && myChart.setOption(option);

            })
        },

        // 资产分布(按个人信息敏感等级)（饼图）
        getProjectOrderByType() {
            getProjectOrderByType().then(res => {
                const proData = res.data.data
                const chartDom = document.getElementById('getProjectOrderByType');
                const myChart = echarts.init(chartDom);
                this.chartList.push(myChart)
                let option;

                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c} ({d}%)'
                    },
                    color:['#44a0ff', '#e8ab52', '#9ccb6e', '#f77471', '#fde2e2','#44a0ff', '#e8ab52', '#9ccb6e', '#f77471', '#fde2e2'],
                    title: {
                        text: this.$t('analysis.资产分布按个人信息敏感等级'),
                        textStyle: {
                            fontSize: 14
                        },
                    },
                    // legend: {
                    //     type: 'scroll',
                    //     orient: 'vertical',
                    //     right: 10,
                    //     top: 20,
                    //     bottom: 20,
                    //     tooltip: {
                    //         show: true
                    //     },
                    //     textStyle: {
                    //         width: 50,
                    //         overflow: 'truncate'
                    //     },
                    //     data: proData
                    // },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],
                            center: ['43%','55%'],
                            label: {
                                position: 'inner',
                                fontSize: 14
                            },
                            labelLine: {
                                show: false
                            },
                            data: []
                        },
                        {
                            name: '',
                            type: 'pie',
                            radius: ['45%', '60%'],
                            center: ['43%','55%'],
                            labelLine: {
                                length: 30
                            },
                            
                            data: proData
                    }
                ]
                };
                myChart.on('click', function (params) {
                    option.series[0].data = option.series[1].data.find(x => (x.id === params.data.id)).ratio
                    option && myChart.setOption(option);
                });

                option && myChart.setOption(option);
            })
        },

        // 条件查询业务场景分布(部门)（柱状图）
        searchSceneByDepFormBtn() {
            this.getSceneOrderByDepartment(this.searchSceneByDepForm)
        },
     
        // 业务场景分布(部门)（柱状图）
        getSceneOrderByDepartment(query) {
            getSceneOrderByDepartment(query).then(res => {
                const sceneData =  res.data.data
                const chartDom = document.getElementById('getSceneOrderByDepartment');
                const chart = echarts.init(chartDom);
                this.chartList.push(chart)
                let option;

                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                     title: {
                        text: this.$t('analysis.业务场景分布按机构'),
                        textStyle: {
                            fontSize: 14
                        },
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
                        top: 70,
                        right: 90,
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        name: this.$t('analysis.数量'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                        axisLine: { show: true }
                    },
                    xAxis: {
                        type: 'category',
                        data: sceneData.map(s => s.deptName),
                        name: this.$t('analysis.部门'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                    },
                    series: [
                        {
                            name: this.$t('analysis.低风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: sceneData.map(s => s.low),
                            itemStyle: {
                                color: '#2AFFFF',
                            },
                        },
                        {
                            name: this.$t('analysis.中风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: sceneData.map(s => (s.middle)),
                            itemStyle: {
                                color: '#FFFF7F',
                            },
                        },
                        {
                            name: this.$t('analysis.高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: sceneData.map(s => (s.high)),
                            itemStyle: {
                                color: '#FFAA55',
                            },
                        },
                        {
                            name: this.$t('analysis.极高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: sceneData.map(s => (s.veryHigh)),
                            itemStyle: {
                                color: '#FF2A00',
                            },
                        },
                        {
                            name: this.$t('analysis.未评估'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: sceneData.map(s => (s.notEvaluated)),
                            itemStyle: {
                                color: '#cfc6d3',
                            },
                        }
                    ]
                    };
                option && chart.setOption(option);
            })
        },

        // 条件查询业务场景风险
        searchSceneBtn() {
            this.getBusinessScenarioLevelByMonth(this.searchSceneForm)
        },
        
        // 获取最近几个月的业务场景风险（柱状图）
        getBusinessScenarioLevelByMonth(query) {
            getBusinessScenarioLevelByMonth(query).then(res => {
                const chartData = res.data.data
                const chartDom = document.getElementById('getBusinessScenarioLevelByMonth');
                const myChart = echarts.init(chartDom);
                this.chartList.push(myChart)
                let option;
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    title: {
                        text: this.$t('analysis.获取最近几个月的业务场景风险'),
                        textStyle: {
                            fontSize: 14
                        },
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
                        top: 70,
                        right: 90,
                        bottom: '3%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        name: this.$t('analysis.数量'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                        axisLine: { show: true }
                    },
                    xAxis: {
                        type: 'category',
                        data: chartData.month,
                        name: this.$t('analysis.月份'),
                        nameTextStyle: {
                            color: '#1481f2',
                            fontWeight: 'bold',
                        },
                    },
                    series: [
                        {
                            name: this.$t('analysis.低风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.low)),
                            itemStyle: {
                                color: '#2AFFFF',
                            },
                        },
                        {
                            name: this.$t('analysis.中风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.middle)),
                            itemStyle: {
                                color: '#FFFF7F',
                            },
                        },
                        {
                            name: this.$t('analysis.高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.high)),
                            itemStyle: {
                                color: '#FFAA55',
                            },
                        },
                        {
                            name: this.$t('analysis.极高风险'),
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: chartData.infos.map(x => (x.veryHigh)),
                            itemStyle: {
                                color: '#FF2A00',
                            },
                        },
                        // {
                        //     name: '未评估',
                        //     type: 'bar',
                        //     stack: 'total',
                        //     label: {
                        //         show: true
                        //     },
                        //     emphasis: {
                        //         focus: 'series'
                        //     },
                        //     data: chartData.infos.map(x => (x.notEvaluated)),
                        //     itemStyle: {
                        //         color: '#cfc6d3',
                        //     },
                        // }
                    ]
                    };

                    option && myChart.setOption(option);
            })
        },

        // 条件查询未评估的资产业务场景
        searchAssetsAndSceneFormBtn() {
            this.getRecentlyAssetsAndScene(this.assetsAndSceneForm)
        },

        // 获取最近几个月未评估的资产业务场景（双柱状图）
        getRecentlyAssetsAndScene(query) {
            getRecentlyAssetsAndScene(query).then(res => {
                const data =  res.data.data
                const chartDom = document.getElementById('getRecentlyAssetsAndScene');
                const chart = echarts.init(chartDom);
                this.chartList.push(chart)
                let option;

                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    title: {
                        text: this.$t('analysis.获取最近几个月未评估的资产或业务场景'),
                        textStyle: {
                            fontSize: 14
                        },
                    },
                    grid: [
                        {
                            bottom: 10,
                            width: '35%',
                            right: '60%',
                            containLabel: true
                        },
                        {
                            bottom: 10,
                            width: '35%',
                            left: '52%',
                            containLabel: true
                        }
                    ],
                    xAxis:[
                        {
                            gridIndex: 0,
                            type: 'category',
                            data: Object.keys(data.assets),
                            name: this.$t('analysis.月份'),
                            nameLocation: 'end',
                            nameTextStyle: {
                                color: '#1481f2',
                                fontWeight: 'bold',
                            },
                        },
                        {
                            gridIndex: 1,
                            type: 'category',
                            data: Object.keys(data.scene),
                            name: this.$t('analysis.月份'),
                            nameLocation: 'end',
                            nameTextStyle: {
                                color: '#1481f2',
                                fontWeight: 'bold',
                            },
                        },
                    ], 
                    yAxis: [
                        {
                            gridIndex: 0,
                            type: 'value',
                            name: this.$t('analysis.资产数量'),
                            minInterval: 1,
                            nameTextStyle: {
                                color: '#1481f2',
                                fontWeight: 'bold',
                            },
                            axisLine: { show: true }
                        },
                        {
                            type: 'value',
                            gridIndex: 1,
                            name: this.$t('analysis.业务场景数量'),
                            minInterval: 1,
                            nameTextStyle: {
                                color: '#1481f2',
                                fontWeight: 'bold',
                            },
                            axisLine: { show: true }
                        },
                    ],
                    series: [
                        {
                            data: Object.values(data.assets),
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        var colorList = [
                                        '#6383b2', '#6a63b2', '#8b63b2', '#b263ad'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                }
                            }
                        },
                        {
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: Object.values(data.scene),
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        var colorList = [
                                        '#6383b2', '#6a63b2', '#8b63b2', '#b263ad'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                }
                            }
                        }
                    ]
                };
                option && chart.setOption(option);
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.analysis-box {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    flex-wrap: wrap;
    .drag-item {
        width: 30%;
        height:300px;
        border-radius: 6px;
        background-color: aliceblue;
        padding: 10px;
        margin: 10px 0px 10px 0px;
        box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.2);
    }
}
</style>
