import app from '../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as UserService from '../service/user'
import * as TokenService from '../service/token'
import * as ProductService from '../service/product'
import { basicDetails } from '../utils/basicDetails'
import { UserDocument } from '../models/User'
import { generateJwtToken } from '../utils/token'

// initialize the app server
app.init()

const server = app.app.listen(Number(process.env.PORT))

const api = supertest(server)

beforeAll(async () => {})

afterAll(async () => {
  await server.close()
})

export const testUserPayloads = [
  {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    phoneNumber: '0123456789',
    password: 'secret123!',
  },
]

export const mockUsers = [
  {
    role: 'user',
    isActive: true,
    isBanned: false,
    isEmailVerified: false,
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    phoneNumber: '0123456789',
    password: bcrypt.hashSync('secret123!'),
    createdAt: new Date('2023-01-30T06:10:48.857Z'),
    updatedAt: new Date('2023-01-30T06:10:48.857Z'),
  },
]

// test user registration
describe('register user', () => {
  describe('bad or empty input', () => {
    it('should return a 400', async () => {
      const res = await api.post('/api/v1/auth/register')

      expect(res.statusCode).toBe(400)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given the user already exists', () => {
    it('should return a 400', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(mockUsers[0])

      const res = await api.post('/api/v1/auth/register').send(testUserPayloads[0])

      expect(res.statusCode).toBe(400)
      expect(res.body.status).toBe(false)

      expect(findUserServiceMock).toHaveBeenCalledWith({ email: testUserPayloads[0].email })
    })
  })

  describe('given the user service throws an error', () => {
    it('should handle the error', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(null)

      const createUserServiceMock = jest
        .spyOn(UserService, 'saveUser')
        //@ts-ignore
        .mockRejectedValue('an error occurred!')

      const res = await api.post('/api/v1/auth/register').send(testUserPayloads[0])

      expect(res.statusCode).toBe(500)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given successful registration', () => {
    it('should return a 201', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(null)

      const createUserServiceMock = jest
        .spyOn(UserService, 'saveUser')
        //@ts-ignore
        .mockReturnValueOnce(mockUsers[0])

      const res = await api.post('/api/v1/auth/register').send(testUserPayloads[0])

      expect(res.statusCode).toBe(201)
      expect(res.body.status).toBe(true)
      const { user } = res.body.data
      expect(user).toEqual(basicDetails(mockUsers[0]))

      expect(findUserServiceMock).toHaveBeenCalledWith({ email: testUserPayloads[0].email })
      expect(createUserServiceMock).toHaveBeenCalledWith({
        ...testUserPayloads[0],
        password: expect.any(String),
      })
    })
  })
})

// test user login
describe('login user', () => {
  describe('bad or empty input', () => {
    it('should return a 400', async () => {
      const res = await api.post('/api/v1/auth/login')

      expect(res.statusCode).toBe(400)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given the account does not exist', () => {
    it('should return a 400', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(null)

      const res = await api.post('/api/v1/auth/login').send({
        email: testUserPayloads[0].email,
        password: testUserPayloads[0].password,
      })

      expect(res.statusCode).toBe(400)
      expect(res.body.status).toBe(false)

      expect(findUserServiceMock).toHaveBeenCalledWith({ email: testUserPayloads[0].email })
    })
  })

  describe('given the password is invalid', () => {
    it('should return a 400', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(mockUsers[0])

      const res = await api.post('/api/v1/auth/login').send({
        email: testUserPayloads[0].email,
        password: 'djknwkfnwkfn',
      })

      expect(res.statusCode).toBe(400)
      expect(res.body.status).toBe(false)

      expect(findUserServiceMock).toHaveBeenCalledWith({ email: testUserPayloads[0].email })
    })
  })

  describe('given the email and password are valid', () => {
    it('should return a 200 and user tokens', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(mockUsers[0])

      const createTokenMock = jest
        .spyOn(TokenService, 'saveToken')
        //@ts-ignore
        .mockReturnValueOnce({})

      const res = await api.post('/api/v1/auth/login').send({
        email: testUserPayloads[0].email,
        password: testUserPayloads[0].password,
      })

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBe(true)

      const { data } = res.body

      expect(data.accessToken).toStrictEqual(expect.any(String))
      expect(data.refreshToken).toStrictEqual(expect.any(String))

      expect(findUserServiceMock).toHaveBeenCalledWith({ email: testUserPayloads[0].email })
    })
  })
})

// test fetch user by id
describe('fetch user by id', () => {
  describe('given invalid id', () => {
    it('should return a 422', async () => {
      const res = await api.get('/api/v1/users/abcd')

      expect(res.statusCode).toBe(422)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given user does not exist', () => {
    it('should return a 404', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(null)

      const res = await api.get(`/api/v1/users/${mockUsers[0]._id}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given user exists', () => {
    it("should return a 200 and with the user and user's products", async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(mockUsers[0])

      const findUserProductsServiceMock = jest
        .spyOn(ProductService, 'findProducts')
        //@ts-ignore
        .mockReturnValueOnce([])

      const res = await api.get(`/api/v1/users/${mockUsers[0]._id}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBe(true)

      expect(findUserServiceMock).toHaveBeenCalledWith({ _id: mockUsers[0]._id })

      const { user, products } = res.body.data
      expect(products).toHaveLength(0)
    })
  })
})

// test fetch all users
describe('fetch all users', () => {
  describe('given no user exists', () => {
    it('should return an empty array of users', async () => {
      const findUsersServiceMock = jest
        .spyOn(UserService, 'findUsers')
        //@ts-ignore
        .mockReturnValueOnce([])

      const res = await api.get('/api/v1/users')

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBe(true)

      const { users } = res.body.data

      expect(users).toHaveLength(0)
    })
  })

  describe('given multiple users exist', () => {
    it('should return the array of users', async () => {
      const findUsersServiceMock = jest
        .spyOn(UserService, 'findUsers')
        //@ts-ignore
        .mockReturnValueOnce(mockUsers)

      const res = await api.get('/api/v1/users')

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBe(true)

      const { users } = res.body.data

      expect(users).toHaveLength(mockUsers.length)
    })
  })
})

// fetch authenticated user
describe('fetch authenticated user', () => {
  describe('given unauthenticated user request', () => {
    it('should return a 401', async () => {
      const res = await api.get(`/api/v1/user`)
      expect(res.statusCode).toBe(401)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given invalid jwt', () => {
    it('should return a 401', async () => {
      const res = await api.get(`/api/v1/user`).set('Authorization', `Bearer abcd`)
      expect(res.statusCode).toBe(401)
      expect(res.body.status).toBe(false)
    })
  })

  describe('given authenticated user request', () => {
    it('should return user data', async () => {
      const findUserServiceMock = jest
        .spyOn(UserService, 'findUser')
        //@ts-ignore
        .mockReturnValueOnce(mockUsers[0])

      const findUserProductsServiceMock = jest
        .spyOn(ProductService, 'findProducts')
        //@ts-ignore
        .mockReturnValueOnce([])

      const accessToken = await generateJwtToken(mockUsers[0])
      const res = await api.get(`/api/v1/user`).set('Authorization', `Bearer ${accessToken}`)

      console.log(res)
      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBe(true)

      const { user, products } = res.body.data
    })
  })
})

// test update user
describe('update user', () => {
  describe('given unauthenticated user request', () => {})

  describe('given bad input', () => {})

  describe('given authenticated user request', () => {})
})

// test delete user
describe('delete user', () => {
  describe('given unauthenticated user request', () => {})

  describe('given bad input', () => {})

  describe('given authenticated user request', () => {})
})
