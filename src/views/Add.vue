<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '商品管理',name2: '添加商品'}"></bread-crumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-alert title="添加商品信息" type="info" show-icon>
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :active="active - 0" finish-status="success" :space="200" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab栏 -->
            <el-form :model="addForm" :rules="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                label-position="top">
                <el-tabs tab-position="left" v-model="active" :before-leave="beforeTabLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goodsname">
                            <el-input v-model="addForm.goodsname"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goodsprice">
                            <el-input v-model="addForm.goodsprice" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goodsweight">
                            <el-input v-model="addForm.goodsweight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goodsnum">
                            <el-input v-model="addForm.goodsnum" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goodcate">
                            <el-cascader v-model="addForm.selecOptions" :options="categoriesList" :props="catePrps"
                                expand-trigger="hover" @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attrname" v-for="item in manyTableDate" :key="item.attrid">
                            <el-checkbox-group v-model="item.attrcontent">
                                <el-checkbox :label="list" v-for="(list, index) in item.attrcontent" :key="index"
                                    border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">角色管理</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload action="http://localhost:5000/uploads/" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :on-success="handleSuccess"
                            :headers="headerObj">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goodsintroduce" ref="myQuillEditor">
                        </quill-editor>
                        <el-button size="small" type="primary" class="addBtn" @click="submit">添加</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
            <img :src="filePath" alt="" class="preview-img">
        </el-dialog>
    </div>
</template>

<script>
    import {
        quillEditor
    } from "vue-quill-editor"; //调用编辑器
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import breadCrumb from '../components/Breadcrumb'
    export default {
        components: {
            breadCrumb,
            quillEditor
        },
        computed: {
            cateId() {
                if (this.addForm.selecOptions.length === 3) {
                    return this.addForm.selecOptions[2]
                }
                return null
            }
        },
        data() {
            return {
                dialogVisible: false,
                active: '0',
                addForm: {
                    goodsname: '',
                    goodsprice: 0,
                    goodsweight: 0,
                    goodsnum: 0,
                    selecOptions: [],
                    pics: [],
                    goodsintroduce: ''
                },
                ruleForm: {
                    goodsname: [{
                        required: true,
                        message: '请输入商品名称',
                        trigger: 'blur'
                    }],
                    goodsprice: [{
                        required: true,
                        message: '请输入商品价格',
                        trigger: 'blur'
                    }],
                    goodsweight: [{
                        required: true,
                        message: '请输入商品重量',
                        trigger: 'blur'
                    }],
                    goodsnum: [{
                        required: true,
                        message: '请输入商品数量',
                        trigger: 'blur'
                    }]
                },
                categoriesList: [],
                catePrps: {
                    label: 'catename',
                    value: 'cateid',
                    children: 'children'
                },
                manyTableDate: [],
                // 上传请求头
                headerObj: {
                    Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
                },
                // 图片预览路径
                filePath: ''
            }
        },
        methods: {
            // 获取商品分类数组
            async getCategories() {
                let res = await this.$http.get('categories')
                if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
                this.categoriesList = res.data
            },
            // 监听级联选择器变化
            handleChange() {
                if (this.addForm.selecOptions.length < 3) {
                    this.addForm.selecOptions = []
                }
            },
            // 标签页里切换前钩子函数
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.selecOptions.length < 3) {
                    this.$message.error('请选择商品分类')
                    return false
                }
            },
            // tab选中事件
            async tabClick() {
                if (this.active === '1') {
                    let res = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'many'
                        }
                    })
                    if (res.meta.status !== 200) return this.$message.error('获取商品分类属性列表失败')
                    this.manyTableDate = res.data
                    this.manyTableDate.forEach(item => {
                        item.attrcontent = item.length === 0 ? [] : item.attrcontent.split(' ')
                    })
                }
            },
            // 处理图片预览效果
            handlePreview(file) {
                console.log(file)
                this.filePath = file.response.data.url
                this.dialogVisible = true
            },
            // 处理图片移除
            handleRemove(file) {
                console.log(file)
                this.addForm.pics.splice(this.addForm.pics.findIndex(item => {
                    item.pic === file.response.data.path
                }), 1)
                console.log(this.addForm.pics)
            },
            // 处理图片上传成功
            handleSuccess(res) {
                console.log(res)
                const picInfo = {
                    pic: res.data.path
                }
                this.addForm.pics.push(picInfo)
            },
            // 提交表单
            submit() {
                this.$refs.ruleForm.validate(valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项')
                    }
                    this.$router.push('/goods')
                })
            }
        },
        created() {
            this.getCategories()
        }
    }
</script>

<style lang='less' scoped>
    .box-card {
        margin-top: 20px;
        font-size: 15px;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    }

    .el-steps {
        margin: 20px 0;
    }

    .el-step__title {
        font-size: 13px !important;
    }

    .el-checkbox {
        margin: 0;
    }

    .preview-img {
        width: 100%;
    }
    /deep/.ql-editor{
        min-height: 300px!important;
    }
    .addBtn{
        margin-top: 15px;
    }
</style>