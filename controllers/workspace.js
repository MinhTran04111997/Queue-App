const workspaceRouter = require('express').Router()
const Workflow= require('../models/workflow')
const Customer= require('../models/customer')
const jwt = require('jsonwebtoken')
 
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    console.log(authorization)
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

workspaceRouter.get('/:id', async (req,res)=>{
    verifyToken(req)
    const id = req.params.id
    const service= await Workflow.findOne({_id: id})
    const name= service.name
    const totalQueue= await Customer.count({services: name })
    const response ={
        service,
        totalQueue
    }
    console.log(totalQueue)
    if(!service){
        return res.status(401).json({
            error: 'Can not find service'
        })
    }
    res.status(200).json(response)
})

workspaceRouter.put('/:id', async(req,res)=>{
    verifyToken(req)
    const id = req.params.id
    const validator= await Workflow.findOne({_id: id})
    const name= validator.name
    console.log(name)
    const totalQueue= await Customer.count({services: name})
    console.log(totalQueue)
    if(validator.currentNumber >= totalQueue){
        return res.status(404).json({
            error: 'Current Queue can not bigger than total Queue'
          })
    }
    const service= await Workflow.findOneAndUpdate({ _id: id }, { $inc : { "currentNumber" : 1 } }, {
        new: true,
        runValidators: true,
      })
    console.log(service)
    if(!service){
        return res.status(404).json({
            error: 'Can not find service'
          })
    }
    res.status(200).json(service)
})




module.exports = workspaceRouter