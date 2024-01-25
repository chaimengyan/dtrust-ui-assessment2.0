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
        </div>
        <div class="downContent">
            <div class="leftType">
                <div v-if="typeList.includes('0')" class="typeItem" >{{$t('assetbusin.业务场景')}}</div>
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
            query: {}
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
            this.query.id = val
            this.getMainBodySceneData(val)
        },

        initEcharts(data) {
            var chartDom = document.getElementById('container');
            var myChart = echarts.init(chartDom);
            var option;

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
                    if(e.dataType === 'node') {
                        e.event.target.cursor = 'pointer'
                        e.event.topTarget.cursor = 'pointer'
                    }else if(e.dataType === 'edge') {
                        e.event.target.cursor = 'move'
                    }
                })
                myChart.on('click',(e) => {
                    console.log(e, 'eeeee');
                    this.query[this.queryMap[e.data.depth]] = e.name
                    this.getMainBodySceneDataByCondition(this.query)
                    if(e.data.source) return;
                    let {name} = e;
                    let {links,myData} = _.cloneDeep(data);
                    let options = myChart.getOption();
                    if(cacheName !== name){
                        isSelected = false;
                    }
                    cacheName = name;
                    if(!isSelected){
                        let allSelectedLinks = [];
                        let selectedNodesParent = [];
                        let allSelectedNodes = myData;
                        let selectedNodesChildren = [];
                        let allSelectedNames = []
                        let allParentsNames = [name]
                        let allChildrenNames = []

                        function findParentNodes(nm) {
                            let tempAry = links.filter(item => {
                                return item.target === nm;
                            }).map(item => {
                                allParentsNames.push(item.target)
                                allSelectedNames.push(item.source)
                                return {
                                    name: item.source,
                                    depth: myData.filter((data) => {
                                        return data.name === item.source;
                                    })[0].depth,
                                    itemStyle: {
                                        color: '#00aea8',
                                        opacity: 1
                                    },
                                    label: {
                                        fontSize: 13,
                                        overflow:"break",
                                        position:"bottom",
                                        verticalAlign:"top",
                                        formatter: (e) => {
                                            return e.name.toString().split("").join("\n");
                                        }
                                    }
                                }
                            })
                            if (tempAry.length) {
                                tempAry.forEach(item => {
                                    findParentNodes(item.name)
                                })
                            }
                            selectedNodesParent = selectedNodesParent.concat(tempAry)
                        }

                        function findChildrenNodes(nm){
                            let tempAry = links.filter(item => {
                                return item.source === nm;
                            }).map(item=>{
                                allChildrenNames.push(item.source)
                                allSelectedNames.push(item.target)
                                return {
                                    name: item.target,
                                    depth: myData.filter((data) => {
                                        return data.name === item.target;
                                    })[0].depth,
                                    itemStyle: {
                                        color: '#00aea8',
                                        opacity: 1
                                    },
                                    label: {
                                        fontSize: 13,
                                        overflow:"break",
                                        position:"bottom",
                                        verticalAlign:"top",
                                        formatter: (e) => {
                                            return e.name.toString().split("").join("\n");
                                        }
                                    }
                                }
                            })
                            if (tempAry.length) {
                                tempAry.forEach(item=>{
                                    findChildrenNodes(item.name)
                                })
                            }
                            selectedNodesChildren = selectedNodesChildren.concat(tempAry)
                        }

                        findParentNodes(name)
                        findChildrenNodes(name)
                        allSelectedLinks = links.map(item => {
                            if (allChildrenNames.includes(item.source) || allParentsNames.includes(item.target)) {
                                return {
                                    ...item,
                                    lineStyle: {
                                        color: '#00aea8',
                                        opacity: 0.8
                                    }
                                }
                            } else {
                                return {
                                    ...item,
                                    lineStyle: {
                                        color: 'transparent',
                                        opacity: 0.3
                                    }
                                }
                            }
                        });
                        allSelectedNodes.forEach((item, index) => {
                            if (allSelectedNames.includes(item.name)) {
                                /*如果所选子节点包含*/
                                item.itemStyle = {
                                    color: '#00aea8',
                                    opacity: 1
                                }
                                item.label = {
                                    fontSize: 13,
                                    overflow: "break",
                                    position: "bottom",
                                    verticalAlign: "top",
                                    formatter: (e) => {
                                        return e.name.toString().split("").join("\n");
                                    }
                                };
                            } else if (item.name === name) {
                                item.itemStyle = {
                                    color: '#f36107',
                                    opacity: 1
                                }
                                item.label = {
                                    fontSize: 13,
                                    overflow: "break",
                                    position: "bottom",
                                    verticalAlign: "top",
                                    formatter: (e) => {
                                        return e.name.toString().split("").join("\n");
                                    }
                                };
                            } else {
                                item.itemStyle = {
                                    color: item.itemStyle.color,
                                    opacity: 0.3
                                };
                                item.label = {
                                    show: false
                                };
                            }
                        });
                        options.series[0].data = allSelectedNodes;
                        options.series[0].links = allSelectedLinks;
                        isSelected = true;
                    } else {
                        options.series[0].data = myData;
                        options.series[0].links = links;
                        isSelected = false;
                    }
                    myChart.setOption(options);
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
                const depthList = res.data.data.myData.map(i => (i.depth))
                this.typeList = [...new Set(depthList)]
                this.initEcharts(this.data)
            })
        },
        getMainBodySceneDataByCondition(query) {
            getMainBodySceneDataByCondition(query).then(res => {
                console.log(res.data.data, "??????");
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
