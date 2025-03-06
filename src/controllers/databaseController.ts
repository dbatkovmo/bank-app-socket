import {db} from '../config/database'
import {RowDataPacket} from 'mysql2'
import {UserProfile} from '../types/user.types'

export class DatabaseController {
  private cache: Map<string, UserProfile[]> = new Map()

  async getUsersByIds(userIds: string[]): Promise<UserProfile[]> {
    if (!userIds.length) {
      return []
    }

    // Создаем уникальный ключ для кеша на основе массива userIds
    const cacheKey = userIds.sort().join(':') // Сортируем для консистентности

    // Проверяем, есть ли данные в кеше
    const cachedResult = this.cache.get(cacheKey)
    if (cachedResult) {
      return cachedResult
    }

    const placeholders = userIds.map(() => '?').join(',')
    const query = `SELECT uuid, email, role_id, tariff_id, first_name, second_name, avatar_url
                   FROM users
                   WHERE uuid IN (${placeholders})`

    try {
      const [rows] = await db.execute<RowDataPacket[]>(query, userIds)
      const users = rows as UserProfile[]

      // Сохраняем результат в кеш
      this.cache.set(cacheKey, users)

      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  // Метод для очистки кеша (опционально)
  clearCache() {
    this.cache.clear()
    console.log('Cache cleared')
  }

  // Метод для удаления конкретного ключа из кеша (опционально)
  invalidateCache(userIds: string[]) {
    const cacheKey = userIds.sort().join(':')
    this.cache.delete(cacheKey)
    console.log(`Cache invalidated for key: ${cacheKey}`)
  }
}
