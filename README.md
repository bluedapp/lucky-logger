
# lucky-logger

[![npm version][npm-image]][npm-url]

A simple logging library...

## Installation

``` js
$ npm install lucky - logger
```

## Usage

``` javascript
const Koa = require('koa')
const Router = require('koa-router')
const luckylogger = require('lucky-logger')

const app = new Koa()
const router = new Router()

const logger = luckylogger()

router.get('/', (ctx, next) => {
  logger.info({
    notice: 'I lose what i love most...'
  })
  logger.warn({
    notice: 'I also want to look for a girlfriend...'
  })
  try {
    alert(err)
  } catch (err) {
    logger.error(err, {
      notice: 'Who is my love match?'
    })
  }

  ctx.body = 'Hello World'
})

app.use(router.routes())

app.listen(0258)
```

## Options

``` js
// defaults options
{
  appName: 'app',
  dailyRotateFile: {
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    maxSize: '100m',
  },
  fileName: 'app',
  root: path.join(path.dirname(__dirname), '../logs'),
}
```

## License

  [MIT License](http://www.opensource.org/licenses/mit-license.php)
 
[npm-image]: https://img.shields.io/npm/v/lucky-logger.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lucky-logger
