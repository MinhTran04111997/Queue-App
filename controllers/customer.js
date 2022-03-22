const customerRouter = require('express').Router()
const Customer = require('../models/customer')
const Workflow = require('../models/workflow')

let serviceCount1=[]
let serviceCount2=[]
let serviceCount3=[]
let serviceListGlobal= []
const initQueue = async ()=>{
    serviceCount1=[]
    serviceCount2=[]
    serviceCount3=[]
    const service = await Workflow.find({})
    service.forEach(elem=> serviceListGlobal.push(elem.name))
    let i=0
    for (elem of serviceListGlobal){
        const count= await Customer.count({services: elem})
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
    const service = await Workflow.find({})
    service.forEach(elem=> {
        serviceList.push(elem.name)
        if(serviceListGlobal.length<3){
            serviceListGlobal.push(elem.name)
        }
    })
    res.json(service)
})

customerRouter.post('/api/customer',async (req,res)=>{
    const {phonenumber, services, verify} = req.body
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
    if(verify ==0){
        ordernumber=serviceCount1.shift()+1
    }
    if(verify ==1){
        ordernumber=serviceCount2.shift()+1
    }
    if(verify ==2){
        ordernumber=serviceCount3.shift()+1
    }
    const date= new Date
    const customer = new Customer({
        phonenumber,
        ordernumber,
        services,
        date,
    })
    console.log(customer)
    const savedCustomer = await customer.save()
    res.status(201).json(savedCustomer)
})

module.exports = customerRouter

