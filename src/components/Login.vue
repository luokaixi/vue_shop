<template>
    <div class='login'>
        <div class="login-box">
            <div class="avatar-box">
                <img src="../assets/img/logo.png" alt="">
            </div>
            <el-form ref="loginForm" :model="form" :rules="loginRules">
                <el-form-item prop="name">
                    <el-input v-model="form.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名" autofocus></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" prefix-icon="iconfont icon-password" placeholder="请输入密码" type="password" show-password @keyup.enter.native="onSubmit"></el-input>
                </el-form-item>
                <el-form-item class="btn-box">
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                    <el-button type="info" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                username: '',
                password: '',
                isLoading: false
            },
            // 登录表单验证对象
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        reset () {
            this.$refs.loginForm.resetFields()
        },
        onSubmit () {
            if (this.isLoading) return
            this.isLoading = true
            this.$refs.loginForm.validate((valid, content) => {
                if (!valid) return
                this.$http.post('login', this.form).then(res => {
                    if (res.meta.status == 200) {
                        this.$message.success('登录成功')
                        sessionStorage.setItem('token', res.data.token)
                        if (this.$route.query.redirect){
                            this.$router.replace({
                                path: this.$route.query.redirect
                            })
                        } else {
                            this.$router.push('/home')
                        }
                    } else {
                        this.$message.error('登录失败')
                    }
                }).finally(() => {
                    this.isLoading = false
                })
            })
        }
    },
    created () {}
}
</script>

<style lang='less' scoped>
.login{
    height: 100%;
    background: #2b4b6b;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-box{
        width: 450px;
        height: 300px;
        background: #ffffff;
        border-radius: 3px;
        position: relative;
        padding: 80px 25px 0px 25px;
        .avatar-box{
            height: 130px;
            width: 130px;
            border-radius: 50%;
            background: #ffffff;
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%, -50%);
            padding: 10px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px #ddd;
            img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
                background: #eee;
            }
        }
        .btn-box{
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>