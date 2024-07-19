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
        @selection-change="selectionChange"
      >
        <template slot="menuRight" slot-scope="{size}">
          <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
        </template>
        
        <template slot="menuLeft">
          <el-button
            v-if="permissions.field_dataSubjectType_add"
            class="filter-item"
            @click="$refs.crud.rowAdd()"
            type="primary"
            icon="el-icon-plus"
            >{{$t('crudCommon.添加')}}
          </el-button>
          <el-button
            v-if="permissions.field_dataSubjectType_batchDel"
            type="primary"
            plain
            icon="el-icon-delete"
            @click="deleteBtn(false)"
            >{{$t('crudCommon.批量删除')}}
          </el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
            <!-- :disabled="scope.row.createBy === 'admin' || !handleDataPermissions('update', scope.row)" -->

            <el-button
              v-if="permissions.field_dataSubjectType_edit"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('fieldManagement.计算数量')" placement="top">
            <el-button
              v-if="permissions.field_dataSubjectType_calculation"
              :disabled="!handleDataPermissions('update', scope.row)"
              type="text"
              icon="el-icon-edit-outline"
              @click="calculation(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
            <el-button
              v-if="permissions.field_dataSubjectType_del"
              :disabled="scope.row.createBy === 'admin' || !handleDataPermissions('delete', scope.row)"
              type="text"
              icon="el-icon-delete"
              @click="deleteBtn(scope.row, scope.index)"
              />
          </el-tooltip>
        </template>
      </avue-crud>

      <el-dialog
        v-if="calculationDialog" 
        :title="calculationTitle" 
        width="70%" 
        :visible.sync="calculationDialog" 
        append-to-body
        :close-on-click-modal="false" 
        :fullscreen="isFullscreen">
        <div class="dialog-header" slot="title">
          <span class="dialog-header-title">{{calculationTitle}}</span>
          <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
          </div>
        </div>
        <avue-crud
          ref="calculationCrud"
          :option="calculationOption"
          :data="calculationData"
          @row-update="addUpdate"
          />
          {{$t('fieldManagement.数据主体数量')}}{{mainBodySum}}
          <span slot="footer" class="dialog-footer">
            <el-button 
              type="primary" 
              icon="el-icon-circle-check"
              @click="submitCalculation">{{$t('assetsManagement.修改')}}</el-button>
            <el-button
              icon="el-icon-circle-plus-outline" 
              @click="calculationDialog = false">{{$t('assetsManagement.取消')}}</el-button>
          </span>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  getMainBodyListByPage,
  putObj,
  getProjectsByMainBodyId,
  putCalculationObj
} from "@/api/fieldManagement/dataSubjectType";
import { tableOption, calculationOption } from "@/const/crud/fieldManagement/dataSubjectType";
import { mapGetters } from "vuex";
export default {
  name: "dataSubjectType",
  data() {
    return {
      calculationData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, //是否倒序
      },
      query: {},
      list: [],
      ids: [],
      listLoading: true,
      form: {},
      calculationDialog: false,
      mainBodySum: 0,
      mainBodyId: '',
      calculationTitle: '',
      isFullscreen: false,
      isOverHidden: true,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
    option() {
      return tableOption(this, this.isOverHidden)
    },
    calculationOption() {
      return calculationOption(this)
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
      getMainBodyListByPage(
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

    // 打开计算数量弹窗
    calculation(row) {
      this.mainBodyId = row.mainBodyId
      this.calculationTitle = row.mainBodyName
      this.calculationDialog = true
      this.getProjectsByMainBodyId(row.mainBodyId)

    },

    // 提交计算主体数量
    submitCalculation() {
      if(this.calculationData.length === 0) {
        return this.calculationDialog = false
      }
      putCalculationObj({
          mainBodyId: this.mainBodyId,
          mainBodyNum: this.mainBodySum,
          assetsProjectMainBodies:this.calculationData
        }).then(res => {
        this.$message.success(res.data.message)
        this.calculationDialog = false
      })
    },

    // 根据数据主体id查询资产 
    getProjectsByMainBodyId(mainBodyId) {
      getProjectsByMainBodyId(mainBodyId).then(res => {
        this.calculationData = res.data.data
        this.handleMainBodySum()
      })
    },

    // 计算主体总数
    handleMainBodySum() {
      this.mainBodySum = this.calculationData.reduce((pre, cur) => {
        const a = cur.mainBodyNum - cur.repeatNum
        return pre + a
      }, 0)
    },

    // 去重行编辑保存
    addUpdate(form,index,done,loading){
      if(form.mainBodyNum < form.repeatNum) {
        this.$message.error(this.$t('fieldManagement.去重数不能大于主体数量')) 
        loading()
        return 
      }
      this.handleMainBodySum()
      done()
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

    selectionChange(list){
      this.ids = list.map(item => (item.mainBodyId))
    },

    deleteBtn(row) {
      const ids = row ? [row.mainBodyId] : this.ids
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