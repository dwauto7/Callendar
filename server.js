const http = require('http')
const next = require('next')
const { parse } = require('url')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      const start = process.hrtime.bigint()

      res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1e6
        if (durationMs >= 500) {
          const url = req.url || '/'
          console.log(`[slow] ${req.method} ${url} ${durationMs.toFixed(1)}ms`)
        }
      })

      handle(req, res, parse(req.url, true))
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`)
    })
})
