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
        :data="list"
        @cell-click="cellClick"
        @selection-change="selectionChange"
      >
      <template slot="menuRight" slot-scope="{size}">
        <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
      </template>
      <!-- 业务场景名称 -->
        <template slot="sceneName" slot-scope="scope">
            <span class="sceneName">
                {{scope.row.sceneName}}
            </span>
        </template>
        <template slot="menuLeft">
          <el-button
            v-if="permissions.assets_businessScenario_add"
            class="filter-item"
            @click="$refs.crud.rowAdd()"
            type="primary"
            icon="el-icon-plus"
            >{{$t('crudCommon.添加')}}
          </el-button>
          <el-button
            v-if="permissions.assets_businessScenario_find"
            class="filter-item"
            @click="findBusiness"
            type="primary"
            icon="el-icon-position"
            >{{$t('businessScenarioManagement.发现业务场景')}}
          </el-button>
          <el-button
            v-if="permissions.assets_businessScenario_export"
            class="filter-item"
            @click="exportMode"
            type="primary"
            icon="el-icon-upload"
            v-loading.fullscreen.lock="fullscreenLoading"
            >{{$t('crudCommon.导出模板')}}
          </el-button>
          <el-button
            v-if="permissions.assets_businessScenario_import"
            class="filter-item"
            @click="importAsset"
            type="primary"
            icon="el-icon-document-add"
            >{{$t('crudCommon.导入')}}
          </el-button>
          <el-button
            v-if="permissions.assets_businessScenario_batchDel"
            type="primary"
            plain
            icon="el-icon-delete"
            @click="deleteBtn(false)"
            >{{$t('crudCommon.批量删除')}}
          </el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
            <el-button
              v-if="permissions.assets_businessScenario_edit"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('assetsManagement.关联')" placement="top">
            <el-button
              v-if="permissions.assets_businessScenario_relation"
              type="text"
              icon="el-icon-link"
              @click="relationBtn(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('assetsManagement.历史记录')" placement="top">
            <el-button
              v-if="permissions.assets_businessScenario_history"
              type="text"
              icon="btn-icon-lishijilu"
              @click="viewHistory(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('assetsManagement.评估')" placement="top">
            <el-button
              v-if="permissions.assets_businessScenario_assessment"
              class="filter-item"
              type="text"
              @click="openAssessment(scope.row)"
              icon="el-icon-message"
              >
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
            <el-button
              v-if="permissions.assets_businessScenario_del"
              type="text"
              icon="el-icon-delete"
              @click="deleteBtn(scope.row, scope.index)"
              />
          </el-tooltip>
        </template>
      </avue-crud>
    </basic-container>
    <el-drawer size="100%" v-if="relationDialog" :visible.sync="relationDialog">
      <div class="drawer-header" slot="title">
        <span class="drawer-header-title" v-html="relationTitle"></span>
        <div class="drawer-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
      <el-steps :active="active" style="width: 60%;margin: 0 auto;" simple finish-status="success">
        <el-step :title="$t('businessScenarioManagement.选择资产')"></el-step>
        <el-step :title="$t('assetsManagement.选择字段')"></el-step>
        <el-step :title="$t('assetsManagement.字段配置')"></el-step>
      </el-steps>

      <RelatedAssets
        v-show="active === 0"
        ref="relatedAssets" 
        :echoCheckedAssetObjList="echoCheckedAssetObjList"
        />

      <SelectField
        v-show="active === 1"
        ref="selectField" 
        :defaultActive="defaultActive"
        :checkedAssetObjList="checkedAssetObjList"
        :isView="false"
        />

      <ActRelation
        v-show="active === 2"
        ref="actRelation" 
        :fieldList="fieldList"
        :sceneId="sceneId"
        :saveBtnText="saveBtnText"
        @saveSuccess="saveSuccess"
         />
      <div class="demo-drawer__footer">
          <el-button 
            type="primary" 
            v-if="active !== 0" 
            icon="el-icon-top"
            @click="previousStep">{{$t('assetsManagement.上一步')}}</el-button>
          <el-button 
            type="primary" 
            v-if="active !== 2" 
            icon="el-icon-bottom"
            @click="nextStep">{{$t('assetsManagement.下一步')}}</el-button>
          <el-button 
            type="primary" 
            v-if="active === 2" 
            :icon="saveBtnText ===$t('assetsManagement.保存')?'el-icon-circle-plus-outline':'el-icon-circle-check'"
            @click="relationFormSubmit">{{saveBtnText}}</el-button>
          <el-button 
            icon="el-icon-circle-close"
            @click="relationDialog = false">{{$t('assetsManagement.取消')}}</el-button>
      </div>
    </el-drawer>
    <el-dialog 
      :title="$t('assetsManagement.启动评估')" 
      width="35%" 
      v-if="assessmentDialog" 
      :close-on-click-modal="false" 
      :visible.sync="assessmentDialog"
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('assetsManagement.启动评估')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
      <ReleaseForm 
        ref="releaseForm"
        :typeIds="1"
        :evaluationItem="{businessScenarioId: sceneId}"
        @closeAssessmentDialog="closeAssessmentDialog"
      />
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="assessmentFormSubmit">{{$t('assetsManagement.保存')}}</el-button>
          <el-button icon="el-icon-circle-close" @click="assessmentDialog = false">{{$t('assetsManagement.取消')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看业务场景详情"
      width="70%" 
      v-if="detailsDialog" 
      :visible.sync="detailsDialog"
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('businessScenarioManagement.查看业务场景详情')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
      <Details
        ref="details" 
        :sceneId="sceneId"
        :viewColumn="viewColumn"
        :rowData="rowData"
        :fieldList="fieldList"
        />
    </el-dialog>
    <el-dialog
      :title="$t('businessScenarioManagement.发现业务场景')"
      width="70%" 
      v-if="findDialog" 
      :close-on-click-modal="false" 
      :visible.sync="findDialog"
      :fullscreen="isFullscreen">
      <div class="dialog-header" slot="title">
        <span class="dialog-header-title">{{$t('businessScenarioManagement.发现业务场景')}}</span>
        <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
        </div>
      </div>
      <FindStart
        ref="findStart"
        :findType="2"
        @saveSuccess="findBusinessSaveSuccess"
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
      :close-on-click-modal="false" 
      append-to-body
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
      <BusHistory
        :sceneId="sceneId"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  getAssetsBusinessSceneByPage,
  putObj,
  getProjectAttributesBySceneId
} from "@/api/assets/businessScenarioManagement";
import {
  getTableByName,
  getAssetsFieldByTableName
} from "@/api/customConfiguration/tableConfiguration";
import { tableOption } from "@/const/crud/assets/businessScenarioManagement";
import { mapGetters } from "vuex";
import  RelatedAssets from "@/views/assets/businessScenarioManagement/relatedAssets";
import  SelectField from "@/views/assets/businessScenarioManagement/selectField";
import  ActRelation from "@/views/assets/businessScenarioManagement/actRelation";
import ReleaseForm from "@/views/assets/components/releaseForm";
import  Details from "@/views/assets/businessScenarioManagement/details";
import  FindStart from "@/views/assets/components/findStart";
import BusHistory from "@/views/assets/businessScenarioManagement/busHistory";

export default {
  name: "businessScenarioManagement",
  components: {
    RelatedAssets,
    ActRelation,
    SelectField,
    ReleaseForm,
    Details,
    FindStart,
    BusHistory
    },
  data() {
    return {
      active: 0,
      // 关联字段弹窗
      relationDialog: false,
      // 关联字段弹窗title
      relationTitle: '',
      saveBtnText: this.$t('assetsManagement.保存'),
      // 启动评估弹窗
      assessmentDialog: false,
      // 所选资产对象列表
      checkedAssetObjList: [],
      // 回显资产对象列表
      echoCheckedAssetObjList: [],
      // 完整勾选数据主体类型
      checkedDataSubjectObjList: [],
      // 字段
      fieldList: [],
      

      // 发现业务场景弹窗
      findDialog: false,

      // 历史记录弹窗
      historyDialog: false,

      // 导入弹窗
      importDialog: false,
      
      // 文件列表
      fileList: [],

      defaultActive: '',

      fullscreenLoading: false,

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
      sceneId: 0,
      // 查看详情弹窗
      detailsDialog: false,
      // 查看详情配置项
      viewColumn: [],
      // 查看详情数据
      rowData: {},
      isOverHidden: true,
      isFullscreen: false,
      option: {}
    };
  },
  computed: {
    ...mapGetters(["permissions", "userInfo"]),
    // option() {
    //   return tableOption(this, this.userInfo.tenantId, this.isOverHidden, false)
    // },
  },
  created() {
    this.getList(this.page)
    this.getTable()
  },
  methods: {
    //查询table/业务场景表格/表单配置
    getTable() {
      this.fullscreenLoading = true
      getTableByName('scene').then(tableRes => {
        getAssetsFieldByTableName('scene').then(res => {
          const option = {
            ...tableRes.data.data,
            column: res.data.data
          };
          tableOption(this, this.userInfo.tenantId, this.isOverHidden, false, option)
          this.$refs.crud.refreshTable()
          this.fullscreenLoading = false

        })
      })
    },
    changeArray() {
      this.isOverHidden = !this.isOverHidden
      tableOption(this, this.userInfo.tenantId, this.isOverHidden, false)
    },
    // 下一步
    nextStep() {
      if(this.active === 0) {
        this.checkedAssetObjList = this.$refs.relatedAssets.handleCheckedAssetObjList()
        if(this.checkedAssetObjList.length === 0) {
          this.$message.error(this.$t('businessScenarioManagement.请至少选择一个资产'))
        } else {
          this.active++
          const p = this.checkedAssetObjList[0].projectId + ''
          this.defaultActive = this.checkedAssetObjList[0].dataSubjectList[0].mainBodyIdCp
          this.$nextTick(() => {
            this.$refs.selectField.handleChecked(p)
            this.$refs.selectField.checkDataSubject(this.defaultActive)
          })
        }
      }else if(this.active === 1) {
        const dataList = this.$refs.selectField.getCheckedAssetObjList()
          .map(a => a.dataSubjectList)
          .flat()
          .filter(d => 'checkedFieldListAll' in d)
        const isCheckField = dataList.every(item => item.checkedFieldListAll.length !== 0 )
        if(isCheckField) {
          this.fieldList = this.handleFieldList(dataList)
          console.log(this.fieldList, '点击下一步-字段列表数据')
            if(this.fieldList.length === 0) {
              this.$message.error(this.$t('businessScenarioManagement.请选择资产下面的字段'))
            } else {
              this.active++
            }
        } else {
          this.$message.error(this.$t('businessScenarioManagement.请选择资产下面的字段'))
        }
      } 
    },
    // 上一步
    previousStep() {
      this.active--
    },
    // 保存关联字段
    relationFormSubmit() {
      this.fullscreenLoading = true
      this.$refs.actRelation.saveCurd()
    },
    // 子组件数据保存成功
    saveSuccess(isUpdate) {
      this.relationDialog = false
      this.fullscreenLoading = false
      this.getList(this.page)
      // if(isUpdate === true) {
        this.reassess(this.sceneId)
      // }
    },
    getList(page, params) {
      this.listLoading = true;
      getAssetsBusinessSceneByPage(
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

    // 重新评估
    reassess(sceneId) {
      this.$confirm(this.$t('businessScenarioManagement.是否对本业务场景发起新的评估'), 
      this.$t('crudCommon.提示'), {
        confirmButtonText: this.$t('crudCommon.确定'),
        cancelButtonText: this.$t('crudCommon.取消'),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning",
      })
        .then(() => {
          this.assessmentDialog = true
          this.sceneId = sceneId
        })
    },

    // 发现业务场景
    findBusiness() {
      this.findDialog = true
    },

    // 查看历史记录
    viewHistory(row) {
      this.historyDialog = true
      this.sceneId = row.sceneId
    },

    // 提交发现业务场景
    findFormSave() {
      this.fullscreenLoading = true
      this.$refs.findStart.findFormSave()
    },
    // 发现业务场景保存成功
    findBusinessSaveSuccess() {
      this.findDialog = false
      this.fullscreenLoading = false
      this.getList(this.page)
    },

    // 打开评估弹窗
    openAssessment(row) {
        this.sceneId = row.sceneId
        this.assessmentDialog = true
    },

    // 提交评估表单
    assessmentFormSubmit() {
      this.fullscreenLoading = true
      this.$refs.releaseForm.releaseSave()
    },
    // 关闭评估弹窗
    closeAssessmentDialog() {
      this.fullscreenLoading = false

      this.assessmentDialog = false
    },
    // 打开关联字段弹窗
    relationBtn(row) {
      this.fullscreenLoading = true
      this.active = 0
      this.sceneId = row.sceneId
      this.relationTitle = `<i class="${row.sceneIcon}"></i> <span style="font-weight: 700;">${row.sceneName}</span> ${this.$t('assetsManagement.关联')}`
      this.relationDialog = true
      this.getProjectAttributesBySceneId(this.sceneId).then(()  => {
        this.saveBtnText = this.echoCheckedAssetObjList.length ? this.$t('assetsManagement.修改') : this.$t('assetsManagement.保存')
        this.$refs.relatedAssets.echoChecked()
        this.fullscreenLoading = false
      })
    },

    // 根据业务场景id查询关联详情
    getProjectAttributesBySceneId(sceneId) {
      return getProjectAttributesBySceneId(sceneId).then(res => {
          this.echoCheckedAssetObjList = this.handleEchoData(res.data.data)
          const data = this.echoCheckedAssetObjList.map(a => a.dataSubjectList).flat()
          this.fieldList = this.handleFieldList(data)
      })
    },

    // 处理字段数据，用于回显字段列表
    handleFieldList(data) {
      return data.reduce((pre, cur, curIndex, arr) => {
        const Arr = Object.values(cur.checkedFieldListAll).flat()
        Arr.forEach((f,i)=> {
          f.volumeOfDataSubjects = f.volumeOfDataSubjects || 0
          f.identification = `${f.projectId}+${f.mainBodyId}+${f.attributesId}`
        })
        return pre.concat(Arr)
      }, [])
    },

    // 处理关联字段接口返回数据，用于回显关联字段组件
    handleEchoData(data) {
      data.forEach((asset,index) => {
        asset.dataSubjectList.forEach((item, itemIndex) => {
          item.checkedCategoryList = item.categoryList.map(x => x.categoryId) || [] //字段类别勾选回显
          item.checkedDataClass = item.typeList.map(x => x.typeId) || [] //数据分类勾选回显
          if(!('checkedFieldList' in item)) {
              item.checkedFieldList = {}
          }
          if(!('checkedFieldListAll' in item)) {
              item.checkedFieldListAll = {}
          }
          item.checkedCategoryList.forEach((x, j) => {// 字段勾选回显
            item.checkedFieldListAll[x] = item.attributes.filter(a => x === a.categoryId)
            item.checkedFieldList[x] = item.checkedFieldListAll[x].map(a => a.attributesId)
          })
        })
      })
      return data
    },
    // 导入资产
    importAsset() {
      this.importDialog = true
    },  
    // 导出模板
    exportMode() {
      this.fullscreenLoading = true
        let config = { 'responseType': 'blob' }
        this.axios.get('/assets/assetsBusinessScene/exportExcel', config)
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
      this.axios.post('/assets/assetsBusinessScene/importExcel', param).then(res=>{
        this.$message.success(res.data.message);
        this.importDialog = false
        this.fullscreenLoading = false
        this.getList(this.page);
      }).catch(() => {
        this.importDialog = false
        this.fullscreenLoading = false
      });
      return false
    },
    // 删除文件
    handleRemove() {},
    // 删除文件之前
    beforeRemove() {},
    // 超出数量大小提示
    handleExceed() {},


    // 点击业务场景名称查看详情
    cellClick(row, column) {
      if(column.label === this.$t('businessScenarioManagement.业务场景名称')) {
        this.sceneId = row.sceneId
        this.viewColumn = this.$refs.crud.columnOption
        this.rowData = row
        this.detailsDialog = true
        this.getProjectAttributesBySceneId(row.sceneId)
      }
    },
    selectionChange(list){
      this.ids = list.map(item => (item.sceneId))
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
      this.$refs.crud.rowEdit(row, index);
    },
    create(row, done, loading) {
      if(Array.isArray(this.form.purposeOfProcessing) || typeof this.form.purposeOfProcessing === 'object') {
        this.form.purposeOfProcessing = this.form.purposeOfProcessing.join()
      }
      if(Array.isArray(this.form.locationsOfPartiesAccessUse)) {
        this.form.locationsOfPartiesAccessUse = this.form.locationsOfPartiesAccessUse.join()
      }
      if(Array.isArray(this.form.dataSubjectsRegion)) {
        this.form.dataSubjectsRegion = this.form.dataSubjectsRegion.join()
      }
      addObj(this.form)
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
      if(Array.isArray(this.form.purposeOfProcessing) || typeof this.form.purposeOfProcessing === 'object') {
        this.form.purposeOfProcessing = this.form.purposeOfProcessing.join()
      }
      if(Array.isArray(this.form.locationsOfPartiesAccessUse)) {
        this.form.locationsOfPartiesAccessUse = this.form.locationsOfPartiesAccessUse.join()
      }
      if(Array.isArray(this.form.dataSubjectsRegion)) {
        this.form.dataSubjectsRegion = this.form.dataSubjectsRegion.join()
      }
      putObj(this.form)
        .then(res => {
          if(res.data.status == 200) {
              this.getList(this.page);
              done();
              // if(res.data.data === true) {
                this.reassess(row.sceneId)
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
    
    deleteBtn(row) {
      const ids = row ? [row.sceneId] : this.ids
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
            if (res.data.status == 200) {
              this.$message.success(res.data.message);
              this.$refs.crud.toggleSelection()
              this.handleRefreshChange();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
    },
  },
};
</script>
<style lang="scss" scoped>
.sceneName:hover {
    cursor:pointer;
    color: rgb(52, 228, 234);
}
.sceneName {
    color: #409EFF;
}
.btn-custom-cancel{
  float: right !important;
  margin-left: 10px !important;
}
::v-deep  .avue-icon i {
  font-size: 16px !important;
}
</style>