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

        <template slot="menuLeft">
          <el-button
            v-if="permissions.field_fieldMasterData_add"
            class="filter-item"
            @click="$refs.crud.rowAdd()"
            type="primary"
            icon="el-icon-plus"
            >{{$t('crudCommon.添加')}}
          </el-button>
          <el-button
            v-if="permissions.field_fieldMasterData_export"
            class="filter-item"
            @click="exportMode"
            type="primary"
            icon="el-icon-upload"
            v-loading.fullscreen.lock="fullscreenLoading"
            >{{$t('crudCommon.导出模板')}}
          </el-button>
          <el-button
            v-if="permissions.field_fieldMasterData_import"
            class="filter-item"
            @click="importAsset"
            type="primary"
            icon="el-icon-document-add"
            >{{$t('crudCommon.导入')}}
          </el-button>
          <el-button
            v-if="permissions.field_fieldMasterData_batchDel"
            type="primary"
            plain
            icon="el-icon-delete"
            @click="deleteBtn(false)"
            >{{$t('crudCommon.批量删除')}}
          </el-button>
          <el-button
            v-if="permissions.field_fieldMasterData_batchEdit"
            type="primary"
            plain
            icon="el-icon-edit"
            @click="editDataSubject"
            >{{$t('fieldManagement.批量编辑主体类型')}}
          </el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
          <el-button
            v-if="permissions.field_fieldMasterData_edit"
            :disabled="!handleDataPermissions('update', scope.row)"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, scope.index)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
          <el-button
            v-if="permissions.field_fieldMasterData_del"
            :disabled="!handleDataPermissions('delete', scope.row)"
            type="text"
            icon="el-icon-delete"
            @click="deleteBtn(scope.row, scope.index)"
            />
          </el-tooltip>
        </template>
      </avue-crud>
      <el-dialog
        :title="$t('fieldManagement.批量编辑主体类型')" 
        width="35%" 
        :visible.sync="dataSubjectDialog" 
        append-to-body
        :close-on-click-modal="false" 
        :fullscreen="isFullscreen">
        <div class="dialog-header" slot="title">
          <span class="dialog-header-title">{{$t('fieldManagement.批量编辑主体类型')}}</span>
          <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
          </div>
        </div>
        <el-select v-model="dataSubjectList" multiple >
          <el-option
            v-for="item in dataSubjectOptions"
            :key="item.mainBodyId"
            :label="item.mainBodyName"
            :value="item.mainBodyId">
          </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            icon="el-icon-circle-check"
            v-loading.fullscreen.lock="fullscreenLoading"
            @click="sumbitDataSubject">{{$t('assetsManagement.修改')}}</el-button>
          <el-button 
            icon="el-icon-circle-close"
            @click="dataSubjectDialog = false">{{$t('assetsManagement.取消')}}</el-button>

        </span>
      </el-dialog>
      <el-dialog 
        :title="$t('crudCommon.导入')" 
        width="35%" 
        :visible.sync="importDialog" 
        append-to-body
        :close-on-click-modal="false" 
        :fullscreen="isFullscreen">
        <div class="dialog-header" slot="title">
          <span class="dialog-header-title">$t('crudCommon.导入')</span>
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
            v-loading="importLoading"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">{{$t('crudCommon.点击上传')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('crudCommon.只能上传xls和xlsx文件且不超过500kb')}}</div>
        </el-upload>
    </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  putObj,
  delObj,
  getAttributesByPage,
  updateMainBodies
} from "@/api/fieldManagement/fieldMasterData";
import { tableOption } from "@/const/crud/fieldManagement/fieldMasterData";
import { mapGetters } from "vuex";
export default {
  name: "fieldMasterData",
  components: {  },
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
      // 批量编辑数据主体类型弹窗
      dataSubjectDialog: false,
      dataSubjectOptions: [],
      dataSubjectList: [],
      // 导入弹窗
      importDialog: false,
      // 导入loading
      importLoading: false,
      // 文件列表
      fileList: [],
      fullscreenLoading: false,
      isFullscreen: false,
      isOverHidden: true,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    option() {
      return tableOption(this, this.isOverHidden)
    },
  },
  watch: {
  },
  created() {
    this.getList(this.page);
  },
  methods: {
    changeArray() {
      this.isOverHidden = !this.isOverHidden
      tableOption(this, this.isOverHidden)
    },
    getList(page, params) {
      this.listLoading = true;
      getAttributesByPage(
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

    // 导入资产
    importAsset() {
      this.importDialog = true

    },  
    // 导出模板
    exportMode() {
      this.fullscreenLoading = true
        let config = { 'responseType': 'blob' }
        this.axios.get('/assets/assetsAttributes/export', config)
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
        this.importLoading = true
        const param = new FormData()
        param.append('file', file)
        this.axios.post('/assets/assetsAttributes/exportAttributes', param).then(res=>{
          this.$message.success(res.data.message);
          this.importDialog = false
          this.importLoading = false
          this.getList(this.page);
        }).catch(() => {
          this.importDialog = false
          this.importLoading = false
        })
        return false
    },
    // 删除文件
    handleRemove() {},
    // 删除文件之前
    beforeRemove() {},
    // 超出数量大小提示
    handleExceed() {},
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.getList(this.page, this.query);
    },
    currentChange(current) {
      this.page.currentPage = current;
      this.getList(this.page, this.query);
    },
    handleFilter(param, done) {
      this.query = param;
      this.page.currentPage = 1;
      this.getList(this.page, param);
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
      putObj(this.form)
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
    editDataSubject() {
      if(!this.ids.length) {
        this.$message.error(this.$t('fieldManagement.请选择要编辑的数据'));
        return
      }
      this.dataSubjectDialog = true
      this.dataSubjectOptions = this.$refs.crud.DIC.mainBodyIds
    },

    // 提交修改数据主体
    sumbitDataSubject() {
      this.fullscreenLoading = true
      const query = {
        attributeIds: this.ids,
        mainBodyIds: this.dataSubjectList
      }
      this.updateMainBodies(query)
    },

    // 字段主数据批量修改数据主体
    updateMainBodies(query) {
      updateMainBodies(query).then(res => {
        this.dataSubjectDialog = false
        this.$refs.crud.toggleSelection()
        this.dataSubjectList = []
        this.fullscreenLoading = false
        this.$message.success(res.data.message)
        this.getList(this.page)
      }).catch(() => {
        this.fullscreenLoading = false
      })
    },
    deleteBtn(row) {
      const ids = row ? [row.attributesId] : this.ids
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
    selectionChange(list){
      this.ids = list.map(item => (item.attributesId))
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep  .avue-icon i {
  font-size: 16px !important;
}
</style>