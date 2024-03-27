<template>
    <div class="execution">
        <basic-container>
            <avue-crud
                ref="crud"
                :page.sync="page"
                :data="tableData"
                :permission="permissionList"
                :table-loading="tableLoading"
                :option="tableOption"
                @search-change="searchChange"
                @search-reset="resetChange"
                @refresh-change="handleRefreshChange"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="selectionChange"
                >
                <template slot="menuRight" slot-scope="{size}">
                    <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray(true)"></el-button>
                </template>
                <template slot="menuLeft">
                  <el-button
                    v-if="permissions.assets_dataProcessingActivities_add"
                    class="filter-item"
                    @click="addOrEditBtn('add')"
                    type="primary"
                    icon="el-icon-plus"
                    >{{$t('crudCommon.添加')}} 
                  </el-button>
                  <el-button
                    v-if="permissions.assets_dataProcessingActivities_batchDel"
                    type="primary"
                    plain
                    icon="el-icon-delete"
                    @click="delBtn(false)"
                    >{{$t('crudCommon.批量删除')}} 
                  </el-button>
                </template>
                <template
                    slot-scope="scope"
                    slot="menu">
                    <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
                        <el-button
                            :disabled="scope.row.createBy === 'admin' ||!handleDataPermissions('update', scope.row)"
                            type="text"
                            size="small"
                            icon="el-icon-edit"
                            @click="addOrEditBtn('edit', scope.row)"
                            />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
                        <el-button
                            v-if="permissions.assets_assetDict_del"
                            :disabled="!handleDataPermissions('delete', scope.row)"
                            type="text"
                            size="small"
                            icon="el-icon-delete"
                            @click="delBtn(scope.row,scope.index)"
                            />
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('crudCommon.导出')"
                        placement="top">
                        <el-button 
                            v-if="permissions.assets_dataProcessingActivities_add" 
                            size="small"
                            type="text"
                            icon="el-icon-download" 
                            @click="exportReport(scope.row)" />
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('exportTemplate.导出记录')"
                        placement="top">
                        <el-button 
                            v-if="permissions.assets_dataProcessingActivities_add" 
                            size="small"
                            type="text"
                            icon="el-icon-notebook-1" 
                            @click="exportRecord(scope.row)" />
                    </el-tooltip>
                </template>
            </avue-crud>
        </basic-container>
        <el-drawer
            size="70%"
            v-if="exportRecordDrawer"
            :visible.sync="exportRecordDrawer"
            :title="ExportRecordTitle"
            @close="closeExportRecordDialog"
            append-to-body
            :close-on-click-modal="false" 
            >
            <basic-container>
                <avue-crud
                    ref="crudItem"
                    :page.sync="recordPage"
                    :data="exportRecordData"
                    v-model="form"
                    :option="exportRecordOption"
                    @size-change="recordSizeChange"
                    @refresh-change="handleRefreshTemChange"
                    @current-change="recordCurrentChange"
                    >
                    <template slot="menuRight" slot-scope="{size}">
                      <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray(false)"></el-button>
                    </template>
                </avue-crud>
            </basic-container>
        </el-drawer>
        <el-dialog 
            :title="title" 
            width="35%" 
            append-to-body
            :visible.sync="temDialog"
            v-loading.fullscreen.lock="fullscreenLoading"
            :close-on-click-modal="false" 
            :destroy-on-close="true">

            <tem-form ref="temFormref" :formType="formType" :temFormData="temForm" />
            
            <template #footer>
                <el-button @click="temDialog = false">{{$t('crudCommon.取消')}}</el-button>
                <el-button type="primary" @click="handleSubmitTemForm">{{$t('crudCommon.确定')}}</el-button>
            </template>
        </el-dialog>
        <el-dialog 
            :title="$t('crudCommon.导出')" 
            width="35%" 
            :visible.sync="exportDialog"
            append-to-body
            v-loading.fullscreen.lock="fullscreenLoading"
            :close-on-click-modal="false" 
            :destroy-on-close="true">
            <div style="margin-bottom: 10px;">
                <el-select v-if="[0,1,2,3].includes(templateType)" v-model="estimateId" :placeholder="`${$t('crudCommon.请选择')}${$t('assetsManagement.评估')}`" clearable>
                    <el-option v-for="item in estimateOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
                <el-select v-if="templateType === 4" v-model="assetsId" :placeholder="`${$t('crudCommon.请选择')}${$t('businessScenarioManagement.资产')}`" clearable>
                    <el-option v-for="item in assetsOptions" :key="item.projectId" :label="item.projectName" :value="item.projectId" />
                </el-select>
                <el-select v-if="templateType === 5" v-model="sceneId" :placeholder="`${$t('crudCommon.请选择')}${$t('assetbusin.业务场景')}`" clearable>
                    <el-option v-for="item in sceneOptions" :key="item.sceneId" :label="item.sceneName" :value="item.sceneId" />
                </el-select>
            </div>
            <template #footer>
                <el-button @click="exportDialog = false">{{$t('crudCommon.取消')}}</el-button>
                <el-button type="primary" @click="handleSubmit">{{$t('crudCommon.确定')}}</el-button>
            </template>
        </el-dialog>
    </div>
  </template>
  
  <script>
    import {getGeneralReportPageApi, 
            addGeneralReportApi, 
            putGeneralReportApi, 
            delGeneralReportApi, 
            getEvaluationListApi,
            getRecordsApi
        } from '@/api/exportTemplate/index'
    import {exportRecordOption, tableOption} from '@/const/crud/exportTemplate/index'
    import temForm from '@/views/assets/exportTemplate/tem-form.vue'
    import {mapGetters} from 'vuex'
    export default {
      name: 'exportTemplate',
      components: {temForm},
      data() {
        return {
          query: {},
          form: {
            type: undefined,
            fieldId: undefined,
          },
          dictType: undefined,
          fieldId: undefined,
          tableData: [],
          exportRecordData: [],
          page: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 20 // 每页显示多少条
          },
          recordPage: {
            total: 0, // 总页数
            currentPage: 1, // 当前页数
            pageSize: 20 // 每页显示多少条
          },
          tableLoading: false,
          isOverHidden: true,
          isFullscreen: false,
          erId: '',
          ExportRecordTitle: '',
          exportRecordDrawer: false,
          estimateId: '',
          assetsId: '',
          sceneId: '',
          exportDialog: false,
          rId: '',
          rName: '',
          templateType: 0,
          fullscreenLoading: false,
          title: this.$t('dataProcessingActivities.新增'),
          temDialog: false,
          temForm: {},
          formType: 'add',
          estimateOptions: [],
          assetsOptions: [],
          sceneOptions: [],
          ids: [],
        }
      },
      computed: {
        ...mapGetters(['permissions', 'userInfo']),
        permissionList() {
          return {
            addBtn: this.vaildData(this.permissions.assets_assetDict_add, false),
          }
        },
        tableOption(){
          return tableOption(this, this.isOverHidden)
        },
        exportRecordOption(){
          return exportRecordOption(this, this.isOverHidden)
        },
      },
      created() {
        this.getList(this.page)
      },
      methods: {
        changeArray(type) {
          this.isOverHidden = !this.isOverHidden
          type ? tableOption(this, this.isOverHidden)
               : exportRecordOption(this, this.isOverHidden)
        },
        //======模板表格相关=====
        getList(page, params) {
          this.tableLoading = true
          getGeneralReportPageApi(Object.assign({
            current: page.currentPage,
            size: page.pageSize
          }, params, this.query)).then(res => {
            this.tableData = res.data.data.records
            this.page.total = res.data.data.total
            this.tableLoading = false
          })
        },
        addOrEditBtn(type, row) {
          this.formType = type
          this.temDialog = true
          if(type === 'add') {
            this.title = this.$t('dataProcessingActivities.新增')
          }else {
            this.title = this.$t('crudCommon.编辑')
            this.temForm = row
            console.log(row, 'row');
            this.$nextTick(()=> {
              this.$refs.temFormref.echoEvent()
            })
          }
        },
        handleSubmitTemForm() {
          const formData = this.$refs.temFormref.formData()
          const API = this.formType === "add" ? addGeneralReportApi : putGeneralReportApi
          API(formData).then(res => {
              if(res.data.status == 200) {
                  this.getList(this.page);
                  this.temDialog = false
                  this.$message.success(res.data.message);
              } 
          })
          .catch(() => {
          });
        },
        delBtn(row) {
          const ids = row ? [row.id] : this.ids
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
            delGeneralReportApi(ids).then((res) => {
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
        exportReport(row) {
            this.estimateId = ''
            this.assetsId = ''
            this.sceneId = ''
            this.exportDialog = true
            this.rId = row.id
            this.rName = row.templateName
            this.templateType = row.type
            if(this.templateType === 0) {
                this.getEvaluationList()
            }else if(this.templateType === 1) {
                this.getEvaluationList({assets: true})
            }else if(this.templateType === 2) {
                this.getEvaluationList({scene: true})
            }else if(this.templateType === 3) {
                this.getEvaluationList({assets: true, scene: true})
            }else if(this.templateType === 4) {
                this.getAllAssetsProject()
            }else if(this.templateType === 5) {
                this.getAllAssetsBusinessScene()
            }
        },
        exportRecord (row) {
            this.erId = row.id
            this.exportRecordDrawer = true
            this.ExportRecordTitle = row.templateName
            this.getExportRecordList()
        },
        handleSubmit() {
            this.fullscreenLoading = true
            let param
            if([0,1,2,3].includes(this.templateType)) {
                param = {rId:this.rId, eId:this.estimateId}
            }else if(this.templateType === 4) {
                param = {rId:this.rId, assetsId:this.assetsId}
            }else if(this.templateType === 5) {
                param = {rId:this.rId, sceneId:this.sceneId}
            }else {
                param = {rId:this.rId}
            }
            this.downBlobFile('/assessment/generalReport/export', param, this.rName)
            this.exportDialog = false
            this.fullscreenLoading = false
        },
        getEvaluationList(params) {
            getEvaluationListApi(params).then(res => {
                this.estimateOptions = res.data.data
            })
        },
        getAllAssetsProject() {
            getAllAssetsProjectApi().then(res => {
                this.assetsOptions = res.data.data
            })
        },
        getAllAssetsBusinessScene() {
            getAllAssetsBusinessSceneApi().then(res => {
                this.sceneOptions = res.data.data
            })
        },
  
        searchChange(form, done) {
          this.query = form
          this.page.currentPage = 1
          this.getList(this.page, form)
          done()
        },
        resetChange(){
          this.query = {}
          this.getList(this.page, this.query);
        },
        sizeChange(pageSize) {
          this.page.pageSize = pageSize
          this.getList(this.page, this.query);
        },
        currentChange(current) {
          this.page.currentPage = current
          this.getList(this.page, this.query);
        },
        handleRefreshChange() {
          this.getList(this.page);
        },
        //======导出记录表格相关=====
        handleRefreshTemChange() {
          this.getExportRecordList()
        },
        closeExportRecordDialog: function () {
          this.exportRecordDrawer = false
          this.recordPage.currentPage = 1
        },
        
        getExportRecordList() {
          getRecordsApi(Object.assign({
            current: this.recordPage.currentPage,
            size: this.recordPage.pageSize,
            erId: this.erId
          })).then(res => {
            this.exportRecordData = res.data.data.records
            this.recordPage.total = res.data.data.total
          })
        },
      
        recordSizeChange(pageSize) {
          this.recordPage.pageSize = pageSize
          this.getExportRecordList()
        },
        recordCurrentChange(current) {
          this.recordPage.currentPage = current
          this.getExportRecordList()
        },
        selectionChange(list){
          this.ids = list.map(item => (item.id))
        },
        
      }
    }
  </script>
  
  <style lang="scss" scoped>
  .itemBox{
  }
  </style>