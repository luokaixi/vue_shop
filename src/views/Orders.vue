<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '订单管理',name2: '订单列表'}"></bread-crumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入订单编号" class="" v-model="queryInfo.query" clearable @clear="clearSearch"
                        @keydown.enter.native="search">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 修改对话框 -->
            <el-dialog title="修改订单" :visible.sync="editDialogVisible" width="50%" @closed="closeEditForm">
                <el-form :model="editForm" :rules="ruleForm" ref="editForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="收货地址" prop="address1">
                        <el-cascader v-model="editForm.address1" :options="addressList" :props="addressPrps"
                                expand-trigger="hover" @change="handleChange"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="editForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitEdit">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 商品列表区域 -->
            <el-table :data="tableData" style="width: 100%" stripe border class="table">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="ordersno" label="订单编号">
                </el-table-column>
                <el-table-column prop="ordersprice" label="订单价格" width="150px">
                </el-table-column>
                <el-table-column label="是否付款" width="200px">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.ispay ? '' : 'warning'">{{scope.row.ispay ? '已付款' : '未付款'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="issend" label="是否发货" width="150px">
                    <template slot-scope="scope">
                        <span>{{scope.row.issend ? '是' : '否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderstime" label="下单时间" width="250px">
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEdit(scope.row._id)">
                        </el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOrders(scope.row._id)">
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
        data() {
            return {
                addressList: [],
                editForm: {
                    address1: '',
                    address2: ''
                },
                editDialogVisible: false,
                tableData: [],
                total: 0,
                queryInfo: {
                    query: '',
                    pageSize: 4,
                    pageNum: 1
                },
                ruleForm: {
                    address1: [
                        {required: true, message: '请选择省市区', trigger: 'blur'}
                    ],
                    address2: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'}
                    ]
                },
                addressPrps: {
                    label: 'name',
                    value: 'name',
                    children: 'children'
                }
            }
        },
        methods: {
            // 监听页码改变
            handleSizeChange(newSize) {
                this.queryInfo.pageSize = newSize
                this.getList()
            },
            // 当前页改变
            handleCurrentChange(val) {
                this.queryInfo.pageNum = val
                this.getList()
            },
            // 获取订单数据
            async getList() {
                let res = await this.$http.get('orders', {
                    params: this.queryInfo
                })
                if (res.meta.status === 200) {
                    this.tableData = res.data.orders
                    this.total = res.data.total
                } else {
                    this.$message.error('获取商品列表失败')
                }
            },
            // 搜索
            search(){
                this.getList()
            },
            // 清除搜索
            clearSearch(){
                this.getList()
            },
            // 删除商品
            deleteOrders(id) {
                this.$messageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('orders', {
                        params: {
                            id: id
                        }
                    }).then(res => {
                        if (res.meta.status === 200) {
                            this.$message.success('删除订单成功')
                            this.getList()
                        } else {
                            this.$message.error('删除订单失败')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 展示修改对话框
            showEdit(){
                this.editDialogVisible = true
            },
            // 对话框关闭事件
            closeEditForm(){},
            // 提交表单事件
            submitEdit(){},
            // 级联选择器改变事件
            handleChange(){},
            // 获取省市区数据
            async getAddress(){
                let res = await this.$http.get('address')
                console.log(res)
                if (res.meta.status !== 200) return this.$message.error('获取省市区数据失败')
                let address = JSON.parse(JSON.stringify(res.data).replace(/(city)|(area)/g, 'children'))
                address.forEach(item => {
                    item.children.forEach(value => {
                        value.children = value.children.map(list => {
                            return {name: list}
                        })
                    })
                })
                this.addressList = address
            }
        },
        created() {
            this.getList()
            this.getAddress()
        }
    }
</script>

<style lang='less' scoped>
.el-cascader{
    width: 100%;
}
</style>