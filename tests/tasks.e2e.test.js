const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../src/app')

let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
})

describe('Tasks API', () => {
  test('POST /api/tasks creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Write tests', description: 'API validations' })
      .expect(201)
    expect(res.body.data).toHaveProperty('_id')
    expect(res.body.data.title).toBe('Write tests')
  })

  test('POST /api/tasks validation error when title missing', async () => {
    const res = await request(app).post('/api/tasks').send({}).expect(422)
    expect(res.body.error).toBeDefined()
  })

  test('GET /api/tasks returns list', async () => {
    const res = await request(app).get('/api/tasks').expect(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  test('GET /api/tasks/:id returns 422 for invalid id', async () => {
    await request(app).get('/api/tasks/not-an-id').expect(422)
  })

  test('GET /api/tasks/:id returns 404 when missing', async () => {
    const { body } = await request(app)
      .post('/api/tasks')
      .send({ title: 'Temp' })
      .expect(201)
    const id = body.data._id
    await request(app).delete(`/api/tasks/${id}`).expect(204)
    await request(app).get(`/api/tasks/${id}`).expect(404)
  })

  test('PUT /api/tasks/:id updates a task', async () => {
    const { body } = await request(app)
      .post('/api/tasks')
      .send({ title: 'Update me' })
      .expect(201)
    const id = body.data._id
    const res = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ completed: true })
      .expect(200)
    expect(res.body.data.completed).toBe(true)
  })

  test('DELETE /api/tasks/:id deletes a task', async () => {
    const { body } = await request(app)
      .post('/api/tasks')
      .send({ title: 'Delete me' })
      .expect(201)
    const id = body.data._id
    await request(app).delete(`/api/tasks/${id}`).expect(204)
  })
})

