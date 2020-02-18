# Logino

```js
const logger = require('logino')
const log = logger({pid: process.pid} /* optional */, console.log)

log('Start')
// [{pid: ...}, 'Start']

const sublog = log.create('downstream' /* optional */)

sublog('Work')
// [{pid: ...}, 'downstream', 'Work']
```

If you need to queue the logs before an out function is ready, omit the `out`
function from initialization:

```js
const logger = require('logino')
const log = logger()

log('Start')
log('Work')

log.out(console.log)
// ['Start']
// ['Work']
```

Features:

- Layered and functional (logs bubble up)

  Bring logging into the "small reusable packages" era that Node.js and npm
  popularized by supporting deeply nested logging while preserving context.

  This is especially useful with asynchronous work such as serving HTTP
  requests: multiple requests may be interleaved and thus a "request ID" logged
  at the beginning is not easily connected to e.g. a log from the database
  driver.

- Structured data

  To raise the bar to modern standards from text logging, we should encourage
  structured data like JSON.

- Formatting is deferred/external

  Decouple logging and formatting of logging. This library does no formatting.

- Convention over implementation

  If you publish code others might depend on and want it to log stuff, make it
  accept a `log` function as argument and use that.

  Move the choice of logging software up from deep libraries to DevOps or
  sysadmins.

- No super globals

## Example

```js
const logger = require('logino')
const log = logger({pid: process.pid}, console.log)

const srv = http.createServer((req, res) => {
  const requestId = headers['x-request-id']

  log({requestId, method: req.method, url: req.url})

  serveRequest(log.create({requestId}), req, res)
})

srv.listen(process.env.PORT)
srv.on('listening', () => log({listening: true, port: process.env.PORT}))
srv.on('close', () => log({closed: true}))

setTimeout(() => srv.close(), 10 * 1000)

function serveRequest(log, req, res) {
  getSomethingFromDb(req, (err, result) => {
    if (err) {
      log({txt: 'Failed to get stuff from DB', err})
      res.statusCode = 500
      res.end()
    } else {
      log('Completed')
      res.end(result)
    }
  })
}

/*
[{pid: 34996}, {listening: true, port: 8080}]
[{pid: 34996}, {requestId: '9c4631af9f983dd05d4ca247c9d9ed01', method: 'GET', url: '/'}]
[{pid: 34996}, {requestId: '99fdcb31640ed528752a5b3f7dd5ea9e', method: 'GET', url: '/'}]
[{pid: 34996}, {requestId: '99fdcb31640ed528752a5b3f7dd5ea9e'}, 'Completed']
[{pid: 34996}, {requestId: '9c4631af9f983dd05d4ca247c9d9ed01'}, {txt: 'Failed to get stuff from DB', err: ...}]
[{pid: 34996}, {closed: true}]
*/
```
