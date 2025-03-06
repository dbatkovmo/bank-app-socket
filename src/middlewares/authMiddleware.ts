import {Socket} from 'socket.io'
import {AuthService} from '../services/authService'
import {DecodedToken} from '../types/user.types'
import {generateGuestSocket, userSocketDto} from '../services/userService'

// Для мессенджера
export const authenticateSocket = async (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token

  if (!token) {
    return next(new Error('Authentication error: Token required'))
  }

  const decoded: DecodedToken | null = await AuthService.verifyTokenMessenger(token)

  socket.data.user = decoded ? userSocketDto(decoded) : generateGuestSocket(token)
  next()
}

// Для bank-app дашборда
export const isToken = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Token not passed'))

  try {
    socket.data.user = AuthService.verifyTokenStrict(token)
    next()
  } catch (error) {
    next(new Error('Invalid token'))
  }
}
