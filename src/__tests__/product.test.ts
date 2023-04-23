import app from '../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { saveProduct } from '../service/product'
import { ProductCategory } from '../constants'
import { saveUser } from '../service/user'
import { generateJwtToken } from '../utils/token'
import { testUserPayloads } from './user.test'

export const testProductPayloads = [
  {
    name: 'an-awesome-product',
    description: 'an awesome product',
    category: ProductCategory.BOOKS,
    price: 1500,
    quantity: 12,
  },
]

// initialize the app server
app.init()

const server = app.app.listen(Number(process.env.PORT))

const api = supertest(server)

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), {
  })
})

afterAll(async () => {
  // close the mongodb connection
  await mongoose.disconnect()
  await mongoose.connection.close()
  await server.close()
})

describe('get a product', () => {
  describe('given invalid product id', () => {
    it('should return a 422', async () => {
      const res = await api.get(`/api/v1/products/abcd`)
      expect(res.statusCode).toBe(422)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given product does not exist', () => {
    it('should return a 404', async () => {
      const productId = new mongoose.Types.ObjectId().toString()
      const res = await api.get(`/api/v1/products/${productId}`)
      expect(res.statusCode).toBe(404)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given product exists', () => {
    it('should return a 200 and the product', async () => {
      const newProduct = await saveProduct(testProductPayloads[0])
      const res = await api.get(`/api/v1/products/${newProduct._id}`)
      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBe(true)
      const { product } = res.body.data
      expect(product.name).toBe(newProduct.name)
    })
  })
})

describe('create a product', () => {
  describe('given unauthenticated user request', () => {
    it('should return a 401', async () => {
      const res = await api.post(`/api/v1/products`).send(testProductPayloads[0])
      expect(res.statusCode).toBe(401)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given bad input', () => {
    it('should return a 400', async () => {
      const res = await api.post(`/api/v1/products`)
      expect(res.statusCode).toBe(400)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given authenticated user request', () => {
    it('should return a 201 and the saved product', async () => {
      const newUser = await saveUser(testUserPayloads[0])
      const accessToken = await generateJwtToken(newUser)
      const res = await api
        .post(`/api/v1/products`)
        .send(testProductPayloads[0])
        .set('Authorization', `Bearer ${accessToken}`)
      expect(res.statusCode).toBe(201)
      expect(res.body.status).toBe(true)
      const { data } = res.body
      expect(data._id).toStrictEqual(expect.any(String))
      expect(data.name).toBe(testProductPayloads[0].name)
    })
  })
})

// test fetch product by id
describe('fetch product by id', () => {
  describe('given invalid id', () => {})

  describe('given product does not exist', () => {})

  describe('given product exists', () => {})
})

// test fetch all products
describe('fetch all products', () => {
  describe('given no product exists', () => {})

  describe('given multiple products exist', () => {})
})

// test update product
describe('update product', () => {
  describe('given unauthenticated user request', () => {})

  describe('given bad input', () => {})

  describe('given authenticated user request', () => {})
})

// test delete product
describe('delete product', () => {
  describe('given unauthenticated user request', () => {})

  describe('given bad input', () => {})

  describe('given authenticated user request', () => {})
})
