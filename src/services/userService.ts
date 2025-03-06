import {DecodedToken, UserMiddleware, UserProfile} from '../types/user.types'
import {AvatarGenerator} from 'random-avatar-generator'
import {GUEST_ROLE_ID, GUEST_TARIFF_ID, PREFIX_FP_UUID} from '../config/user'

const generator = new AvatarGenerator()

export const userSocketDto = (user: DecodedToken): UserMiddleware => {
  return {
    uuid: user.uuid,
    role_id: user.role_id,
    tariff_id: user.tariff_id
  }
}

export const generateGuestSocket = (token: string): UserMiddleware => {
  return {
    uuid: token,
    role_id: GUEST_ROLE_ID,
    tariff_id: GUEST_TARIFF_ID
  }
}

export const generateGuestProfile = (uuid: string): UserProfile => {
  return {
    uuid,
    email: '',
    role_id: GUEST_ROLE_ID,
    tariff_id: GUEST_TARIFF_ID,
    first_name: 'Guest',
    second_name: 'User',
    avatar_url: generator.generateRandomAvatar()
  }
}

export const separateUserByAuth = (arr: string[]): {fpIds: string[]; tokenIds: string[]} => {
  const fpIds: string[] = []
  const tokenIds: string[] = []

  arr.forEach(item => {
    if (item.startsWith(PREFIX_FP_UUID)) {
      fpIds.push(item)
    } else {
      tokenIds.push(item)
    }
  })

  return {fpIds, tokenIds}
}
