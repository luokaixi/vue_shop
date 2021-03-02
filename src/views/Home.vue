<template>
    <el-container class="home-box" :class="[isCollapse ? 'isCollapse' : 'noCollapse']">
        <!-- 头部 -->
        <el-header>
            <span>电商后台管理系统</span>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 侧边导航 -->
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggle">|||</div>
                <el-menu 
                background-color="#333744" 
                text-color="#fff" 
                active-text-color="#409EFE" 
                unique-opened 
                :collapse="isCollapse" 
                :collapse-transition="false"
                router
                :default-active="$route.path">
                    <el-submenu :index="item.id" v-for="(item, index) in menusList" :key="item.id">
                        <template slot="title">
                            <i :class="iconfont[index]"></i>
                            <span>{{item.authname}}</span>
                        </template>
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authname}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体内容 -->
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                menusList: [],
                iconfont:[
                    'iconfont icon-users',
                    'iconfont icon-tijikongjian',
                    'iconfont icon-shangpinguanli',
                    'iconfont icon-danju-tianchong',
                    'iconfont icon-baobiaobiaoweiguanli'
                ],
                isCollapse: false
            }
        },
        methods: {
            logout() {
                sessionStorage.removeItem('token')
                this.$router.push('/login')
            },
            getMenuList() {
                this.$http.get('menus').then(res => {
                    this.menusList = res.data.menus
                })
            },
            toggle(){
                this.isCollapse = !this.isCollapse
            }
        },
        created() {
            this.getMenuList()
        }
    }
</script>

<style lang='less' scoped>
    .el-header {
        background: #373D41;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 99;
    }

    .el-aside {
        background: #333744;
        transition: all .3s ease;
        position: fixed;
        left: 0;
        top: 60px;
        height: 100%;
        z-index: 99;
        .el-menu{
            border-right: none;
        }
        .toggle-button{
            text-align: center;
            cursor: pointer;
            color: #fff;
            font-size: 10px;
            background: #4A5064;
            letter-spacing: 3px;
            line-height: 30px;
        }
    }

    .el-main {
        background: #EAEDF1;
        
    }
    .main{
        transition: all .3s ease;
    }

    .home-box {
        height: 100%;
    }

    .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
    }
    .iconfont{
        margin-right: 10px;
    }
    .isCollapse{
        padding-left: 60px;
    }
    .noCollapse{
        padding-left: 200px;
    }
    .home-box{
        background: #EAEDF1;
        padding-top: 60px;
    }
</style>