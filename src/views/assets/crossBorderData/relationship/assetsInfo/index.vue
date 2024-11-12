<template>
    <div>
        <el-form ref="assetsFormRef" :model="assetsForm" label-width="120px">
            <el-form-item label="位置信息">
                <el-input v-model="assetsForm.positionInfo" @focus="openMap" placeholder="请选择位置信息" />
            </el-form-item>
            <el-form-item label="资产类别">
                <el-select
                    v-model="assetsForm.assetsType"
                    :placeholder="`${$t('crudCommon.请选择')}${$t('.资产类别')}`"
                    filterable>
                    <el-option
                        v-for="d in assetsTypeOptions"
                        :key="d.value"
                        :label="d.label"
                        :value="d.value"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <SelectField
            ref="selectField"
            :projectId="projectId"
            :isAssets="true"
        />
        <el-dialog
            :title="$t('assetsManagement.地图')"
            width="70%"
            :visible.sync="showMap"
            append-to-body
            :fullscreen="isFullscreen"
            >
            <div class="dialog-header" slot="title">
                <span class="dialog-header-title">{{$t('assetsManagement.地图')}}</span>
                <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                    <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
                </div>
            </div>
            <div>{{$t('assetsManagement.当前位置')}} {{ assetsForm.positionInfo }} <br/>
                {{$t('assetsManagement.当前经纬度')}} {{ assetsForm.lng }}, {{ assetsForm.lat }}
            </div>
            <div id="baiduMap" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="saveLatlng">{{$t('assetsManagement.保存')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import  SelectField from "@/views/assets/assetsManagement/selectField";


export default {
    name: "AssetsInfo",
    components: {
        SelectField,
    },
    props: {
        projectId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            isFullscreen: false,
            assetsForm: {
                positionInfo:'',
                lat:'',
                lng:'',
                assetsType:''
            },
            fieldProps: {multiple: true},
            fieldOptions: [],
            assetsTypeOptions: [
                {
                    label: '内部资产',
                    value: '0'
                },{
                    label: '境外内部资产',
                    value: '1'
                },{
                    label: '第三方资产',
                    value: '2'
                },{
                    label: '境外第三方资产',
                    value: '3'
                },
            ],
            showMap:false,
            map: null,
        }
    },
    computed: {
       

    },
    created() {
    },
    methods: {
        openMap() {
            this.showMap = true
            this.$nextTick(() => {
                this.map = new BMapGL.Map("baiduMap");

                const scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
                this.map.addControl(scaleCtrl);
                const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
                this.map.addControl(zoomCtrl);
                const cityCtrl = new BMapGL.CityListControl();  // 添加城市列表控件
                this.map.addControl(cityCtrl);
                this.map.enableScrollWheelZoom(true) // 滚轮放大缩小地图
                this.assetsForm.lng = this.assetsForm.lng ? this.assetsForm.lng : '116.404'
                this.assetsForm.lat = this.assetsForm.lat ? this.assetsForm.lat : '39.915'
                this.assetsForm.positionInfo = this.assetsForm.positionInfo ? this.assetsForm.positionInfo : '北京市'
                const point = new BMapGL.Point(this.assetsForm.lng, this.assetsForm.lat);

                this.map.centerAndZoom(point, 15);
                const marker = new BMapGL.Marker(point);  // 创建标注
                this.map.addOverlay(marker); // 将标注添加到地图中
                const geoc = new BMapGL.Geocoder();
                this.map.addEventListener('click', (e) => {
                    this.assetsForm.lng = e.latlng.lng.toString()
                    this.assetsForm.lat = e.latlng.lat.toString()
                    //创建标注位置
                    const pt = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
                    const marker = new BMapGL.Marker(pt);  // 创建标注
                    this.map.clearOverlays()
                    this.map.addOverlay(marker); // 将标注添加到地图中
                    geoc.getLocation(e.latlng, (rs) => {
                        const addComp = rs.addressComponents;
                        this.assetsForm.hostingLocation = `${addComp.province},${addComp.city}`
                        // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                    })
                })
            })
        },

        saveLatlng() {
            this.showMap = false
        },
       
    }
}
</script>

<style lang="scss" scoped>

</style>