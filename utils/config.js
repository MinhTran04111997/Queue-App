require('dotenv').config()

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGO_URI

module.exports = {
  MONGODB_URI,
  PORT
}