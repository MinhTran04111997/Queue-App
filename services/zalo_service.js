const axios = require('axios')
const BASE_URL= 'https://openapi.zalo.me/'

const zaloNumbercall = async (data) =>{
    const config = {
        headers: { access_token: process.env.ZALO_KEY },
    }
    const path= 'v2.0/oa/getprofile?data='+data
    const response= await axios.get(`${BASE_URL+path}`, config)
    return response.data
}

module.exports ={zaloNumbercall}

