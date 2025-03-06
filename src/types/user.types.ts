export interface UserMiddleware {
  uuid: string
  role_id: number
  tariff_id: number
}

export interface DecodedToken extends UserMiddleware {
  fp: string
  iat: number
  exp: number
}

export interface UserProfile extends UserMiddleware {
  email: string
  first_name: string
  second_name: string
  avatar_url: string
}
