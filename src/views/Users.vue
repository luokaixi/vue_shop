<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '用户管理',name2: '用户列表'}"></bread-crumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 用户搜索 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" class="" v-model="queryInfo.query" clearable @clear="clearSearch"
                        @keydown.enter.native="search">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 添加用户对话框 -->
            <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="35%" @closed="closeForm">
                <el-form :model="addForm" :rules="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submit">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="35%" @closed="closeEditForm">
                <el-form :model="editForm" :rules="ruleForm" ref="editForm" label-width="70px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="editForm.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitEdit">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 分配角色对话框 -->
            <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="50%" @closed="closeAssignForm">
                <div class="assign-box">
                    <p>当前的用户：{{userInfo.username}}</p>
                    <p>当前的角色：{{userInfo.role_name}}</p>
                    <div>
                        <span>分配新的角色：</span>
                        <el-select v-model="value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="assignDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitAssign">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 用户列表 -->
            <el-table :data="tableData" style="width: 100%" stripe border class="table">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="statusChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row._id)">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row._id)">
                        </el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showAssign(scope.row)">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.currengPage" :page-sizes="[2, 4, 6, 8]" :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" class="pagination">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>
    import breadCrumb from '../components/Breadcrumb'
    export default {
        components: {
            breadCrumb
        },
        data() {
            // 验证邮箱的规则
            const checkEmail = (rule, value, callback) => {
                if (value === '') return callback(new Error('邮箱不能为空！'))
                let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
                if (reg.test(value)) {
                    return callback()
                } else {
                    return callback(new Error('请输入正确的邮箱号'))
                }
            }
            // 验证手机号的规则
            const checkMobile = (rule, value, callback) => {
                if (value === '') return callback(new Error('手机号不能为空！'))
                let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/
                if (reg.test(value)) {
                    return callback()
                } else {
                    return callback(new Error('请输入正确的手机号'))
                }
            }
            return {
                isLoading: false,
                userInfo: {},
                assignDialogVisible: false,
                editForm: {},
                editDialogVisible: false,
                addDialogVisible: false,
                ruleForm: {
                    username: [{
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 5,
                            message: '长度在 2 到 5 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                            required: true,
                            message: '请输入用户密码',
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '长度在 6 到 15 个字符',
                            trigger: 'blur'
                        }
                    ],
                    email: [{
                        required: true,
                        validator: checkEmail,
                        trigger: 'blur'
                    }],
                    mobile: [{
                        required: true,
                        validator: checkMobile,
                        trigger: 'blur'
                    }]
                },
                tableData: [],
                queryInfo: {
                    query: '',
                    pageSize: 4,
                    pageNum: 1
                },
                total: 0,
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                options: [
                    {
                        label: '主管',
                        value: '0'
                    },
                    {
                        label: '超级管理员',
                        value: '1'
                    },
                    {
                        label: '测试角色',
                        value: '2'
                    },
                    {
                        label: '经理',
                        value: '3'
                    }
                ],
                value: ''
            }
        },
        methods: {
            // 页码改变
            handleSizeChange(newSize) {
                console.log(newSize)
                this.queryInfo.pageSize = newSize
                this.getUsers()
            },
            // 当前页改变
            handleCurrentChange(num) {
                console.log(num)
                this.queryInfo.pageNum = num
                this.getUsers()
            },
            // 获取用户列表
            getUsers() {
                this.$http.get('users', {
                    params: this.queryInfo
                }).then(res => {
                    console.log(res)
                    if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
                    this.tableData = res.data.users
                    this.total = res.data.total
                })
            },
            // 状态改变
            statusChange(user) {
                console.log(user)
                this.$http.put(`users/${user._id}/state/${user.state}`).then(res => {
                    console.log(res)
                    if (res.meta.status === 200) {
                        this.$message.success('更新用户状态成功')
                    } else {
                        user.state = !user.state
                        this.$message.error('更新用户状态失败')
                    }
                })
            },
            // 搜索用户
            search() {
                this.getUsers()
            },
            // 清空搜索
            clearSearch() {
                this.getUsers()
            },
            // 关闭新增表单
            closeForm() {
                this.$refs.ruleForm.resetFields()
            },
            // 提交新增表单
            submit() {
                if (this.isLoading) return
                this.isLoading = true
                this.$refs.ruleForm.validate((valid, content) => {
                    if (!valid) return
                    this.$http.post('users', this.addForm).then(res => {
                        console.log(res)
                        if (res.meta.status === 200) {
                            this.$message.success('添加用户成功')
                            this.addDialogVisible = false
                            this.getUsers()
                        } else {
                            this.$message.error(res.meta.msg)
                        }
                    })
                }).finally(() => {
                    this.isLoading = false
                })
            },
            // 展示修改用户的对话框
            showEdit(id) {
                this.$http.get('users/' + id).then(res => {
                    if (res.meta.status == 200) {
                        this.editForm = res.data
                        this.editDialogVisible = true
                    } else {
                        this.$message.error(res.meta.msg)
                    }
                })
            },
            // 提交修改
            submitEdit() {
                this.$refs.editForm.validate((valid, content) => {
                    if (!valid) return
                    this.$http.put('users/' + this.editForm._id, {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    }).then(res => {
                        console.log(res)
                        if (res.meta.status === 200) {
                            this.$message.success('修改用户成功')
                            this.editDialogVisible = false
                            this.getUsers()
                        } else {
                            this.$message.error(res.meta.msg)
                        }
                    })
                })
            },
            // 关闭修改对话框
            closeEditForm() {
                this.$refs.editForm.resetFields()
            },
            // 删除用户
            deleteUser(id) {
                this.$messageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('users', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.meta.status === 200) {
                            this.$message.success('删除用户成功')
                            this.getUsers()
                        } else {
                            this.$message.error('删除用户失败')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 分配角色
            showAssign(info) {
                this.assignDialogVisible = true
                this.userInfo = info
            },
            // 关闭分配角色对话框
            closeAssignForm() {

            },
            // 提交分配角色
            submitAssign() {
                this.assignDialogVisible = false
                this.$message.success('更新角色成功')
            }
        },
        created() {
            this.getUsers()
        }
    }
</script>

<style lang='less' scoped>
    
    .assign-box > p{
        margin: 10px 0;
    }
</style>