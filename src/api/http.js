import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
import NProgress from 'nprogress'


const instance = axios.create({})

// instance.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1'
instance.defaults.baseURL = 'http://localhost:5000'
instance.defaults.timeout = 12000
instance.interceptors.request.use(
    config => {
        NProgress.start()
        const token = sessionStorage.getItem('token')
        token && (config.headers.Authorization = 'Bearer ' + token)
        console.log(config)
        return config
    },
    err => {
        Promise.reject(err)
    }
)

instance.interceptors.response.use(
    res => {
        NProgress.done()
        return res.data
    },
    err => {
        const { response: res } = err
        console.log(res)
        switch (res.status) {
            case 401:
                Message.error('登录过期，请重新登录')
                router.replace({
                    path: '/login',
                    query: {
                        redirect: router.currentRoute.path
                    }
                })
                break;
            
            default:
                break;
        }
        Message.error(err)
    }
)

export default instance