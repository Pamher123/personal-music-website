import axios from 'axios'

const $http =axios.create({
    timeout:5000,
    headers:{
        'Content-Type':'application/json; charset=utf-8',
    },
    baseURL:'/api',
})

export default $http