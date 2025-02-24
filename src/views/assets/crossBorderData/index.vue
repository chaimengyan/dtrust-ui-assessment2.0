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
              v-if="permissions.assets_crossBorderData_add"
              class="filter-item"
              @click="relationBtn('add')"
              type="primary"
              icon="el-icon-plus"
              >{{$t('crudCommon.添加')}}
            </el-button>
            <el-button
              v-if="permissions.assets_crossBorderData_batchDel"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="deleteBtn(false)"
              >{{$t('crudCommon.批量删除')}}
            </el-button>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('crudCommon.编辑')" placement="top">
                <el-button
                v-if="permissions.assets_crossBorderData_edit"
                :disabled="!handleDataPermissions('update', scope.row)"
                type="text"
                icon="el-icon-edit"
                @click="relationBtn('edit', scope.row)"
                />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('crossBorderData.数据跨境传输图')" placement="top">
                <el-button
                v-if="permissions.assets_crossBorderData_view"
                :disabled="!handleDataPermissions('update', scope.row)"
                type="text"
                icon="el-icon-picture-outline"
                @click="swimlaneBtn(scope.row)"
                />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('crudCommon.删除')" placement="top">
                <el-button
                v-if="permissions.assets_crossBorderData_del"
                :disabled="!handleDataPermissions('delete', scope.row)"
                :style="!handleDataPermissions('delete', scope.row)?'': 'color: red;'"
                type="text"
                icon="el-icon-delete"
                @click="deleteBtn(scope.row, scope.index)"
                />
            </el-tooltip>
          </template>
        </avue-crud>
        <el-dialog
          :title="$t('fieldManagement.资产关联')" 
          v-if="relationshipDialog"
          width="70%" 
          :visible.sync="relationshipDialog" 
          append-to-body
          :close-on-click-modal="false" 
          :fullscreen="isFullscreen">
          <div class="dialog-header" slot="title">
            <span class="dialog-header-title">{{btnText === $t('assetsManagement.修改') ? $t('crudCommon.编辑') : $t('dataProcessingActivities.新增')}}</span>
            <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
              <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
          </div> 
          <Relationship ref="relationshipRef" />
          <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              icon="el-icon-circle-check"
              v-loading.fullscreen.lock="fullscreenLoading"
              @click="saveOrUpdateBtn">{{btnText}}</el-button>
            <el-button 
              icon="el-icon-circle-close"
              @click="relationshipDialog = false">{{$t('assetsManagement.取消')}}</el-button>
  
          </span>
        </el-dialog>
        <el-dialog
          :title="$t('crossBorderData.数据跨境传输图')" 
          v-if="swimlaneDialog"
          width="70%" 
          :visible.sync="swimlaneDialog" 
          append-to-body
          :close-on-click-modal="false" 
          :fullscreen="isFullscreen">
          <div class="dialog-header" slot="title">
            <span class="dialog-header-title">{{CBData.name}}</span>
            <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
              <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
          </div> 
          <div>
            <div>{{$t('crudCommon.描述')}}：{{CBData.description}} </div>
            <el-collapse>
              <el-collapse-item :title="$t('crossBorderData.字段信息')" name="1">
                <div 
                  style="white-space: normal;"
                  v-for="mainBody in handleAttributes(CBData.transferRelevanceList[0].transferAttributes)"
                  :key="mainBody.mainBodyId">
                  <div>{{mainBody.mainBodyName}}</div>
                    <div style="margin-left: 10px;" v-for="category in mainBody.children" :key="category.categoryId">
                      <div style="color:darkgray">{{category.categoryName}}</div>
                        <el-tag 
                          v-for="attr in category.children"
                          :key="attr.attributesId">
                          {{attr.attributesName}}
                        </el-tag>
                      </div>
                  </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-alert
            :title="$t('crossBorderData.注')"
            type="info">
          </el-alert>
          <Swimlane ref="swimlaneRef" />
        </el-dialog>
      </basic-container>
    </div>
  </template>
  
  <script>
  import {
    getTransferActivityByPage,
    saveOrUpdateObj,
    delObj,
    getTransferActivityById
  } from "@/api/assets/crossBorderData";
  import { tableOption} from '@/const/crud/assets/crossBorderData'
  import Relationship from '@/views/assets/crossBorderData/relationship/index'
  import { mapGetters } from "vuex";
  import Swimlane from "@/views/assetsCharts/swimlane/index"
  export default {
    name: "crossBorderData",
    components: { Relationship,Swimlane },
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
        fullscreenLoading: false,
        isFullscreen: false,
        isOverHidden: true,
        relationshipDialog: false,
        swimlaneDialog: false,
        CBData:{},
        btnText: '',
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
      handleAttributes(attributes) {
            const result = [];
            // 创建一个辅助对象用于存储 mainBodyId 的引用
            const mainBodyMap = {};
            attributes.forEach(item => {
                // 如果 mainBodyId 不存在于 result 中，创建一个新的 main 对象
                if (!mainBodyMap[item.mainBodyId]) {
                    mainBodyMap[item.mainBodyId] = {
                    mainBodyId: item.mainBodyId,
                    mainBodyName: item.mainBodyName,
                    children: []
                    };
                    result.push(mainBodyMap[item.mainBodyId]);
                }

                // 检查是否已存在 categoryId 的 children
                let cidItem = mainBodyMap[item.mainBodyId].children.find(child => child.categoryId === item.categoryId);
                if (!cidItem) {
                    cidItem = {
                        categoryId: item.categoryId,
                        categoryName: item.categoryName,
                        children: []
                    };
                    mainBodyMap[item.mainBodyId].children.push(cidItem);
                }

                // 添加子字段
                cidItem.children.push({
                    attributesId: item.attributesId,
                    attributesName: item.attributesName
                });
            });
            console.log(result,'resultresultresult');
            return result
        },
        onSelectChange(item) {
            item.transferAttributes = []
            item.projectInfo = {}
            if (item.transferRelevanceList) {
                item.transferRelevanceList.forEach(item => {
                    this.onSelectChange(item)
                })
            }
        },
      swimlaneBtn(row) {
        this.getTransferActivityById(row.id).then(()=>{
          this.swimlaneDialog = true
          this.$nextTick(() => {
            this.$refs.swimlaneRef.swimlaneInit(row, this.CBData)
          })
        })
        
      },
      saveOrUpdateBtn() {
        this.fullscreenLoading = true
        this.$refs.relationshipRef.getData().then(data => {
          const a = data.transferRelevanceList.map(t=>t.transferRelevanceList)
          console.log(a,data.transferRelevanceList,'data.transferRelevanceList');
          return this.fullscreenLoading = false
          if(a.filter(x=>x.length === 0).length !== 0){
            this.fullscreenLoading = false
            return this.$message.warning(this.$t('crossBorderData.请添加目标资产'))
          }
          saveOrUpdateObj(data).then(res => {
            if(res.data.status === 200) {
              this.relationshipDialog = false
              this.$message.success(this.$t('assetsManagement.保存成功'));
              this.fullscreenLoading = false
              this.$refs.crud.searchReset();

            }
          })
        }).catch(() => {
          this.fullscreenLoading = false
        })
        
      },
      relationBtn(type, row) {
          this.relationshipDialog = true
          if(type === 'edit') {
            this.btnText = this.$t('assetsManagement.修改')
            this.getTransferActivityById(row.id).then(() => {
              this.$refs.relationshipRef.init(this.CBData)
            })
          }else {
            this.btnText = this.$t('assetsManagement.保存')
          }
      },
      getTransferActivityById(id) {
        return getTransferActivityById(id).then(res => {
          this.CBData = res.data.data
        })
      },
      changeArray() {
        this.isOverHidden = !this.isOverHidden
        tableOption(this, this.isOverHidden)
      },
      getList(page, params) {
        this.listLoading = true;
        getTransferActivityByPage(
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
                this.$refs.crud.searchReset();
                done();
                this.$message.success(this.$t('assetsManagement.保存成功'));
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

      deleteBtn(row) {
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
        this.ids = list.map(item => (item.id))
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  ::v-deep  .avue-icon i {
    font-size: 16px !important;
  }
  </style>