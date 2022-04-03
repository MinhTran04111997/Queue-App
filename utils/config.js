require('dotenv').config()

const PORT = process.env.PORT || 3001
//const MONGODB_URI = process.env.NODE_ENV === 'test' 
  //? process.env.TEST_MONGO_URI
 // : process.env.MONGO_URI
 const MONGODB_URI = process.env.MONGO_URI

module.exports = {
  MONGODB_URI,
  PORT
}