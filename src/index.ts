import {createServer} from 'http'
import {createSocketMessenger} from './services/socketService'
import express, {Express} from 'express'
import {SocketController} from './controllers/socketController'
import {OnlineController} from './controllers/onlineController'
import {join} from 'path'
import {config} from './config/env'

const app: Express = express()
const httpServer = createServer(app)
const io = createSocketMessenger(httpServer)

const onlineController = new OnlineController()

// Настройка статических файлов
app.use(express.static(join(__dirname, '../public')))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'))
})

// Инициализируем контроллер сокетов
new SocketController(io, onlineController)

httpServer.listen(config.port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running on port http://localhost:${config.port}`)
  } else {
    console.log(`Server running on port ${config.port}`)
  }
})
