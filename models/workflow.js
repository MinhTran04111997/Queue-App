const mongoose = require('mongoose')

const workflowSchema = mongoose.Schema({
        name: String,
        currentNumber: Number
})

workflowSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Workflow = mongoose.model('Workflow', workflowSchema)

module.exports = Workflow