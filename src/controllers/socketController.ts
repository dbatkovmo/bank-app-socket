import {OnlineController} from './onlineController'
import {Server, Socket} from 'socket.io'
import {authenticateSocket} from '../middlewares/authMiddleware'
import {socketEvents} from '../config/socket'

export class SocketController {
  private io: Server
  private onlineController: OnlineController

  constructor(io: Server, onlineController: OnlineController) {
    this.io = io
    this.onlineController = onlineController

    this.io.use(authenticateSocket) // middleware token
    this.registerSocket()
  }

  registerSocket() {
    this.io.on('connection', (socket: Socket) => {
      this.onlineController.add(socket.data.user.uuid, socket.id)
      this.registerUserEvents(socket)
    })
  }

  registerUserEvents(socket: Socket) {
    const eventHandlers = {
      [socketEvents.REGISTRY_USER]: () => this.registryUser(socket),
      [socketEvents.GET_ONLINE_USERS]: () => this.sendOnlineUsers(socket, true),
      [socketEvents.SEND_PRIVATE_MSG]: (data: any) => this.sendPrivateMsg(socket, data)
      // 📌 Здесь добавлять новые события
    }

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler)
    })

    socket.on('disconnect', () => this.handleDisconnect(socket))
  }

  handleDisconnect(socket: Socket) {
    const user = socket.data.user
    this.onlineController.remove(user.uuid, socket.id)
    this.sendOnlineUsers()
  }

  registryUser = (socket: Socket) => {
    // Отправляем подключившемуся пользователю его uuid
    socket.emit(socketEvents.REGISTRY_USER, socket.data.user.uuid)
    this.sendOnlineUsers(socket)
  }

  sendPrivateMsg = (socket: Socket, data: any) => {
    const senderId = socket.data.user.uuid

    const receiverSockets = this.onlineController.getSockets(data.receiverId)
    const senderSockets = this.onlineController.getSockets(senderId)

    const dataMsg = {
      senderId,
      message: data.message,
      timestamp: Date.now()
    }

    // todo тут записывать в хранилище смс

    // Отправляем получателю на все сессии
    receiverSockets.forEach(socketId =>
      this.io.to(socketId).emit(socketEvents.RECEIVE_PRIVATE_MSG, dataMsg)
    )
    if (data.receiverId !== senderId) {
      // Отправляем отправителю на все сессии, если он не является получателем (сам себе)
      senderSockets.forEach(socketId =>
        this.io.to(socketId).emit(socketEvents.RECEIVE_PRIVATE_MSG, dataMsg)
      )
    }
  }

  async sendOnlineUsers(socket: Socket | null = null, onlyToRequester: boolean = false) {
    const users = await this.onlineController.getAllUsersFromDB()

    if (onlyToRequester && socket) {
      // Отправляем только запросившему клиенту
      socket.emit(socketEvents.UPDATE_ONLINE_USERS, users)
    } else if (socket && !onlyToRequester) {
      // Отправляем всем, кроме подключившегося клиента
      socket.broadcast.emit(socketEvents.UPDATE_ONLINE_USERS, users)
    } else {
      // Отправляем всем клиентам
      this.io.emit(socketEvents.UPDATE_ONLINE_USERS, users)
    }
  }
}
