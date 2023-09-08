<template>
    <basic-container>
        <avue-form ref="findAssetForm" :disabled="!!findStatus" v-model="findAssetForm" :option="findAssetFormOption" @submit="submitBtn">
            <!-- 经纬度 -->
            <template slot="hostingLocation">
                <avue-input v-model="findAssetForm.hostingLocation" @focus="openMap" :placeholder="`${$t('crudCommon.请选择')}${$t('assetsManagement.托管位置')}`"  />
            </template>
        </avue-form>
        <el-dialog
            :title="$t('assetsManagement.地图')"
            width="70%"
            :visible.sync="showMap"
            append-to-body
            >
            <div>{{$t('assetsManagement.当前位置')}} {{ findAssetForm.hostingLocation }} <br/>
                {{$t('assetsManagement.当前经纬度')}} {{ findAssetForm.lng }}, {{ findAssetForm.lat }} 
            </div>
            <div id="baiduMap" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="saveLatlng">{{$t('assetsManagement.保存')}}</el-button>
            </div>
            </el-dialog>
    </basic-container>
</template>

<script>
import { tableOption } from "@/const/crud/assets/assetsManagement";
export default {
    name: "FindAssetForm",
    components: {
    },
    props: {
      findStatus: {
          type: Number,
          default: 0
      },
    },
    data() {
        return {
            treeDeptData: [],
            defaultProps: {
                label: 'name',
                value: 'id'
            },
            // 发现资产表单
            findAssetForm: {},
            showMap:false,
            map: null,
        }
    },
    computed: {
        findAssetFormOption() {
            return tableOption(this, this.$route.query.tenantId, false, true)
        },
    },
    created() {
    },
    methods: {
         openMap() {
            this.showMap = true
            if (this.map) return;
            this.$nextTick(() => {
                this.map = new BMapGL.Map("baiduMap");

                const scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
                this.map.addControl(scaleCtrl);
                const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
                this.map.addControl(zoomCtrl);
                const cityCtrl = new BMapGL.CityListControl();  // 添加城市列表控件
                this.map.addControl(cityCtrl);
                this.map.enableScrollWheelZoom(true) // 滚轮放大缩小地图

                const point = new BMapGL.Point(116.404, 39.915);
                this.map.centerAndZoom(point, 15); 
                const geoc = new BMapGL.Geocoder();
                this.map.addEventListener('click', (e) => {
                this.findAssetForm.lng = e.latlng.lng
                this.findAssetForm.lat = e.latlng.lat
                //创建标注位置
                const pt = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
                const marker = new BMapGL.Marker(pt);  // 创建标注
                this.map.clearOverlays()
                this.map.addOverlay(marker); // 将标注添加到地图中
                geoc.getLocation(e.latlng, (rs) => {
                    const addComp = rs.addressComponents;
                    this.findAssetForm.hostingLocation = `${addComp.province},${addComp.city}`
                    // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                })
                })
            })
            },
        submitBtn(form, done) {
            if(Array.isArray(form.organizationalSecurityMeasures) || typeof form.organizationalSecurityMeasures === 'object') {
                form.organizationalSecurityMeasures = form.organizationalSecurityMeasures.join()
            }
            this.$emit('commitJob',form, done)
        },
        saveLatlng() {
            this.showMap = false
        },
    }
}
</script>

<style lang="scss" scoped>
#baiduMap {
  height: 350px;
}
</style>