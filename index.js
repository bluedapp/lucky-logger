const colors = require('colors')
const fs = require('fs')
const mkdirp = require('mkdirp')
const moment = require('moment')
const path = require('path')
const winston = require('winston')
const { handleDefault, levels } = require('./utils/common')
require('winston-daily-rotate-file')

const development = process.env.NODE_ENV === 'development'
const production = process.env.NODE_ENV === 'production'
const localPath = path.join(path.dirname(__dirname), '../logs')
const servePath = '/data/logs/'
const situation = !(development || production)
const root = !situation ? servePath : localPath

/**
 * luckyLogger
 * @param {Object} config attribute
 */
function luckyLogger (config = {}) {
  const defaults = {
    appName: 'app',
    dailyRotateFile: {
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      maxSize: '100m'
    },
    fileName: 'app',
    format: winston.format.json(),
    root
  }

  const options = Object.assign({}, defaults, config)
  let logsPath = path.join(options.root, options.appName)

  // log output directory
  if (!fs.existsSync(logsPath)) {
    try {
      mkdirp.sync(logsPath)
    } catch (err) {
      console.log(colors.red(`Create '${servePath}' directory is failure!`))
      logsPath = path.join(localPath, options.appName)
      mkdirp.sync(logsPath)
    }
  }

  const createLogger = data => winston.createLogger(data)
  const timestamp = () => moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { datePattern, maxFiles, maxSize } = options.dailyRotateFile

  const openMeans = {}
  levels.forEach(data => {
    const logger = createLogger({
      level: 'verbose',
      format: options.format,
      transports: [
        new (winston.transports.DailyRotateFile)({
          datePattern,
          filename: path.join(logsPath, `${options.fileName}.${data.type}-%DATE%.log`),
          maxFiles,
          maxSize
        })
      ]
    })

    // If it is a local environment
    // The log will be displayed in the terminal
    if (situation) {
      const pass = (data.type === 'info' || data.type === 'warn')
      logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.printf(info => {
            const { message } = info
            const news = pass ? colors[data.color](JSON.stringify(message)) : colors[data.color](message)
            const response = `[${timestamp()}][${data.type}] ${data.icon} \n${news}`
            return response
          })
        )
      }))
    }

    openMeans[data.type] = logger
  })

  /**
   * handleLogger
   * Consolidation log
   * @param {Object} data
   */
  function handleLogger ({ level, datum } = {}) {
    const data = Object.assign({}, datum, {
      timestamp: timestamp()
    })
    openMeans[level.type][level.type](data)
  }

  /**
   * handleDaily
   */
  function handleDaily () {
    const result = {}
    levels.forEach(data => {
      const content = {
        error: null,
        message: null
      }

      result[data.type] = (...args) => {
        if (args.length > 0) {
          const temp = args[0]
          if (data.type === 'error') {
            content.error = temp
            content.message = args[1] || null
          } else {
            content.message = temp
          }
        }

        const datum = handleDefault({
          err: content.error,
          message: content.message
        })

        handleLogger({
          level: data,
          datum
        })
      }
    })

    return result
  }

  return handleDaily()
}

module.exports = luckyLogger
