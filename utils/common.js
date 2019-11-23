/**
 * Error Messages
 * @param {Object} err error
 */
function handleError (err) {
  let error = null

  if (judgeType(err) === 'error') {
    error = {
      name: err.name,
      message: err.message,
      stack: err.stack,
      fileName: err.fileName || '',
      lineNumber: err.lineNumber || '',
      columnNumber: err.columnNumber || '',
    }
  }

  return error
}
/**
 * Custom Messages
 * @param {Object} data
 */
function handleMessage (data) {
  let result = null
  const type = judgeType(data)

  if (!data) {
    result = null
  } else if (type === 'object') {
    result = data
  } else if (Array.isArray(data)) {
    result = data.join(',')
  } else if (type === 'string') {
    result = data
  }

  return result
}

/**
 * other
 * Log Messages
 * @param {Object} {} err、message、time
 */
function handleDefault ({ err, message, time } = {}) {
  const response = {
    msg: handleMessage(message),
  }

  const error = handleError(err)
  if (error) {
    response.error = error
  }

  if (time) {
    response.res.responseTime = time
  }

  return response
}

/**
 * Type
 * @param {anything} param value
 * [object String]\[object Number]\[object Array]\[object Object]\[object Promise]
 * [object Boolean]\[object Undefined]\[object Null]\[object Date]\[object Function]
 * [object RegExp]\[object Error]\[object HTMLDocument]\[object global]\[object Symbol]\[object Set]
 */

function judgeType (param) {
  return Object.prototype.toString.call(param).slice(8, -1).toLocaleLowerCase()
}

// log type
const levels = [
  {
    color: 'red',
    icon: '✖',
    type: 'error',
  },
  {
    color: 'yellow',
    icon: '✎',
    type: 'warn',
  },
  {
    color: 'green',
    icon: '✔',
    type: 'info',
  },
]

module.exports = {
  handleDefault,
  judgeType,
  levels,
}
