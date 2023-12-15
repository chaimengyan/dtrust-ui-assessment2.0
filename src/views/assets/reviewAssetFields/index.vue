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
          :data="list"
        >
        <template slot="menuRight" slot-scope="{size}">
          <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
        </template>
          <!-- 资产名称 -->
          <!-- <template slot="projectName" slot-scope="scope">
              <span class="projectName">
                  {{scope.row.projectName}}
              </span>
          </template> -->
          <template slot="sceneIds" slot-scope="scope">
             {{ scope.row.sceneNames ? scope.row.sceneNames.toString() : $t('crudCommon.暂无') }} 
          </template>
  
          <template slot="menuLeft">
            <!-- <el-button
              v-if="permissions.assets_assetsManagement_add"
              class="filter-item"
              @click="$refs.crud.rowAdd()"
              type="primary"
              icon="el-icon-plus"
              >{{$t('crudCommon.添加')}}
            </el-button> -->
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
              icon="el-icon-delete"
              @click="confirmBtn(false)"
              >{{$t('crudCommon.批量确认')}} 
            </el-button>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('evaluationRecord.待审核')" placement="top">
              <el-button
                v-if="permissions.assets_assetsManagement_edit"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row, 1)"
                /> 
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('evaluationRecord.通过')" placement="top">
              <el-button
                v-if="permissions.assets_assetsManagement_edit"
                type="text"
                icon="el-icon-circle-check"
                @click="handleUpdate(scope.row, 0)"
                /> 
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('evaluationRecord.拒绝')" placement="top">
              <el-button
                v-if="permissions.assets_assetsManagement_edit"
                type="text"
                icon="el-icon-circle-close"
                @click="handleUpdate(scope.row, 2)"
                /> 
            </el-tooltip>
          </template>
        </avue-crud>
      </basic-container>
      <ReviewDialog ref="reviewDialogRef" />
    </div>
  </template>
  
  <script>
  import {
    addObj,
    delObj,
    getAssetsProjectAttributesListByProjectId,
    putObj,
    batchAudit
  } from "@/api/assets/reviewAssetFields";
  import {
  getAssetsProjectByPage,
} from "@/api/assets/assetsManagement"
import ReviewDialog  from "@/views/assets/reviewAssetFields/reviewDialog"
  import { tableOption } from "@/const/crud/assets/reviewAssetFields";
  import { mapGetters } from "vuex";
  
  export default {
    name: "reviewAssetFields",
    components: { ReviewDialog },
    data() {
      return {
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
      };
    },
    computed: {
      ...mapGetters(["permissions", "userInfo"]),
      option() {
        return tableOption(this, this.isOverHidden)
        },
    },
    created() {
      this.getList(this.page)
    },
    methods: {
      
      changeArray() {
        this.isOverHidden = !this.isOverHidden
        tableOption(this.userInfo.tenantId, this.isOverHidden, false)
      },
     
   
      getList(page, params) {
        this.listLoading = true;
        getAssetsProjectByPage(
          Object.assign(
            {
              current: page.currentPage,
              size: page.pageSize,
              status: 1
            },
            params
          )
        ).then((response) => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total;
          this.listLoading = false;
        });
      },
      
      // 点击资产名称查看详情
      cellClick(row, column) {
        if(column.label === this.$t('assetsManagement.资产名称')) {
          console.log(row, column, 'row, column');
          this.projectId = row.projectId
          this.viewColumn = this.$refs.crud.columnOption
          this.rowData = row
          this.detailsDialog = true
          this.getAssetsProjectAttributesListByProjectId(row.projectId)
          
        }
      },
   
      selectionChange(list){
        this.ids = list.map(item => (item.projectId))
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
      confirmBtn(row) {
        const ids = row ? [row.projectId] : this.ids
        if(!ids.length) {
          this.$message.error(this.$t('crudCommon.请选择要确认的数据'));
          return
        }
        this.$confirm(this.$t('crudCommon.是否确认本条数据'), this.$t('crudCommon.提示'), {
          confirmButtonText: this.$t('crudCommon.通过'),
          cancelButtonText: this.$t('crudCommon.不通过'),
          type: "warning",
        })
          .then(() => {
            const obj = ids.map(x => {
              return {projectId: x, status: 0}
            })
            this.batchAudit(obj)
          })
          .catch(() => {
            const obj = ids.map(x => {
              return {projectId: x, status: 2}
            })
            this.batchAudit(obj)
          })
      },
      batchAudit(obj) {
        batchAudit(obj).then((res) => {
          if (res.data.status === 200) {
            this.$message.success(res.data.message);
            this.$refs.crud.toggleSelection()
            this.handleRefreshChange();
          } else {
            this.$message.error(res.data.message);
          }
        });
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
      handleUpdate(row, status) {
        this.$refs.reviewDialogRef.relationBtn(row, status,'100%')
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