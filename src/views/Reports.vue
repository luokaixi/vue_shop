<template>
    <div class='box'>
        <!-- 面包屑导航 -->
        <bread-crumb :title="{name1: '数据统计',name2: '数据报表'}"></bread-crumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-button type="primary" @click="download">下载图片</el-button>
            <div  ref="myCharts" style="width:800px;height:400px;"></div>
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
                options: {
                    title: {
                        text: '未来一周气温变化', //图表顶部的标题 
                        subtext: '纯属虚构' //副标题
                    },
                    tooltip: { //鼠标悬浮框的提示文字
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['最高气温', '最低气温']
                    },
                    xAxis: [{ //x轴坐标数据
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }],
                    yAxis: [{ //y轴坐标数据
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} °C'
                        }
                    }],
                    series: [ //驱动图表生成的数据内容数组，几条折现，数组中就会有几个对应对象，来表示对应的折线
                        {
                            name: "最高气温",
                            type: "line", //pie->饼状图  line->折线图  bar->柱状图
                            data: [11, 11, 15, 13, 12, 13, 10],
                        },
                        {
                            name: "最低气温",
                            type: "line", //pie->饼状图  line->折线图  bar->柱状图
                            data: [1, -2, 2, 5, 3, 2, 0],
                        }
                    ]
                }
            }
        },
        methods: {
            download() {
                this.$http({
                    url: `${this.$http.defaults.baseURL}/download`,
                    methods: 'get',
                    responseType: 'blob'
                }).then(res => {
                    console.log(res)
                    let blob = new Blob([res], {
                        type: 'image/jpeg'
                    })
                    let url = window.URL.createObjectURL(blob)
                    console.log(url)
                    let a = document.createElement('a')
                    a.style.display = 'none'
                    a.href = url
                    a.download = ''
                    a.click()
                })
            }
        },
        created() {},
        mounted() {
            let  myCharts = this.$echarts.init(this.$refs.myCharts)
            myCharts.setOption(this.options)
        }
    }
</script>

<style lang='less' scoped>

</style>