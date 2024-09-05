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
            >
            <template slot="menuRight" slot-scope="{size}">
                <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
            </template>
            <template slot="projectChangeForm" >
                <span style="font-size: 12px;white-space:pre-wrap" v-html="form.projectChange">
                </span>
            </template>
            <template slot="attributeAddForm" >
                <span style="font-size: 12px;white-space:pre-wrap;" v-html="form.attributeAdd">
                </span>
            </template>
            <template slot="attributeUpdForm" >
                <span style="font-size: 12px;white-space:pre-wrap;" v-html="form.attributeUpd">
                </span>
            </template>
            <template slot="attributeDelForm" >
                <span style="font-size: 12px;white-space:pre-wrap;" v-html="form.attributeDel">
                </span>
            </template>
            </avue-crud>
        </basic-container>
    </div>
</template>

<script>
import {
  getAssetsProjectHistoryByPage
} from "@/api/assets/assetsManagement";
import { tableOption } from "@/const/crud/assets/history";
import { mapGetters } from "vuex";
export default {
    name: "History",
    components: {  },
    props: {
        projectId: {
            type: Number,
            default: 0
        }
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
        this.getList(this.page)
    },
    methods: {
        changeArray() {
            this.isOverHidden = !this.isOverHidden
            tableOption(this, this.isOverHidden)
        },
        getList(page, params) {
            this.listLoading = true;
            getAssetsProjectHistoryByPage(
                Object.assign(
                {
                    current: page.currentPage,
                    size: page.pageSize,
                    projectId: this.projectId
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
    },
};
</script>