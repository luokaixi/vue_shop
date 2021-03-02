<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '商品管理',name2: '商品分类'}"></bread-crumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 添加按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区域 -->
            <el-table :data="tableData" style="width: 100%" stripe border class="table">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="goodsname" label="商品名称">
                </el-table-column>
                <el-table-column prop="goodsprice" label="商品价格(元)">
                </el-table-column>
                <el-table-column prop="goodsweight" label="商品重量">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row._id)">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row._id)">
                        </el-button>
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
    data () {
        return {
            tableData: [],
            total: 0,
            queryInfo: {
                query: '',
                pageSize: 4,
                pageNum: 1
            }
        }
    },
    methods: {
        // 监听页码改变
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize
            this.getList()
        },
        // 当前页改变
        handleCurrentChange(val){
            this.queryInfo.pageNum = val
            this.getList()
        },
        // 获取商品数据
        async getList(){
            let res = await this.$http.get('goods', { params: this.queryInfo })
            if (res.meta.status === 200) {
                this.tableData = res.data.goods
                this.total = res.data.total
            } else {
                this.$message.error('获取商品列表失败')
            }
        },
        // 删除商品
        deleteGoods(id){
            this.$messageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('goods', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.meta.status === 200) {
                            this.$message.success('删除商品成功')
                            this.getList()
                        } else {
                            this.$message.error('删除商品失败')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        }
    },
    created () {
        this.getList()
    }
}
</script>

<style lang='less' scoped>

</style>