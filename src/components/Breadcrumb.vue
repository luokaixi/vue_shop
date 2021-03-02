<template>
    <div class='box'>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{title.name1}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{title.name2}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    props: ['title'],
    data () {
        return {}
    },
    methods: {},
    created () {}
}
</script>

<style lang='less' scoped>

</style>