const workspaceRouter = require('express').Router()
const Workflow= require('../models/workflow')
const Customer= require('../models/customer')
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

workspaceRouter.get('/:id', async (req,res)=>{
    verifyToken(req)
    const date = req.query.date
    const id = req.params.id
    const service= await Workflow.findOne({_id: id})
    const name= service.name
    const totalQueue= await Customer.count({services: name, date: date})
    const response ={
        service,
        totalQueue
    }
    console.log(date)
    if(!service){
        return res.status(401).json({
            error: 'Can not find service'
        })
    }
    res.status(200).json(response)
})

workspaceRouter.put('/:id', async(req,res)=>{
    verifyToken(req)
    const date = req.query.date
    const id = req.params.id
    const validator= await Workflow.findOne({_id: id})
    const name= validator.name
    const totalQueue= await Customer.count({services: name, date: date})
    if(validator.currentNumber >= totalQueue){
        return res.status(404).json({
            error: 'Current Queue can not bigger than total Queue'
          })
    }
    const service= await Workflow.findOneAndUpdate({ _id: id }, { $inc : { "currentNumber" : 1 } }, {
        new: true,
        runValidators: true,
      })
    if(!service){
        return res.status(404).json({
            error: 'Can not find service'
          })
    }
    const customer = await Customer.findOne({service: name, date: date, ordernumber: service.currentNumber })
    console.log(customer)
    let response = {}
    if(customer){
      response = {
        customer: customer,
        service: service
      }
    }else{
      response={
        service:service
      }
    }
    res.status(200).json(response)
})

workspaceRouter.put('/reset/:id', async(req,res) => {
  verifyToken(req)
  const id = req.params.id
  const service = await Workflow.findOneAndUpdate({_id: id}, {$set :{currentNumber: 0}}, {
    new: true,
    runValidators: true,
  })
  if(!service){
    return res.status(404).json({
        error: 'Can not find service'
      })
  }
  res.status(200).json(service)
})




module.exports = workspaceRouter