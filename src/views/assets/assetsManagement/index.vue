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
        @row-update="update"
        @row-save="create"
        @selection-change="selectionChange"
        :before-open="handleOpenBefore"
        :data="list"
        @cell-click="cellClick"
      >
      <template slot="menuRight" slot-scope="{size}">
        <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
      </template>
        <!-- 资产名称 -->
        <template slot="projectName" slot-scope="scope">
            <span class="projectName">
                {{scope.row.projectName}}
            </span>
        </template>
        <!-- 资产版本号 -->
        <template slot="version" slot-scope="scope">
            <span class="projectName">
                {{scope.row.version}}
            </span>
        </template>
        <template slot="sceneIds" slot-scope="scope">
           {{ scope.row.sceneNames ? scope.row.sceneNames.toString() : $t('crudCommon.暂无') }}
        </template>

        <!-- 经纬度 -->
        <template slot="hostingLocationForm">
          <avue-input v-model="form.hostingLocation" @focus="openMap" :placeholder="`${$t('crudCommon.请选择')}${$t('assetsManagement.托管位置')}`"  />
        </template>
        <template slot="versionForm">
          <avue-input-number v-model="form.version" :min="curVersion"></avue-input-number>
        </template>
        <template slot="menuLeft">
          <el-button
            v-if="permissions.assets_assetsManagement_add"
            class="filter-item"
            @click="$refs.crud.rowAdd()"
            type="primary"
            icon="el-icon-plus"
            >{{$t('crudCommon.添加')}}
          </el-button>
          <el-button
            v-if="permissions.assets_assetsManagement_find"
            class="filter-item"
            @click="findAsset"
            type="primary"
            icon="el-icon-position"
            >{{$t('assetsManagement.发现资产')}}
          </el-button>
          <el-button
            v-if="permissions.assets_assetsManagement_export"
            class="filter-item"
            @click="exportMode"
            type="primary"
            icon="el-icon-upload"
            v-loading.fullscreen.lock="fullscreenLoading"
            >{{$t('crudCommon.导出模板')}}
          </el-button>
          <el-button
            v-if="permissions.assets_assetsManagement_import"
            class="filter-item"            
            @click="importAsset"
            type="primary"
            icon="el-icon-document-add"
            >{{$t('crudCommon.导入')}}
          </el-button>

          <el-button
            v-if="permissions.assets_assetsManagement_batchDel"
            type="primary"
            plain
            icon="el-icon-delete"
            @click="deleteBtn(false)"
            >{{$t('crudCommon.批量删除')}}
          </el-button>
          <el-button
            v-if="permissions.assets_assetsManagement_batchDel"
            type="primary"
            plain
            icon="el-icon-document-copy"
            @click="copyBtn(false)"
            >{{$t('crudCommon.批量复制')}}
          </el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
            <el-button
              v-if="permissions.assets_assetsManagement_edit"
              :disabled="!handleDataPermissions('update', scope.row)"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('assetsManagement.关联')" placement="top">
            <el-button
              v-if="permissions.assets_assetsManagement_relation"
              :disabled="!handleDataPermissions('update', scope.row)"
              type="text"
              icon="el-icon-link"
              @click="relationBtn(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('assetsManagement.历史记录')" placement="top">
            <el-button
              v-if="permissions.assets_assetsManagement_history"
              type="text"
              icon="btn-icon-lishijilu"
              @click="viewHistory(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('assetsManagement.评估')" placement="top">
            <el-button
              v-if="permissions.assets_assetsManagement_assessment"
              :disabled="!handleDataPermissions('update', scope.row)"
              class="filter-item"
              @click="openAssessment(scope.row)"
              type="text"
              icon="el-icon-message"
              >
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
            <el-button
              v-if="permissions.assets_assetsManagement_del"
              :disabled="!handleDataPermissions('delete', scope.row)"
              type="text"
              icon="el-icon-delete"
              @click="deleteBtn(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.复制')" placement="top">
            <el-button
              v-if="permissions.assets_assetsManagement_del"
              :disabled="!handleDataPermissions('update', scope.row)"
              type="text"
              icon="el-icon-document-copy"
              @click="copyBtn(scope.row, scope.index)"
              />
          </el-tooltip>
        </template>
        <template slot="sceneIdsForm">
          <el-select v-model="form.sceneIds" multiple filterable  placeholder="请选择所属业务场景">
            <el-option
              v-for="item in sceneOptions"
              :key="item.sceneId"
              :label="item.sceneName"
              :props="sceneProps"
              :value="item.sceneId">
            </el-option>
          </el-select>
        </template>
      </avue-crud>
    </basic-container>
    <AssetsRelationField
      ref="assetsRelationFieldRef"
      :isAssets="true"
      @saveSuccess="FieldRelationSaveSuccess"
    />
    <el-dialog
      :title="$t('assetsManagement.查看资产详情')"
      width="70%"
      v-if="detailsDialog"
      :visible.sync="detailsDialog"
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('assetsManagement.查看资产详情')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
      <Details
        ref="details"
        :projectId="projectId"
        :viewColumn="viewColumn"
        :rowData="rowData"
        :fieldList="fieldList"
        />
    </el-dialog>
    <el-dialog
      :title="$t('assetsManagement.启动评估')"
      width="35%"
      v-if="assessmentDialog"
      :visible.sync="assessmentDialog"
      :close-on-click-modal="false"
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('assetsManagement.启动评估')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
      <ReleaseForm
        ref="releaseForm"
          :typeIds="2"
          :evaluationItem="{assetsId: projectId}"
          @closeAssessmentDialog="closeAssessmentDialog"
        />
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="assessmentFormSubmit">{{$t('assetsManagement.保存')}}</el-button>
          <el-button icon="el-icon-circle-close" @click="assessmentDialog = false">{{$t('assetsManagement.取消')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('assetsManagement.发现资产')"
      width="70%"
      v-if="findDialog"
      :visible.sync="findDialog"
      :close-on-click-modal="false"
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('assetsManagement.发现资产')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
      <FindStart
        ref="findStart"
        :findType="1"
        @saveSuccess="findAsssetSaveSuccess"
      />
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="findFormSave">{{$t('assetsManagement.保存')}}</el-button>
          <el-button icon="el-icon-circle-close" @click="findDialog = false">{{$t('assetsManagement.取消')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('crudCommon.导入')"
      width="35%"
      :visible.sync="importDialog"
      append-to-body
      :close-on-click-modal="false"
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('crudCommon.导入')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
        <el-upload
            class="upload-demo"
            action=""
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            accept=".xls,.xlsx"
            :limit="1"
            v-loading.fullscreen.lock="fullscreenLoading"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">{{$t('crudCommon.点击上传')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('crudCommon.只能上传xls和xlsx文件且不超过500kb')}}</div>
        </el-upload>
    </el-dialog>
    <el-dialog
      v-if="historyDialog"
      :title="$t('assetsManagement.历史记录')"
      width="70%"
      :visible.sync="historyDialog"
      append-to-body
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('assetsManagement.历史记录')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
        <History
          :projectId="projectId"
        />
    </el-dialog>
    <el-dialog
      v-if="historyVersionDialog"
      :title="$t('assetsManagement.历史版本号记录')"
      width="70%"
      :visible.sync="historyVersionDialog"
      append-to-body
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('assetsManagement.历史版本号记录')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
        <HistoryVersion
          :projectId="projectId"
        />
    </el-dialog>
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
      <div>{{$t('assetsManagement.当前位置')}} {{ form.hostingLocation }} <br/>
           {{$t('assetsManagement.当前经纬度')}} {{ form.lng }}, {{ form.lat }}
      </div>
      <div id="baiduMap" />
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="saveLatlng">{{$t('assetsManagement.保存')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  addObj,
  delObj,
  getAssetsProjectByPage,
  getAssetsProjectAttributesListByProjectId,
  putObj,
  copyObj
} from "@/api/assets/assetsManagement";
import {
  getAllAssetsBusinessScene
} from "@/api/assets/businessScenarioManagement";
import {
  getTableByName,
  getAssetsFieldByTableName
} from "@/api/customConfiguration/tableConfiguration";
import  HistoryVersion from "@/views/assets/assetsManagement/historyVersion";
import  AssetsRelationField from "@/views/assets/assetsManagement/assetsRelationField";
import  DataSubject from "@/views/assets/assetsManagement/dataSubject";
import  SelectField from "@/views/assets/assetsManagement/selectField";
import  FieldRelation from "@/views/assets/assetsManagement/fieldRelation";
import  Details from "@/views/assets/assetsManagement/details";
import  FindStart from "@/views/assets/components/findStart";
import ReleaseForm from "@/views/assets/components/releaseForm";
import History from "@/views/assets/assetsManagement/history";
import { tableOption } from "@/const/crud/assets/assetsManagement";
import { mapGetters } from "vuex";

export default {
  name: "assetsManagement",
  components: {HistoryVersion,
                AssetsRelationField,
                DataSubject,
                SelectField,
                FieldRelation,
                Details,
                ReleaseForm,
                FindStart,
                History},
  data() {
    return {
      active: 0,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, //是否倒序
      },
      query: {},
      list: [],
      listLoading: true,
      form: {},
      ids: [],
      // 业务场景所选id列表
      sceneIdList: [],
      // 业务场景下拉数据
      sceneOptions: [],
      sceneProps: {
        label: 'sceneName',
        value: 'sceneId'
      },
      // 关联字段弹窗
      relationDialog: false,
      // 关联弹窗title
      relationTitle: '',
      // 查看详情弹窗
      detailsDialog: false,
      // 启动评估弹窗
      assessmentDialog: false,
      saveBtnText: this.$t('assetsManagement.保存'),

      // 资产id
      projectId: 0,
      // 查看详情配置项
      viewColumn: [],
      // 查看详情数据
      rowData: {},

      // 发现资产弹窗
      findDialog: false,

      // 导入弹窗
      importDialog: false,

      // 文件列表
      fileList: [],

      fullscreenLoading: false,

      defaultActive: '',
      // 回显勾选的主体类型
      echoCheckedDataSubjectList: [],
      // 完整勾选数据主体类型
      checkedDataSubjectObjList: [],
      // 完整勾选字段
      fieldList: [],

      // 历史记录弹窗
      historyDialog: false,
      historyVersionDialog: false,
      showMap:false,
      map: null,
      searchLocation: '',
      locationOptions: [],
      isOverHidden: true,
      isFullscreen: false,
      option: {},
      // 当前版本号
      curVersion: 0,
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"]),
  },
  created() {
    this.getList(this.page)
    this.getTable()
  },
  methods: {
    //查询table/资产表格/表单配置
    getTable() {
      this.fullscreenLoading = true
      getTableByName('asset').then(tableRes => {
        getAssetsFieldByTableName('asset').then(res => {
          const option = {
            ...tableRes.data.data,
            column: res.data.data
          };
          tableOption(this, this.userInfo.tenantId, this.isOverHidden, false, option)
          this.$refs.crud.refreshTable()
          this.fullscreenLoading = false;
        })
      })
    },
    changeArray() {
      this.isOverHidden = !this.isOverHidden
      tableOption(this.userInfo.tenantId, this.isOverHidden, false)
    },
    openMap() {
      this.showMap = true
      // if (this.map) return;
      this.$nextTick(() => {
        this.map = new BMapGL.Map("baiduMap");

        const scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
        this.map.addControl(scaleCtrl);
        const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
        this.map.addControl(zoomCtrl);
        const cityCtrl = new BMapGL.CityListControl();  // 添加城市列表控件
        this.map.addControl(cityCtrl);
        this.map.enableScrollWheelZoom(true) // 滚轮放大缩小地图
        this.form.lng = this.form.lng ? this.form.lng : '116.404'
        this.form.lat = this.form.lat ? this.form.lat : '39.915'
        this.form.hostingLocation = this.form.hostingLocation ? this.form.hostingLocation : '北京市'
        const point = new BMapGL.Point(this.form.lng, this.form.lat);

        this.map.centerAndZoom(point, 15);
        const marker = new BMapGL.Marker(point);  // 创建标注
        this.map.addOverlay(marker); // 将标注添加到地图中
        const geoc = new BMapGL.Geocoder();
        this.map.addEventListener('click', (e) => {
          this.form.lng = e.latlng.lng.toString()
          this.form.lat = e.latlng.lat.toString()
          //创建标注位置
          const pt = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
          const marker = new BMapGL.Marker(pt);  // 创建标注
          this.map.clearOverlays()
          this.map.addOverlay(marker); // 将标注添加到地图中
          geoc.getLocation(e.latlng, (rs) => {
              const addComp = rs.addressComponents;
              this.form.hostingLocation = `${addComp.province},${addComp.city}`
              // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          })
        })
      })
    },

    saveLatlng() {
      this.showMap = false
    },
    // 上一步
    previousStep() {
      this.active--
    },
    // 根据资产id查询关联字段信息
    getAssetsProjectAttributesListByProjectId(id) {
        return getAssetsProjectAttributesListByProjectId(id).then(res => {
            this.echoCheckedDataSubjectList = this.handleEchoData(res.data.data)
            console.log(this.echoCheckedDataSubjectList, '????????');
            this.fieldList = this.handleFieldList(this.echoCheckedDataSubjectList)
            console.log(this.fieldList,'this.fieldList');
        })
    },
    // 获取勾选的数据主体类型
    getCheckedDataSubject(checkedDataSubjectList, checkedDataSubjectObjList) {
      this.checkedDataSubjectObjList = checkedDataSubjectObjList
    },
    // 处理字段数据，用于回显字段列表
    handleFieldList(data) {
      return data.reduce((pre, cur, curIndex, arr) => {
            const Arr = Object.values(cur.checkedFieldListAll).flat()
            Arr.forEach((f,i)=> {
              f.dataSubjectsVolume = f.dataSubjectsVolume || 0
              f.identification = `${this.projectId}+${f.mainBodyId}+${f.attributesId}`
            })
            return pre.concat(Arr)
          }, [])
    },
    // 处理关联字段接口返回数据，用于回显关联字段组件
    handleEchoData(data) {
       data.forEach((item,index) => {
          item.checkedCategoryList = item.categoryList.map(x => x.categoryId) || []
          item.checkedDataClass = item.typeList.map(x => x.typeId) || []
          if(!('checkedFieldList' in item)) {
              item.checkedFieldList = {}
          }
          if(!('checkedFieldListAll' in item)) {
              item.checkedFieldListAll = {}
          }
          item.checkedCategoryList.forEach((x, j) => {
            item.checkedFieldListAll[x] = item.attributes.filter(a => x === a.categoryId)
            item.checkedFieldList[x] = item.checkedFieldListAll[x].map(a => a.attributesId)
          })
        })
        return data
    },
    getList(page, params) {
      this.listLoading = true;
      getAssetsProjectByPage(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params
        )
      ).then((response) => {
        this.list = response.data.data.records
        this.page.total = response.data.data.total;
        this.listLoading = false;
      });
    },
    handleOpenBefore(show, type) {
      this.curVersion = this.form.version || 0
      this.getAllAssetsBusinessScene()
      show();
    },
    // 获取全部业务场景
    getAllAssetsBusinessScene() {
      getAllAssetsBusinessScene().then(res => {
        this.sceneOptions = res.data.data
      })
    },
    // 点击资产名称查看详情
    cellClick(row, column) {
      if(column.label === this.$t('assetsManagement.资产名称')) {
        this.projectId = row.projectId
        this.viewColumn = this.$refs.crud.columnOption
        this.rowData = row
        this.detailsDialog = true
        this.getAssetsProjectAttributesListByProjectId(row.projectId)

      }
      if(column.label === '版本号') {
        this.projectId = row.projectId
        this.historyVersionDialog = true
      }
    },

    create(row, done, loading) {
      // if(Array.isArray(this.form.organizationalSecurityMeasures) || typeof this.form.organizationalSecurityMeasures === 'object') {
      //   this.form.organizationalSecurityMeasures = this.form.organizationalSecurityMeasures.join()
      // }
      let formReduce = {}
      for(let key in this.form) {
        if(Array.isArray(this.form[key])) {
          this.form[key] = this.form[key].join()
        }
        if(key.substr(0, 1) !== '$') {
          formReduce[key] = this.form[key]
        }
      }
      addObj(formReduce)
        .then(res => {
          if(res.data.status == 200) {
              this.getList(this.page);
              done();
              this.$message.success(res.data.message);
          } else {
              loading();
          }
      })
      .catch(() => {
          loading();
      });
    },
    update(row, index, done, loading) {
      // if(Array.isArray(this.form.organizationalSecurityMeasures) || typeof this.form.organizationalSecurityMeasures === 'object') {
      //   this.form.organizationalSecurityMeasures = this.form.organizationalSecurityMeasures.join()
      // }
      let formReduce = {}
      for(let key in this.form) {
        if(Array.isArray(this.form[key])) {
          this.form[key] = this.form[key].join()
        }
        if(key.substr(0, 1) !== '$') {
          formReduce[key] = this.form[key]
        }
      }
      putObj(formReduce)
        .then(res => {
          if(res.data.status == 200) {
              this.getList(this.page);
              done();
              // if(res.data.data === true) {
              this.reassess(row.projectId)
              // }
              this.$message.success(res.data.message);
          } else {
              loading();
          }
      })
      .catch(() => {
          loading();
      });
    },
    // 重新评估
    reassess(projectId) {
      this.$confirm(this.$t('assetsManagement.是否对本资产发起新的评估'), this.$t('crudCommon.提示'), {
        confirmButtonText: this.$t('crudCommon.确定'),
        cancelButtonText: this.$t('crudCommon.取消'),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      })
        .then(() => {
          this.assessmentDialog = true
          this.projectId = projectId
        })
    },
    // 发现资产
    findAsset() {
      this.findDialog = true
    },
    // 导入资产
    importAsset() {
      this.importDialog = true

    },
    // 导出模板
    exportMode() {
      this.fullscreenLoading = true
        let config = { 'responseType': 'blob' }
        this.axios.get('/assets/assetsProject/export', config)
        .then(res=>{
            const fileName = decodeURIComponent(res.headers['content-disposition']).split('=')[1]
            let fileData = []
            fileData.push(res.data)
            let blobUrl = URL.createObjectURL(new Blob(fileData, {type: res.headers['content-type']}))
            this.download(blobUrl, fileName)
            this.fullscreenLoading = false
            this.$message.success(this.$t('crudCommon.导出成功'));

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
    // 上传文件
    beforeUpload(file) {
        this.fullscreenLoading = true
        const param = new FormData()
        param.append('file', file)
        this.axios.post('/assets/assetsProject/exportProject', param).then(res=>{
          this.$message.success(res.data.message);
          this.importDialog = false
          this.fullscreenLoading = false
          this.getList(this.page);
        }).catch(() => {
          this.importDialog = false
          this.fullscreenLoading = false
        })
        return false
    },
    // 删除文件
    handleRemove() {},
    // 删除文件之前
    beforeRemove() {},
    // 超出数量大小提示
    handleExceed() {},

    // 提交发现资产
    findFormSave() {
      this.fullscreenLoading = true
      this.$refs.findStart.findFormSave()
    },
    // 发现资产保存成功
    findAsssetSaveSuccess() {
      this.findDialog = false
      this.fullscreenLoading = false
      this.getList(this.page)
    },

    // 打开评估弹窗
    openAssessment(row) {
        this.projectId = row.projectId
        this.assessmentDialog = true
    },
    // 提交评估表单
    assessmentFormSubmit() {
      this.fullscreenLoading = false
      this.$refs.releaseForm.releaseSave()
      // this.assessmentDialog = false
    },

    // 关闭评估弹窗
    closeAssessmentDialog() {
      this.fullscreenLoading = false
      this.assessmentDialog = false
    },

    // 打开关联字段弹窗
    relationBtn(row) {
      this.$refs.assetsRelationFieldRef.relationBtn(row)
    },

    // 查看历史记录
    viewHistory(row) {
      this.historyDialog = true
      this.projectId = row.projectId
    },

    selectionChange(list){
      this.ids = list.map(item => (item.projectId))
    },
    // 提交关联字段
    relationFormSubmit() {
      this.fullscreenLoading = true
      this.$refs.fieldRelation.saveCurd()
    },
    // 子组件数据保存成功
    FieldRelationSaveSuccess(isUpdate) {
      // if(isUpdate === true) {
        this.reassess(this.projectId)
      // }
      // this.relationDialog = false
      // this.fullscreenLoading = false
      this.getList(this.page)
    },
    deleteBtn(row) {
      const ids = row ? [row.projectId] : this.ids
      if(!ids.length) {
        this.$message.error(this.$t('crudCommon.请选择要删除的数据'));
        return
      }
      this.$confirm(this.$t('crudCommon.是否删除本条数据'), this.$t('crudCommon.提示'), {
        confirmButtonText: this.$t('crudCommon.删除'),
        cancelButtonText: this.$t('crudCommon.不删除'),
        type: "warning",
      })
        .then(() => {
          delObj(ids).then((res) => {
            if (res.data.status === 200) {
              this.$message.success(res.data.message);
              this.$refs.crud.toggleSelection()
              this.handleRefreshChange();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
    },
    copyBtn(row) {
      const ids = row ? [row.projectId] : this.ids
      if(!ids.length) {
        this.$message.error(this.$t('crudCommon.请选择要复制的数据'));
        return
      }
      this.$confirm(this.$t('crudCommon.是否复制本条数据'), this.$t('crudCommon.提示'), {
        confirmButtonText: this.$t('crudCommon.复制'),
        cancelButtonText: this.$t('crudCommon.不复制'),
        type: "warning",
      })
        .then(() => {
          copyObj(ids).then((res) => {
            if (res.data.status === 200) {
              this.$message.success(res.data.message);
              this.$refs.crud.toggleSelection()
              this.handleRefreshChange();
            } else {
              this.$message.error(res.data.message);
            }
          });
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
    handleFilter(param, done) {
      if('date' in param) {
        param.startTime = param.date[0]
        param.endTime = param.date[1]
        param.date = undefined
      }
      this.query = param;
      this.page.currentPage = 1;
      this.getList(this.page, this.query);
      done();
    },
    resetChange(){
      this.query = {}
      this.getList(this.page, this.query);
    },
    handleRefreshChange() {
      this.getList(this.page);
    },
    handleUpdate(row, index) {
      console.log(this.$refs, '2222222');
      this.$refs.crud.rowEdit(row, index);
    },
  },
};
</script>
<style lang="scss">
#baiduMap {
  height: 350px;
}

.projectName:hover {
    cursor:pointer;
    color: rgb(52, 228, 234);
}
.projectName {
    color: #409EFF;

}
.btn-custom-cancel{
  float: right !important;
  margin-left: 10px !important;
}

</style>
<style lang="scss" scoped>
::v-deep  .avue-icon i {
  font-size: 16px !important;
}
</style>
