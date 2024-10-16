<template>
    <div>
        <div class="selectDataSubject">
            {{$t('assetbusin.数据主体')}}<el-select v-model="dataSubject" filterable @change="handleChange">
                <el-option
                    v-for="item in dataSubjectList"
                    :key="item.mainBodyId"
                    :label="item.mainBodyName"
                    :value="item.mainBodyId"
                    >
                </el-option>
            </el-select>
            <el-button @click="recoveryAllLinks">全部关系</el-button>
        </div>
        <div class="downContent">
            <div class="leftType">
                <div v-if="typeList.includes('0')" class="typeItem" >{{$t('assetbusin.业务活动')}}</div>
                <div v-if="typeList.includes('1')" class="typeItem" >{{$t('assetbusin.字段类别')}}</div>
                <div v-if="typeList.includes('2')" class="typeItem" >{{$t('assetbusin.字段')}}</div>
                <div v-if="typeList.includes('3')" class="typeItem" >{{$t('assetbusin.收集')}}</div>
                <div v-if="typeList.includes('4')" class="typeItem" >{{$t('assetbusin.存储')}}</div>
                <div v-if="typeList.includes('5')" class="typeItem" >{{$t('assetbusin.使用')}}</div>
                <div v-if="typeList.includes('6')" class="typeItem" >{{$t('assetbusin.传输')}}</div>
                <div v-if="typeList.includes('7')" class="typeItem" >{{$t('assetbusin.存档或删除')}}</div>
            </div>
        <div id="container" style=""></div>
        </div>
        
    </div>
</template>

<script>


import {
  getMainBodySceneData,
  getMainBodySceneDataByCondition
} from "@/api/assetsCharts/assetbusin";
import {
    getMainBodList
} from "@/api/fieldManagement/dataSubjectType";
import * as echarts from 'echarts';
import _ from 'lodash'

const defaultQuery = () => ({
    id: '',
    sceneName: '',
    categoryName: '',
    attributeName: ''
})
var myChart

  export default {
    name: 'FreeEcharts',
    components: {},
    data() {
        return {
            dataSubjectList: [],
            data: [],
            dataSubject: '',
            typeList: [],
            queryMap: {
                '0': 'sceneName',
                '1': 'categoryName',
                '2': 'attributeName',
            },
            historyMap: {},
            query: defaultQuery(),
            allLinks: [],
            selectMyData: [],
        }
    },
    computed: {
        
    },
    created() {
        this.getMainBodList()
    },
    mounted() {
        // this.initEcharts()

    },
    methods: {
        handleChange(val) {
            this.query = defaultQuery()
            this.query.id = val
            this.getMainBodySceneData(val)
        },
        recoveryAllLinks() {
            this.query = defaultQuery()
            this.query.id = this.dataSubject
            this.getMainBodySceneData(this.dataSubject)
        },
        initEcharts(data) {
            var chartDom = document.getElementById('container');
            var option;
            if (myChart) {
                // 取消点击事件
                myChart.off("click")
                myChart.clear()
                myChart.dispose()
            }
            myChart = echarts.init(chartDom)
            option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                // animation: false,
                // label: {
                //     formatter: (params) => {
                //         return params.data.name
                //     }
                // },
                series: [
                    {
                    type: 'sankey',
                    top: '0%',
                    left: '15%',
                    right: '15%',
                    bottom: '10%',
                    height: 500,
                    nodeWidth: 20,
                    emphasis: {
                        disabled:true,
                        focus: 'adjacency'
                    },
                    data: data.myData,
                    links: data.links,
                    orient: 'vertical',
                    // label: {
                    //     show: false,
                    //     position: 'top'
                    // },
                    lineStyle: {
                        color: 'source',
                        // curveness: 0.5
                    }
                    }
                ]
               
                };

                let isSelected = false, cacheName = '';
                myChart.on('mousemove',(e) => {
                    if(e.dataType === 'node' && (['0','1','2'].includes(e.data.depth))) {
                        e.event.target.cursor = 'pointer'
                        e.event.topTarget.cursor = 'pointer'
                    }else if(e.dataType === 'edge') {
                        e.event.target.cursor = 'move'
                    }else {
                        e.event.target.cursor = 'no-drop'
                    }
                })
                myChart.on('click',async (e) => {
                    console.log(e, 'eee', this.allLinks, 'this.allLinks');
                    const options = myChart.getOption()
                    const dataList = options.series[0].data
                    const links = [...this.allLinks]

                    // 获取上一个
                    const pre = parseInt(e.data.depth) - 1
                    const preName = this.historyMap[pre]
                    if (pre >= 0) {
                        const cur = links.find(item => item.source === preName && item.target === e.name)
                        if (!cur) {
                            return;
                        }
                    }

                    // myChart.setOption(options);
                    dataList.forEach(item => {
                        if (item.name === e.name) {
                            item.itemStyle = item.itemStyle.originStyle ? item.itemStyle.originStyle : {
                                color: '#00aea8',
                                originStyle: item.itemStyle
                            }
                        }
                    })
                    
                   

                    this.historyMap[e.data.depth] = e.name;

                    if(!(['0','1','2'].includes(e.data.depth))) {
                        return
                    }
                    
                    this.query[this.queryMap[e.data.depth]] = e.name
                    if (Object.values(this.query).includes('')) {
                        myChart.setOption(options);
                        return
                    }

                    const data = await this.getMainBodySceneDataByCondition(this.query)
                    setNodeStyle.call(this, data)

                  
                    // setNodeStyle.call(this, data[0])

                    // function findNextNode(name) {
                    //     links.find(item => item.source === name)
                    // }

                    function setNodeStyle(nameList) {
                        dataList.forEach(item => {
                            // const isSelectNode = nameList.includes(item.name)
                            // item.itemStyle = item.itemStyle.originStyle ? item.itemStyle.originStyle : item.itemStyle
                            // if (isSelectNode) {
                            //     item.itemStyle = {
                            //         color: '#00aea8',
                            //         originStyle: item.itemStyle
                            //     }
                            // }
                           
                            // if (isSelectNode) return;

                            const listList = findLinks(nameList, links)
                            console.log(listList, links,nameList,'listListlistListlistList');
                            links.forEach((link) => {
                                const is = listList.find(l => l.source === link.source && l.target.includes(link.target))
                                link.lineStyle = is ? {} : {
                                    color: 'rgba(0, 0, 0, .05)',
                                }
                            })
                        })
                        options.series[0].links = links
                        myChart.setOption(options);
                    }

                    // 找出nameList的关联关系
                    function findLinks(nameList, links) {
                        return nameList.map(name => {
                            const res = links.filter(l => l.source === name)
                            return {
                                source: name,
                                target: res.filter(item => nameList.includes(item.target)).map(item => item.target)
                            }
                        })
                    }
                })
                
            option && myChart.setOption(option);
        },


        // 获取全部主体
        getMainBodList() {
            getMainBodList().then(res => {
                this.dataSubjectList = res.data.data
            })
        },

        // 根据数据主体id查询业务场景
        getMainBodySceneData(mainBodyId) {
            getMainBodySceneData(mainBodyId).then(res => {
                this.data = res.data.data
                this.allLinks = res.data.data.links
                const depthList = res.data.data.myData.map(i => (i.depth))
                this.typeList = [...new Set(depthList)]
                this.initEcharts(this.data)
            })
        },
        getMainBodySceneDataByCondition(query) {
            return getMainBodySceneDataByCondition(query).then(res => {
                return res.data.data.myData.map(x => x.name)
                // const nameList = res.data.data.myData.map(x => x.name)
                // const links = this.allLinks.filter(x => {
                //     return nameList.includes(x.source)||nameList.includes(x.target)
                // })
                // this.selectMyData = res.data.data.myData
                // // this.initEcharts({myData: res.data.data.myData, links})
            })
        }
    }
  }
</script>

<style scoped="scoped" lang="scss">
::v-deep .el-select {
  display: inline-block;
}
.selectDataSubject {
    padding-top: 20px;
}
.downContent {
    display: flex;
    margin-top: 20px;
    white-space: nowrap;
    .leftType {
        width: 200px;
        height: 500px;
        margin-left: 20px;
        display:flex; 
        justify-content: space-between;
        flex-direction: column;
        .typeItem {
            color: gray;
        }
    }
}
#container {
    width: 100%;
    height: 100vh;
}
</style>
