const setupWorkspaceRouter = require('express').Router()
const Workflow = require('../models/workflow')
const Customer= require('../models/customer')
const { compareSync } = require('bcrypt')

    
    setupWorkspaceRouter.get('/', async(req,res)=>{
        let currentCount=[] 
        let serviceList=[]
        let isActiveList = []
        const workflowList= await Workflow.find({})
        workflowList.forEach(elem => {
            serviceList.push(elem.name)
            isActiveList.push(elem.isActive)
        })
        for (elem of serviceList){
        const count= await Customer.count({services: elem})
        currentCount.push(count)
        }
        const response ={
            workflowList,
            currentCount,
            isActiveList
        }
        res.json(response)
    })

    setupWorkspaceRouter.post('/', async (req,res)=>{
        const workflowList= await Workflow.find({})
        if(workflowList.length>2){
            return res.status(400).json({
                error: 'Can not add more than 3 services'
            })
        }
        const {name} = req.body
        const currentNumber=0
        const workflow = new Workflow({
            name, 
            currentNumber,
            isActive: true
        })
        const saveWorksapce = await workflow.save()
        res.status(201).json(saveWorksapce)
    })

    setupWorkspaceRouter.put('/', async (req,res)=>{
        const {oldName, name} = req.body
        const compare = await Workflow.findOne({name})
        if(compare){
            return response.status(401).json({
                error: 'The Service is already exist'
            })
        }
        const filter= {"name": oldName}
        const workflow = await Workflow.findOneAndUpdate(filter, req.body, {
            new: true,
            runValidators: true,
          })
          if(workflow){
            res.status(200).json({ workflow })
          }else{
            return response.status(401).json({
                error: 'Can not found the service'
            })
          }
    })

    setupWorkspaceRouter.put('/toggle/change', async (req, res)=>{
        const {id, toggle} = req.body
        const service= await Workflow.findOneAndUpdate({_id: id}, {isActive: toggle}, {
            new: true,
            runValidators: true,
        })
        console.log(service)
        if(service){
            res.status(200).json({ service })
          }else{
            return response.status(401).json({
                error: 'Can not found the service'
            })
          }
    })
    


module.exports= setupWorkspaceRouter