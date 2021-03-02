<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '权限管理',name2: '权限角色'}"></bread-crumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 添加按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table style="width: 100%" stripe border class="table" :data="tableData">
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                        <el-row v-for="(item, index) in scope.row.children" :key="index" class="role">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable>{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级权限 -->
                            <el-col :span="19">
                                <el-row class="role2" v-for="(item2, index2) in item.children" :key="index2">
                                    <el-col :span="6">
                                        <el-tag type="success" closable>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag v-for="(item3, index3) in item.children" :key="index3" type="warning" closable @close="handleClose(item3)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import breadCrumb from '../components/Breadcrumb'
export default {
    components: {
        breadCrumb
    },
    data () {
        return {
            tableData: []
        }
    },
    methods: {
        getRoleList(){
            this.$http.get('roles').then(res => {
                console.log(res)
                if (res.meta.status === 200) {
                    this.tableData = res.data
                } else {
                    this.$message.error('获取角色列表失败')
                }
            })
        },
        // 删除权限
        handleClose(info){
            console.log(info)
            this.$messageBox.confirm('此操作将删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        }
    },
    created () {
        this.getRoleList()
    }
}
</script>

<style lang='less' scoped>

.el-tag{
    margin: 7px;
}
.role{
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
}
.role:first-of-type{
    border-top: 1px solid #eee;
}
.role2{
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
}
.role2:nth-of-type(1){
    border-top: none;
}
</style>