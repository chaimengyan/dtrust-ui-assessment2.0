<template>
    <div class="app-container calendar-list-container">
        <basic-container >
            <template>
                <el-tabs v-model="switchStatus" @tab-click="switchTab">
                    <el-tab-pane :label="$t('userinfo.信息管理')" name='userManager'/>
                    <el-tab-pane :label="$t('userinfo.密码管理')" name='passwordManager'/>
                </el-tabs>
            </template>
            <el-row>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                       <avue-form 
                            v-if="switchStatus == 'userManager'"
                            v-model="userInfoForm" 
                            ref="userInfoForm"
                            :option="option"
                            @submit="handleSubmit">
                            <template slot-scope="{size}" slot="menuForm">
                                <el-button type="primary" :size="size" @click="handleSubmit('userInfoForm')">{{$t('userinfo.提交')}}</el-button>
                                <el-button :size="size" @click="handleReset('userInfoForm')">{{$t('userinfo.重置')}}</el-button>
                            </template>
                        </avue-form>
                        <el-form
                            v-else
                            :model="passwordForm"
                            :rules="passwordFormRules"
                            ref="passwordForm"
                            label-width="100px"
                            class="demo-ruleForm">
                            <el-form-item :label="$t('userinfo.原密码')"
                                          prop="password">
                                <el-input type="password"
                                          show-password
                                          v-model="passwordForm.password"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('userinfo.新密码')"
                                          prop="newPassword">
                                <el-input type="password"
                                          show-password
                                          v-model="passwordForm.newPassword"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('userinfo.确认密码')"
                                          prop="confirmNewPassword">
                                <el-input type="password"
                                          show-password
                                          v-model="passwordForm.confirmNewPassword"
                                          auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="handleSubmit('passwordForm')">{{$t('userinfo.提交')}}</el-button>
                                <el-button @click="handleReset('passwordForm')">{{$t('userinfo.重置')}}</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </basic-container>
    </div>
</template>


<script>
    import {tableOption} from "@/const/crud/admin/userInfo";
    import { mapGetters } from "vuex";
    import request from '@/router/axios'

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (this.passwordForm.password !== '') {
                    if (value !== this.passwordForm.newPassword) {
                        callback(new Error(this.$t('userinfo.两次输入密码不一致')))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            }
           
            return {
                switchStatus: '',
                userInfoForm: {
                    roleList: []
                },
                password: '',
                passwordForm: {},
                passwordFormRules: {
                    password: [{required: true, min: 6, message: this.$t('userinfo.原密码不能为空且不少于6位'), trigger: 'change'}],
                    newPassword: [{required: true, min: 6, message: this.$t('userinfo.不少于6位'), trigger: 'change'}],
                    confirmNewPassword: [{required: true, validator: validatePass, trigger: 'change'}]
                }
            }
        },
       
        created() {
            this.getTenantInfo(this.userInfo.tenantId)
            this.userInfoForm = this.userInfo
            this.passwordForm.userId = this.userInfo.userId
            this.userInfoForm.roleList = this.roles
            this.switchStatus = 'userManager'
        },
        computed: {
            ...mapGetters(["roles", "userInfo"]),
            option() {
                return tableOption(this, this.userInfo.tenantId)
            },
        },
        methods: {
            switchTab(tab) {
                this.switchStatus = tab.name
            },
            getTenantInfo(tenantId) {
                request({
                    url:`/admin/tenant/getTenantById?id=${tenantId}`,
                    method: 'get',
                }).then(res => {
                    this.userInfoForm.tenantName = res.data.data.tenantName
                })
            },
            handleSubmit(formName) {
                this.$refs[formName].validate((valid, done) => {
                    if (valid) {
                        request({
                            url: '/admin/user/updateByUser',
                            method: 'put',
                            data: this[formName]
                        }).then(res => {
                            if(res.data.status == 200) {
                                this.$message.success(res.data.message);
                                // 修改密码之后强制重新登录
                                if (formName === 'passwordForm') {
                                    this.$store.dispatch('LogOut').then(() => {
                                        location.reload() // 为了重新实例化vue-router对象 避免bug
                                    })
                                }else {
                                    location. reload()
                                }
                            } 
                            done();
                        }).catch(() => {
                            done();
                        })
                    } else {
                        return false
                    }
                })
            },
            handleReset(formName) {
                if(formName == 'userInfoForm') {
                    this.userInfoForm = {
                        nickName: '',
                        password: '',
                        mobilePhone: '',
                        mail: ''
                    }
                } else {
                    this.passwordForm = {
                        password: '',
                        newPassword: '',
                        confirmNewPassword: ''
                    }
                }
            },
        }
    }
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px!important;
        color: #8c939d!important;
        width: 178px!important;
        height: 178px!important;
        line-height: 178px!important;
        text-align: center!important;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
