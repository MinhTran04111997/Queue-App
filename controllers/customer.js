const customerRouter = require('express').Router()
const Customer = require('../models/customer')
const Workflow = require('../models/workflow')

let serviceCount1=[]
let serviceCount2=[]
let serviceCount3=[]
let serviceList= []
const initQueue = async ()=>{
    const service = await Workflow.find({})
    service.forEach(elem=> serviceList.push(elem.name))
    console.log(serviceList)
    let i=0
    for (elem of serviceList){
        const count= await Customer.count({services: elem})
        console.log(count)
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
console.log(serviceCount1)

customerRouter.get('/api/services', async (req,res)=>{
    const service = await Workflow.find({})
    let serviceList= []
    service.forEach(elem=> serviceList.push(elem.name))
    res.json(serviceList)
})

customerRouter.post('/api/customer',async (req,res)=>{
    const {phonenumber, services} = req.body
    const index=serviceList.indexOf(services)
    if(index ==0){
        ordernumber=serviceCount1.shift()+1
    }
    if(index ==1){
        ordernumber=serviceCount2.shift()+1
    }
    if(index ==2){
        ordernumber=serviceCount3.shift()+1
    }
    const date= new Date
    const customer = new Customer({
        phonenumber,
        ordernumber,
        services,
        date,
    })
    const savedCustomer = await customer.save()
    res.status(201).json(savedCustomer)
})

module.exports = customerRouter

