<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '权限管理',name2: '权限列表'}"></bread-crumb>
        <!-- 卡片视图 -->
        <el-button @click="ExportSavePdf(htmlTitle,nowTime)">导出pdf</el-button>
        <el-card class="box-card" id="pdfCentent">
            <el-table style="width: 100%" stripe border class="table" :data="tableData" :height="height">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="权限路径">
                </el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
                        <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
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
            tableData: [],
            height: 140,
            htmlTitle: '导出pdf',
            nowTime: ''
        }
    },
    methods: {
        getRightsList(){
            this.$http.get('rights/list').then(res => {
                console.log(res)
                if (res.meta.status === 200) {
                    this.tableData = res.data
                } else {
                    this.$message.error('获取权限列表失败')
                }
            })
        },
        getHeight(){
            console.log(window.innerHeight)
            this.height = window.innerHeight - 180
        }
    },
    created () {
        this.getRightsList()
        this.getHeight()
        window.addEventListener('resize', this.getHeight)
    }
}
</script>

<style lang='less' scoped>

</style>