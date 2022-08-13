const mongoose = require('mongoose')

const zaloSchema = mongoose.Schema({
  access_token: String,
  refresh_token: String
})

zaloSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const ZaloKey = mongoose.model('zaloKey', zaloSchema)

module.exports = ZaloKey