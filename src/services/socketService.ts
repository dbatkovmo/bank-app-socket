import {Server as HttpServer} from 'http'
import {Server} from 'socket.io'

export const createSocketMessenger = (httpServer: HttpServer): Server => {
  return new Server(httpServer, {
    cors: {
      origin: '*',
      credentials: true
    }
  })
}

export const createSocketClient = (httpServer: HttpServer): Server => {
  return new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'https://bank-just.web.app'],
      credentials: true
    }
  })
}
