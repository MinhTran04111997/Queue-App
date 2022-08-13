const customerRouter = require('express').Router()
const { compareSync } = require('bcrypt')
const Customer = require('../models/customer')
const Workflow = require('../models/workflow')
const ZaloKey = require('../models/zaloKey')
const {zaloSentMessage} = require('../services/zalo_service')
const {format} = require('date-fns') 
require('express-async-errors')


let serviceCount1=[]
let serviceCount2=[]
let serviceCount3=[]
let serviceListGlobal= []
const initQueue = async ()=>{
    const date1= new Date()
    const dateFormat=format(date1, 'MM-dd-yyyy')
    serviceCount1=[]
    serviceCount2=[]
    serviceCount3=[]
    const service = await Workflow.find({})
    service.forEach(elem=> serviceListGlobal.push(elem.name))
    let i=0
    for (elem of serviceListGlobal){
        const count= await Customer.count({services: elem, date: dateFormat})
        if(i==0){
            serviceCount1.push(count)
        }
        if(i==1){
            serviceCount2.push(count)
        }
        if(i==2){
            serviceCount3.push(count)
        }
        i=i+1
    }
    for(let i=serviceCount1[0]; i<300;i++){
        serviceCount1.push(i+1)
    }
    for(let i=serviceCount2[0]; i<300;i++){
        serviceCount2.push(i+1)
    }
    for(let i=serviceCount3[0]; i<300;i++){
        serviceCount3.push(i+1)
    }
}
initQueue()

customerRouter.get('/api/services', async (req,res)=>{
    let serviceList=[]
    const services = await Workflow.find({})
    services.forEach(elem=> {
        serviceList.push(elem.name)
        if(serviceListGlobal.length<3){
            serviceListGlobal.push(elem.name)
        }
    })
    res.json(services)
})

const checkAvailability = async (req) => {
    const {phonenumber, services, date} = req
    const specificCustomer = await Customer.find({phonenumber: phonenumber, date: date, services: services}).sort({ordernumber: -1}).limit(1)
    console.log(specificCustomer)
    const service = await Workflow.findOne({name: services})
    console.log(service.currentNumber)
    if(specificCustomer[0] && service){
        if(specificCustomer[0].ordernumber > service.currentNumber){
            return false
         }else{
             return true
         }
    }else{
        return true
    }
}
const checkCurrentState = (verify, services)=>{
    let checking = serviceListGlobal.find(elem => elem === services)
    if(!checking){
        if(verify ==0){
            serviceListGlobal[verify]=services
            serviceCount1=[]
            for(let i=0; i<300;i++){
                serviceCount1.push(i)
            }
        }else if(verify ==1){
            serviceCount2=[]
            serviceListGlobal[verify]=services
            for(let i=0; i<300;i++){
                serviceCount2.push(i)
            }
        }else if(verify ==2){
            serviceCount3=[]
            serviceListGlobal[verify]=services
            for(let i=0; i<300;i++){
                serviceCount3.push(i)
            }
        }
    }
}
customerRouter.post('/api/customer',async (req,res)=>{
    const {name, phonenumber, services, verify, date} = req.body
    checkCurrentState(verify, services)
    const isEligible = await checkAvailability(req.body)
    console.log(isEligible)
    if(isEligible){
        if(verify ==0){
            ordernumber=serviceCount1.shift()+1
        }
        if(verify ==1){
            ordernumber=serviceCount2.shift()+1
        }
        if(verify ==2){
            ordernumber=serviceCount3.shift()+1
        }
        const customer = new Customer({
            name,
            phonenumber,
            ordernumber,
            services,
            date: date
        })
        const zalo_accessToken = await ZaloKey.findOne({})
        const newDate = new Date(date)
        const dateFormat = format(newDate, 'dd/MM/yyyy')
        const messageData = {
            phone: phonenumber.replace('0','84'),
            template_id: process.env.ZALO_TEMPLATE_ID,
            template_data: {
                service_name: services,
                queue_number: ordernumber,
                date: dateFormat
            },
            tracking_id: "tracking_id"
        }
        console.log(JSON.stringify(messageData))
        zaloSentMessage(zalo_accessToken.access_token, JSON.stringify(messageData)).then(response =>{console.log(response)})
        const savedCustomer = await customer.save()
        const yourOrder= {
            message: `Đăng kí thành công, số thứ tự của bạn là: ${savedCustomer.ordernumber}, vào ngày: ${date}`
        }
        res.status(201).json(yourOrder)
    }else{
        const errorMessage = {
            message: 'Số điện thoại này đã được đăng kí và chưa đến lượt'
        }
        res.status(200).json(errorMessage)
    }
        
})


module.exports = {customerRouter, initQueue}

