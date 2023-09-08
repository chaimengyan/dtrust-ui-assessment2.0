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
            v-if="permissions.field_fieldCategory_add"
            class="filter-item"
            @click="$refs.crud.rowAdd()"
            type="primary"
            icon="el-icon-plus"
            >{{$t('crudCommon.添加')}}
          </el-button>
          <el-button
            v-if="permissions.field_fieldCategory_batchDel"
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
              v-if="permissions.field_fieldCategory_edit"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row, scope.index)"
              />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
            <el-button
              v-if="permissions.field_fieldCategory_del"
              type="text"
              icon="el-icon-delete"
              @click="deleteBtn(scope.row, scope.index)"
              />
          </el-tooltip>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {
  addObj,
  delObj,
  getCategoryListByPage,
  putObj,
} from "@/api/fieldManagement/fieldCategory";
import { tableOption } from "@/const/crud/fieldManagement/fieldCategory";
import { mapGetters } from "vuex";
export default {
  name: "fieldCategory",
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
      ids: [],
      listLoading: true,
      form: {},
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
      getCategoryListByPage(
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
      this.ids = list.map(item => (item.categoryId))
    },

    deleteBtn(row) {
      const ids = row ? [row.categoryId] : this.ids
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