const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
  name: String,
  phonenumber: {
      type: String,
      minLength: 5,
      required: true,
    },
  ordernumber: Number,
  services: String,
  date:{
    type: Date,
    required: false
  } 
})

customerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer