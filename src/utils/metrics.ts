import express, { Request, Response } from 'express'
import client from 'prom-client'
import logger from './logger'

const app = express()

// historgram for response time of api routes in seconds
export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
})

// histogram for response time of database operations in seconds
export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success'],
})

export const startMetricsServer = (): void => {
  const collectDefaultMetrics = client.collectDefaultMetrics

  collectDefaultMetrics()

  app.get('/metrics', async (req: Request, res: Response) => {
    // expose the prometheus metrics endpoint
    res.set('Content-Type', client.register.contentType)

    return res.send(await client.register.metrics())
  })

  app.listen(9100, () => {
    logger.info('Metrics server is running on port 9100!')
  })
}
