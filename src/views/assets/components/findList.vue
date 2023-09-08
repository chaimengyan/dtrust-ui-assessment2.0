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
        @selection-change="selectionChange"
        :data="list"
      >
        <template slot="menuRight" slot-scope="{size}">
          <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
        </template>
        <template slot="jobUrl" slot-scope="scope">
          <el-link :href="scope.row.jobUrl" target="_blank">{{scope.row.jobUrl}}</el-link>
        </template>
      </avue-crud>
      
    </basic-container>
  </div>
</template>

<script>
import  { getFindJobsByPage } from "@/api/assets/findAssets";
import { mapGetters } from "vuex";
import {tableOption} from "@/const/crud/components/findList"
export default {
  name: "findList",
  components: {  },
  props: {
    findType: {
      type: Number,
      default: 0
    },
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
      ids: [],
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
      getFindJobsByPage(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
            findType: this.findType
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
    selectionChange(list){
      this.ids = list.map(item => (item.attributesId))
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep  .avue-crud__icon {
  font-size: 20px !important;
}
</style>