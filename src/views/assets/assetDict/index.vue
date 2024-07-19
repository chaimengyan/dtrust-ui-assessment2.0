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
        @row-update="handleUpdate"
        @row-save="handleSave"
        @search-change="searchChange"
        @search-reset="resetChange"
        @refresh-change="handleRefreshChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="rowDel">
        <template slot="menuRight" slot-scope="{size}">
          <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray(true)"></el-button>
        </template>
        <template
          slot-scope="scope"
          slot="menu">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              v-if="permissions.assets_assetDict_edit"
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="editBtn(scope.row,scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('assetDict.字典项')" placement="top">
            <el-button
              v-if="permissions.assets_assetDict_dictItem && scope.row.type === 'select'"
              type="text"
              size="small"
              icon="el-icon-menu"
              @click="handleItem(scope.row,scope.index)"
              />
          </el-tooltip>
        </template>
      </avue-crud>
    </basic-container>
    <el-drawer
      size="70%"
      v-if="dialogFormVisible"
      :visible.sync="dialogFormVisible"
      :title="$t('assetDict.字典项管理')"
      @close="dictItemVisible"
      :close-on-click-modal="false" 
        :fullscreen="isFullscreen">
      <div class="drawer-header" slot="title">
          <span class="drawer-header-title" >{{$t('assetDict.字典项管理')}}</span>
          <div class="drawer-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
          </div>
      </div>
      <basic-container>
        <avue-crud
          ref="crudItem"
          :page.sync="itemPage"
          :data="tableDictItemData"
          v-model="form"
          :before-open="handleBeforeOpen"
          :option="tableDictItemOption"
          @size-change="itemSizeChange"
          @current-change="itemCurrentChange"
          @row-update="handleItemUpdate"
          @row-save="handleItemSave"
          >
          <template slot="menuRight" slot-scope="{size}">
            <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray(false)"></el-button>
          </template>
          <template
            slot-scope="scope"
            slot="menu">
            <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
              <el-button
                v-if="permissions.assets_assetDict_edit"
                :disabled="!handleDataPermissions('update', scope.row)"
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="itemEditBtn(scope.row,scope.index)"
                />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
              <el-button
                v-if="permissions.assets_assetDict_del"
                :disabled="!handleDataPermissions('delete', scope.row)"
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="rowItemDel(scope.row,scope.index)"
                />
            </el-tooltip>
          </template>
        </avue-crud>
      </basic-container>
    </el-drawer>
  </div>
</template>

<script>
  import {getAssetsFieldByPage, 
          addAssetsField,
          putAssetsField,
          delAssetsField,
          getFieldInfoPageByFieldId,
          addFieldInfo,
          putFieldInfo,
          delFieldInfo,
          } from '@/api/assets/assetDict'
  import {tableDictItemOption, tableOption} from '@/const/crud/assets/assetDict'
  import {mapGetters} from 'vuex'

  export default {
    name: 'AssetDict',
    data() {
      return {
        query: {},
        form: {
          type: undefined,
          fieldId: undefined,
        },
        dictType: undefined,
        fieldId: undefined,
        dialogFormVisible: false,
        tableData: [],
        tableDictItemData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        itemPage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        isOverHidden: true,
        isFullscreen: false,
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
      tableDictItemOption(){
        return tableDictItemOption(this, this.isOverHidden)
      },
    },
    created() {
      this.getList(this.page)
    },
    methods: {
      changeArray(type) {
        this.isOverHidden = !this.isOverHidden
        type ? tableOption(this, this.isOverHidden)
             : tableDictItemOption(this, this.isOverHidden)
      },
      //======字典表格相关=====
      getList(page, params) {
        this.tableLoading = true
        getAssetsFieldByPage(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params, this.query)).then(res => {
          this.tableData = res.data.data.records
          this.page.total = res.data.data.total
          this.tableLoading = false
        })
      },
      rowDel(row) {
        this.$confirm(this.$t('crudCommon.是否删除本条数据'), this.$t('crudCommon.提示'), {
          confirmButtonText: this.$t('crudCommon.删除'),
        cancelButtonText: this.$t('crudCommon.不删除'),
          type: 'warning'
        }).then(function () {
          return delAssetsField(row.fieldId)
        }).then(res => {
          this.getList(this.page)
          this.$message.success(res.data.message)
        }).catch(function () {
        })
      },
      editBtn(row) {
        this.$refs.crud.rowEdit(row)
      },
      // 修改字典
      handleUpdate(row, index, done, loading) {
        row.rules = null
        putAssetsField(row).then(res => {
            if(res.data.status == 200) {
                this.getList(this.page);
                done();
                this.$message.success(res.data.message);
            } 
        })
        .catch(() => {
            loading();
        });
      },

      // 新增字典
      handleSave(row, done, loading) {
        addAssetsField(row).then(res => {
            if(res.data.status == 200) {
                this.getList(this.page);
                done();
                this.$message.success(res.data.message);
            }
        })
        .catch(() => {
            loading();
        });
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
      //======字典项表格相关=====
      dictItemVisible: function () {
        this.dialogFormVisible = false
        this.itemPage.currentPage = 1
      },
      handleItem: function (row) {
        this.fieldId = row.fieldId
        this.dictType = row.type
        this.getDictItemList()
      },
      getDictItemList() {
        this.dialogFormVisible = true
        getFieldInfoPageByFieldId(Object.assign({
          current: this.itemPage.currentPage,
          size: this.itemPage.pageSize
        }, {fieldId: this.fieldId})).then(res => {
          this.tableDictItemData = res.data.data.records
          this.itemPage.total = res.data.data.total
        })
      },
      handleBeforeOpen(done) {
        this.form.type = this.dictType
        this.form.fieldId = this.fieldId
        done()
      },
      handleItemSave (row, done, loading) {
        this.$confirm(this.$t('assetDict.保存后将影响所有历史数据是否继续保存'), this.$t('crudCommon.提示'), {
            confirmButtonText: this.$t('crudCommon.确定'),
            cancelButtonText: this.$t('crudCommon.取消'),
            type: 'warning'
        }).then(() => {
          addFieldInfo(row).then(res => {
            if(res.data.status == 200) {
                this.getDictItemList();
                done();
                this.$message.success(res.data.message);
            }
          })
          .catch(() => {
            loading();
          });
        })
        .catch(() => {
          loading();
        });
      },
      itemEditBtn(row) {
        this.$refs.crudItem.rowEdit(row)
      },
      handleItemUpdate (row, index, done, loading) {
        this.$confirm(this.$t('assetDict.保存后将影响所有历史数据是否继续保存'), this.$t('crudCommon.提示'), {
            confirmButtonText: this.$t('crudCommon.确定'),
            cancelButtonText: this.$t('crudCommon.取消'),
            type: 'warning'
        }).then(() => {
          putFieldInfo(row).then(res => {
              if(res.data.status == 200) {
                  this.getDictItemList();
                  done();
                  this.$message.success(res.data.message);
              }
          }).catch(() => {
            loading();
          });
        })
        .catch(() => {
          loading();
        });
      },
      itemSizeChange(pageSize) {
        this.itemPage.pageSize = pageSize
        this.getDictItemList()
      },
      itemCurrentChange(current) {
        this.itemPage.currentPage = current
        this.getDictItemList()
      },
      rowItemDel(row) {
        this.$confirm(this.$t('crudCommon.是否删除本条数据'), this.$t('crudCommon.提示'), {
          confirmButtonText: this.$t('crudCommon.删除'),
          cancelButtonText: this.$t('crudCommon.不删除'),
          type: 'warning'
        }).then(function () {
          return delFieldInfo(row.id)
        }).then(res => {
          this.getDictItemList()
          this.$message.success(res.data.message)
        }).catch(function () {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.itemBox{
}
</style>