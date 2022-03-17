const setupWorkspaceRouter = require('express').Router()
const Workflow = require('../models/workflow')

    
    setupWorkspaceRouter.get('/', async(req,res)=>{
        const workflowList= await Workflow.find({})
        res.json(workflowList)
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
        })
        const saveWorksapce = await workflow.save()
        res.status(201).json(saveWorksapce)
    })

    setupWorkspaceRouter.put('/', async (req,res)=>{
        console.log(req.body.name)
        const {oldName, name} = req.body
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


module.exports= setupWorkspaceRouter