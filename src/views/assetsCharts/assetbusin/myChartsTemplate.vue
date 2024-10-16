<template>
    <div class="outerContainer">
        <!-- 数据主体 -->
        <div class="leftSubject">
            <div class="title">数据主体</div>
            <template v-for="subject in dataSubjectList">
                <div
                    class="subjectItem"
                    :class="subject.mainBodyId === currentSubjectId ? 'selected' : ''"
                    :key="subject.mainBodyId"
                    @click="clickSubject(subject)">
                    {{subject.mainBodyName}}
                </div>
            </template>
        </div>

        <!-- 业务场景 -->
        <div class="middleScene">
            <div class="title">业务活动</div>
            <template v-for="scene in sceneList">
                <div
                    class="sceneItem"
                    :class="scene.sceneId === currentSceneId ? 'selected' : ''"
                    :key="scene.sceneId"
                    @click="clickScene(scene)">
                    {{scene.sceneName}}
                </div>
            </template>
        </div>

        <!-- 数据处理活动及资产 -->
        <div class="rightActivities">
            <template v-for="item,index in activitiesAndAssetsList">
                <div class="activityItem" :key="index">
                    <div class="activitiesCategory">{{item.activitiesCategory}}</div>
                    <template v-for="asset in item.project">
                        <el-tooltip placement="bottom" effect="light" :key="asset.projectId">
                            <div slot="content">
                                <div v-html="handleActivities(asset.assetsSceneProjectAttributesActivities)"></div>
                            </div>
                            <div class="assetItem" >
                                {{asset.projectName}}
                            </div>
                        </el-tooltip>
                    </template>
                </div>
            </template>
        </div>

    </div>
</template>

<script>
import {
  getAssetsBusinessSceneByMainBodyId,
  getMainBodyBySceneId,
  getAssetsProjectByMainBodyIdAndSceneId
} from "@/api/assetsCharts/assetbusin";
import {
    getMainBodList
} from "@/api/fieldManagement/dataSubjectType";

  export default {
    name: 'MyChartsTemplate',
    components: {},
    data() {
        return {
            dataSubjectList: [],
            sceneList: [],
            activitiesAndAssetsList: [
                {
                    activitiesCategory: '收集'
                },
                {
                    activitiesCategory: '存储'
                },
                {
                    activitiesCategory: '使用'
                },
                {
                    activitiesCategory: '传输'
                },
                {
                    activitiesCategory: '存档/删除'
                }
            ],
            
            // 当前数据主体id
            currentSubjectId: '',
            // 当前业务场景id
            currentSceneId: '',
        }
    },
    computed: {
        handleActivities() {
            return val => {
                const arr = val.map(x => { 
                    const activitiesName = x.activitiesName
                    const activitiesValue = JSON.parse(x.activitiesJson).answers
                    if(x.activitiesType === 'radio') {// 单选
                        const answer = activitiesValue.find(b => b.value === x.activitiesValue*1).label
                        return `${activitiesName}：${answer}`
                    } else if(x.activitiesType === 'checkbox') {//多选
                        const answer = activitiesValue.filter(b => x.activitiesValue.includes(b.value+'')).map(c => c.label).join('|')
                        return `${activitiesName}：${answer}`
                    } else {
                        return `${activitiesName}：${x.activitiesValue}`
                    }
                })
                return arr.join('<br />')
            }
        }
    },
    created() {
        this.getMainBodList()
    },
    methods: {
       
        // 点击数据主体
        clickSubject(subject) {
            this.currentSceneId = ''
            if(this.currentSubjectId !== subject.mainBodyId) this.activitiesAndAssetsList = [
                {
                    activitiesCategory: '收集'
                },
                {
                    activitiesCategory: '存储'
                },
                {
                    activitiesCategory: '使用'
                },
                {
                    activitiesCategory: '传输'
                },
                {
                    activitiesCategory: '存档/删除'
                }
            ],
            this.currentSubjectId = subject.mainBodyId
            this.getAssetsBusinessSceneByMainBodyId(subject.mainBodyId)
        },

        // 点击业务场景
        clickScene(scene) {
            this.currentSceneId = scene.sceneId
            this.getAssetsProjectByMainBodyIdAndSceneId(this.currentSubjectId, scene.sceneId)
        },

        // 获取全部主体
        getMainBodList() {
            getMainBodList().then(res => {
                this.dataSubjectList = res.data.data
            })
        },

        // 根据数据主体id查询业务场景
        getAssetsBusinessSceneByMainBodyId(mainBodyId) {
            getAssetsBusinessSceneByMainBodyId(mainBodyId).then(res => {
                this.sceneList = res.data.data
            })
        },

        // 根据业务场景id获取主体
        getMainBodyBySceneId(sceneId) {
            getMainBodyBySceneId(sceneId).then(res => {
            })
        },

        // 根据数据主体id&业务场景id查询资产
        getAssetsProjectByMainBodyIdAndSceneId(mainBodyId, sceneId) {
            getAssetsProjectByMainBodyIdAndSceneId(mainBodyId, sceneId).then(res => {
                this.activitiesAndAssetsList = res.data.data

            })
        },
    }
  }
</script>

<style scoped="scoped" lang="scss">
    .outerContainer {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: space-around;
        background-color: aliceblue;
        .title {
            text-align: center;
            margin: 20px;
        }
        .selected {
            transform:scale(1.1);
            background-color: #cbe1f4 !important;
            opacity: 0.8;
        }
        .leftSubject {
            width: 200px;
            height: 100%;
            .subjectItem {
                text-align: center;
                padding: 30px 10px;
                margin: 30px;
                background-color: rgb(97, 137, 172);
                border-radius: 4%;
                font-family: cursive;
            }
            .subjectItem:hover {
                cursor: pointer;
                transform:scale(1.1);
                transition: all 0.3s;
            }
            .subjectItem:active {
                background-color: rgb(208, 223, 236);
            }
        }
        .middleScene {
            width: 200px;
            height: 100%;
            .sceneItem {
                text-align: center;
                padding: 30px 10px;
                margin: 30px;
                background-color: #9bcbf4;
                border-radius: 30%;
                font-family: cursive;
            }
            .sceneItem:hover {
                cursor: pointer;
                transform:scale(1.1);
                transition: all 0.3s;
            }
            .sceneItem:active {
                background-color: rgb(208, 223, 236);
            }
        }
        .rightActivities {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: space-around;
            .activityItem {
                text-align: center;
                margin: 20px;
                
                .activitiesCategory {
                    text-align: center;
                }
                .assetItem {
                    text-align: center;
                    padding: 30px;
                    margin: 30px;
                    background-color: rgb(176, 206, 233);
                    border-radius: 50%;
                    font-family: cursive;
                }
                .assetItem:hover {
                    cursor: pointer;
                    transform:scale(1.1);
                    transition: all 0.3s;
                }
                .assetItem:active {
                    background-color: rgb(208, 223, 236);
                }
            }
        }
    }
</style>
