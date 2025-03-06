import jwt, {JwtPayload} from 'jsonwebtoken'
import {config} from '../config/env'
import {DecodedToken} from '../types/user.types'

export class AuthService {
  static generateToken(userId: string) {
    return jwt.sign({uuid: userId}, config.jwtSecret, {expiresIn: '24h'})
  }

  static verifyTokenMessenger(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, config.jwtSecret) as DecodedToken
    } catch (error) {
      return null
    }
  }

  static verifyTokenStrict(token: string): JwtPayload | string {
    return jwt.verify(token, config.jwtSecret)
  }
}
