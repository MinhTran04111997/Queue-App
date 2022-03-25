const setupWorkspaceRouter = require('express').Router()
const Workflow = require('../models/workflow')
const Customer= require('../models/customer')
const { compareSync } = require('bcrypt')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }
const verifyToken = request =>{
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    } 
}
/**
 * at the endpoint /api/workspce
 * get all the service with totalQueue(count from db in model Customer)
 * and service name list and the status for isActive for each service 
 *   */    
    setupWorkspaceRouter.get('/', async(req,res)=>{
        verifyToken(req)
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

/**
 * add new services, can not add more than 3 services
 */
    setupWorkspaceRouter.post('/', async (req,res)=>{
        verifyToken(req)
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
/**
 * edit and service, if the service was not found on the
 * list of customer, the total queue will be reset to 0,
 * the already exist service will response with the total
 * queue found in db.
 */
    setupWorkspaceRouter.put('/', async (req,res)=>{
        verifyToken(req)
        const {oldName, name} = req.body
        const compare = await Workflow.findOne({name})
        if(compare){
            return response.status(404).json({
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
            return response.status(404).json({
                error: 'Can not found the service'
            })
          }
    })
/**
 * update the isActive status 
 */
    setupWorkspaceRouter.put('/toggle/change', async (req, res)=>{
        verifyToken(req)
        const {id, toggle} = req.body
        const service= await Workflow.findOneAndUpdate({_id: id}, {isActive: toggle}, {
            new: true,
            runValidators: true,
        })
        console.log(service)
        if(service){
            res.status(200).json({ service })
          }else{
            return response.status(404).json({
                error: 'Can not found the service'
            })
          }
    })
    


module.exports= setupWorkspaceRouter