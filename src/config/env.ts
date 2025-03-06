import dotenv from 'dotenv'

const env = process.env.NODE_ENV || 'development'
dotenv.config({path: `.env.${env}`})

export const config = {
  port: process.env.PORT || 5050,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'u12850_bank',
    password: process.env.DB_PASSWORD || '0R9z1K6r',
    database: process.env.DB_NAME || 'u12850_bank'
  },
  jwtSecret: process.env.JWT_SECRET || '1a2b-3c4d-5e6f-7g8f'
}
