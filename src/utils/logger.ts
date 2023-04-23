import { createWriteStream } from 'fs'
import { createLogger, transports, format } from 'winston'

// create the logger configuration
const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.Stream({
      stream: createWriteStream('logs.txt'),
    }),
  ],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`
    }),
  ),
})

export default logger
