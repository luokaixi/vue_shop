<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '商品管理',name2: '商品列表'}"></bread-crumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" class="" v-model="queryInfo.query" clearable @clear="clearSearch"
                        @keydown.enter.native="search">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="toAdd">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品列表区域 -->
            <el-table :data="tableData" style="width: 100%" stripe border class="table">
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="goodsname" label="商品名称">
                </el-table-column>
                <el-table-column prop="goodsprice" label="商品价格(元)" width="100px">
                </el-table-column>
                <el-table-column prop="goodsweight" label="商品重量" width="80px">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="220px">
                </el-table-column>
                <el-table-column label="操作" width="150px">
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
        <p id="msg" v-for="(item, index) in msgList" :key="index">{{item}}</p>
        <input type="text" v-model="message">
        <button id="send" @click="send">发送</button>
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
                message: '',
                text: '',
                ws: null,
                msgList: [],
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
            send() {
                this.msgList.push(this.message)
                this.ws.send(this.message)
                this.message = ''
            },
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
            // 获取商品数据
            async getList() {
                let res = await this.$http.get('goods', {
                    params: this.queryInfo
                })
                if (res.meta.status === 200) {
                    this.tableData = res.data.goods
                    this.total = res.data.total
                } else {
                    this.$message.error('获取商品列表失败')
                }
            },
            // 删除商品
            deleteGoods(id) {
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
              },
              // 搜索商品
                search() {
                    this.getList()
                },
                // 跳转到添加商品页面
                toAdd(){
                    this.$router.push('/goods/add')
                }
            },
            created() {
                this.getList()
                let that = this
                let btn = document.getElementById('send'); //发消息按钮
                let msg = document.getElementById('msg'); //存消息容器
                this.ws = new WebSocket('ws://localhost:8001'); //实例化websocket
                //发消息
                this.ws.onopen = function () {
                    //点击按钮发送消息
                    console.log('已连接')
                };

                //收消息
                this.ws.onmessage = function (e) {
                    //e 接收服务端返回的数据
                    console.log(e)
                    that.msgList.push(e.data)
                };

                //关闭连接
                this.ws.onclose = function () {
                    console.log("连接已关闭...");
                };

                //抛错
                this.ws.onerror = function () {
                    console.log('服务异常关闭...')
                }
            }
        }
</script>

<style lang='less' scoped>
    
</style>