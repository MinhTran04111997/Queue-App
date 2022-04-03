const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/services')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},100000)

afterAll(() => {
  mongoose.connection.close()
})