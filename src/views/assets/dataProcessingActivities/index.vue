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
        :data="list"
        @selection-change="selectionChange"
        @cell-click="cellClick"
      >
        <template slot="menuRight" slot-scope="{size}">
          <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
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
            @click="deleteBtn(false)"
            >{{$t('crudCommon.批量删除')}} 
          </el-button>
        </template>
        <!-- 处理活动类别 -->
        <template slot="activitiesCategory" slot-scope="scope">
          <span>
            {{activitiesCategoryOptions.find(i => i.value === scope.row.activitiesCategory).label}}
          </span>
        </template>
        <!-- 类型 -->
        <template slot="activitiesType" slot-scope="scope">
          <span>
            {{activitiesTypeOptions.find(i => i.value === scope.row.activitiesType).label}}
          </span>
        </template>
        <!-- 内容 -->
        <template slot="activitiesJson" slot-scope="scope">
          <span class="activitiesJson">
            {{scope.row.activitiesJson | handleActivitiesJson}}
          </span>
        </template>

        <template slot="menu" slot-scope="scope">
          <!-- <el-button
            v-if="permissions.sys_user_edit"
            type="text"
            icon="el-icon-view"
            @click="addOrEditBtn('view', scope.row)"
            >查看 
          </el-button> -->
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
            <el-button
              v-if="permissions.assets_dataProcessingActivities_edit"
              :disabled="!handleDataPermissions('update', scope.row)"
              type="text"
              icon="el-icon-edit"
              @click="addOrEditBtn('edit', scope.row)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
            <el-button
              v-if="permissions.assets_dataProcessingActivities_del"
              :disabled="!handleDataPermissions('delete', scope.row)"
              type="text"
              icon="el-icon-delete"
              @click="deleteBtn(scope.row, scope.index)"
              />
          </el-tooltip>
        </template>
      </avue-crud>
      <el-dialog
        :title="title" 
        v-if="addActivitiesDialog" 
        :visible.sync="addActivitiesDialog"
        :close-on-click-modal="false" 
        :fullscreen="isFullscreen">
        <div class="dialog-header" slot="title">
          <span class="dialog-header-title">{{title}}</span>
          <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
          </div>
        </div>
        <AddActivities
          ref="addActivities" 
          :viewStatus="viewStatus"
          :echoActivitiesForm="echoActivitiesForm"
          :activitiesTypeOptions="activitiesTypeOptions"
          @saveSuccess="saveSuccess"
          />
        <div slot="footer" class="dialog-footer">
            <el-button 
              type="primary" 
              :loading="btnLoading"
              :disabled="viewStatus === 'view'" 
              :icon="saveBtnText ===$t('assetsManagement.保存')?'el-icon-circle-plus-outline':'el-icon-circle-check'"
              @click="submitBtn"
              >{{saveBtnText}}</el-button>
            <el-button
              icon="el-icon-circle-close"
              @click="addActivitiesDialog = false">{{$t('assetsManagement.取消')}}</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  getAssetsActivitiesByPage,
  putObj,
} from "@/api/assets/dataProcessingActivities";
import { tableOption } from "@/const/crud/assets/dataProcessingActivities";
import  AddActivities from "@/views/assets/dataProcessingActivities/addActivities";
import { mapGetters } from "vuex";
import { activitiesCategoryOptions } from "@/util/enum"
export default {
  name: "dataProcessingActivities",
  components: {
    AddActivities,
  },
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
      addActivitiesDialog: false,
      viewStatus: 'add',
      title: this.$t('dataProcessingActivities.新增'),
      // 编辑回显
      echoActivitiesForm: {},
      ids: [],
      activitiesCategoryOptions,
      activitiesTypeOptions: [
        {
          label: this.$t('dataProcessingActivities.单选'),
          value: 'radio'
        },
        {
          label: this.$t('dataProcessingActivities.多选'),
          value: 'checkbox'
        },
        {
          label: this.$t('dataProcessingActivities.文本框'),
          value: 'textarea'
        },
        {
          label: this.$t('crudCommon.日期'),
          value: 'date'
        },
      ],
      isFullscreen: false,
      isOverHidden: true,
      saveBtnText: this.$t('assetsManagement.保存'),
      btnLoading: false,
    };
  },
  filters: {
    handleActivitiesJson(val) {
      const a = JSON.parse(val).answers.map(item => item.label).join(' | ')
      return a
    },
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
      getAssetsActivitiesByPage(
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
    // 点击业务场景名称查看详情
    cellClick(row, column) {
      if(column.label === '选项内容') {
        this.addOrEditBtn('view', row)
      }
    },
    // 打开新增/编辑弹窗
    addOrEditBtn(viewStatus, row) {
      this.viewStatus = viewStatus
      if(viewStatus === 'add') {
        this.addActivitiesDialog = true
        this.title = this.$t('dataProcessingActivities.新增')
        this.saveBtnText = this.$t('assetsManagement.保存')
      } else {
        this.title = viewStatus === "edit" ? this.$t('crudCommon.编辑') : this.$t('crudCommon.查看')
        this.saveBtnText = this.$t('assetsManagement.修改')
        this.echoActivitiesForm = row
        this.addActivitiesDialog = true
        this.$nextTick(()=> {
          this.$refs.addActivities.echoEvent()
        })
      }
    },
    // 提交新增数据
    submitBtn() {
      this.btnLoading = true
      const activitiesForm = this.$refs.addActivities.getActivitiesForm()
      if(!activitiesForm) return this.btnLoading = false
      const submitApi = 'activitiesId' in activitiesForm ? putObj : addObj
      submitApi(activitiesForm).then(res => {
        'activitiesId' in activitiesForm ? this.getList(this.page) : this.$refs.crud.searchReset()
        this.addActivitiesDialog = false
        this.btnLoading = false
        const msg = 'activitiesId' in activitiesForm ? '修改数据处理活动成功！' : '添加数据处理活动成功！'
        this.$message.success(msg)
      }).catch(() => {
        this.btnLoading = false
      })
    },
    // 子组件数据保存成功
    saveSuccess() {
      this.addActivitiesDialog = false
      this.getList(this.page)
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

    selectionChange(list){
      this.ids = list.map(item => (item.activitiesId))
    },

    deleteBtn(row) {
      const ids = row ? [row.activitiesId] : this.ids
      if(!ids.length) {
        this.$message.error(this.$t('crudCommon.请选择要删除的数据'));
        return
      }
      this.$confirm(this.$t('crudCommon.是否删除本条数据'),this.$t('crudCommon.提示'), {
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
.activitiesJson {
  width:220px;
  color: #409EFF;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
}
.activitiesJson:hover {
    cursor:pointer;
    color: rgb(52, 228, 234);
}
</style>