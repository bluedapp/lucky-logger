declare namespace logger {
  interface options {
    appName?: string
    fileName?: string
    root?: string
  }
}

declare namespace logger.options {
  interface dailyRotateFile {
    datePattern?: string
    maxFiles?: string
    maxSize?: string
  }
}

declare function luckyLogger(config?: logger.options): any

export = luckyLogger
