import {generateGuestProfile, separateUserByAuth} from '../services/userService'
import {DatabaseController} from './databaseController'

export class OnlineController {
  private readonly storage: Map<string, Set<string>>
  private db: DatabaseController

  constructor() {
    this.storage = new Map() // 🟢 userId -> Set<socketId>
    this.db = new DatabaseController()
  }

  list() {
    return this.storage
  }

  add(user_uuid: string, socket_id: string) {
    console.log(`✅ User: ${user_uuid} (socket: ${socket_id})`)

    if (!this.storage.has(user_uuid)) {
      this.storage.set(user_uuid, new Set())
    }
    this.storage.get(user_uuid)!.add(socket_id)
  }

  remove(user_uuid: string, socket_id: string) {
    console.log(`❌ User: ${user_uuid} (socket: ${socket_id})`)

    const sockets = this.storage.get(user_uuid)
    if (sockets) {
      sockets.delete(socket_id)
      if (sockets.size === 0) {
        this.storage.delete(user_uuid)
      }
    }
  }

  getSockets(user_uuid: string) {
    return Array.from(this.storage.get(user_uuid) || [])
  }

  getAllUsers(): string[] {
    return Array.from(this.storage.keys())
  }

  async getAllUsersFromDB() {
    const userIds = this.getAllUsers()

    if (userIds.length === 0) {
      return []
    }

    try {
      const {tokenIds, fpIds} = separateUserByAuth(userIds)

      const fpList = fpIds.map(uuid => generateGuestProfile(uuid))
      const tokenList = await this.db.getUsersByIds(tokenIds)

      return [...tokenList, ...fpList]
    } catch (error) {
      console.error('❌ Error fetching online users:', error)
      return []
    }
  }
}
