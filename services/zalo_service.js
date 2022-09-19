const axios = require('axios')
const BASE_URL= 'https://oauth.zaloapp.com/v4/oa/access_token'

const zaloGetKey = async (data) =>{
    const config = {
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            secret_key: process.env.ZALO_KEY,
        },
    }
    const response= await axios.post(BASE_URL,data, config)
    return response.data
}


const zaloSentMessage = async (access_token, data) =>{
    const config = {
        headers: { 
            'Content-Type': 'application/json',
            "access_token": access_token
        },
    }
    const response= await axios.post('https://business.openapi.zalo.me/message/template',data, config)
    return response.data
}

module.exports ={zaloGetKey, zaloSentMessage}

