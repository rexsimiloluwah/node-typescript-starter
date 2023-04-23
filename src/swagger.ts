import { Express, Request, Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Node.js TypeScript Starter Template - Updated',
      version: '0.1.0',
      description:
        'This is a simple Node.js+TypeScript starter template for building modern APIs quickly',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Similoluwa Okunowo',
        url: 'https://simiokunowo.netlify.app',
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://${process.env.SERVER_HOST || 'localhost'}:${process.env.PORT || 5040}/api/v1`,
        description: 'Development server',
      },
      {
        url: `http://${process.env.SERVER_HOST || 'localhost'}:${process.env.PORT || 5040}/api/v1`,
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes/*.ts','./src/schema/*.ts','./dist/routes/*.js','./dist/schema/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Express, port: number) {
  // Serve the swagger docs UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Serve the swagger documentation in JSON format
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

export default swaggerDocs
